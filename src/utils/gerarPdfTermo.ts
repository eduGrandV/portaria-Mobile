import * as Print from "expo-print";
import { File } from "expo-file-system";
import dayjs from "dayjs";
import { AcessoFormData } from "../models/AcessoModel";

async function uriToBase64(uri: string) {
  try {
    const arquivo = new File(uri);
    const base64 = await arquivo.base64();
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Erro ao converter imagem no SDK 54:", error);
    return "";
  }
}

export async function gerarPdfTermo(
  dados: AcessoFormData,
  assinaturaBase64: string,
  fotoMotoristaUri: string,
  fotoCaminhaoUri: string,
  nomePorteiro: string
) {
  try {
    const fotoMotoristaB64 = await uriToBase64(fotoMotoristaUri);
    const fotoCaminhaoB64 = await uriToBase64(fotoCaminhaoUri);
    const dataAtual = dayjs().format("DD/MM/YYYY [às] HH:mm");

    // LÓGICA DO PLANO B: Verifica se foi assinado no dedo ou via RG
    const htmlAssinatura = assinaturaBase64 === "ASSINADO_VIA_RG"
      ? `
        <div style="background: #f0fdf4; border: 1px dashed #16a34a; padding: 15px; border-radius: 12px; margin-bottom: 10px;">
          <p style="color: #16a34a; font-weight: 700; font-size: 14px; text-align: center;">
            ✓ ASSINATURA FÍSICA DISPENSADA
          </p>
          <p style="color: #15803d; font-size: 12px; text-align: center; margin-top: 5px;">
            Identidade do motorista conferida visualmente pelo operador da portaria através de documento oficial (RG/CNH).
          </p>
        </div>
        `
      : `<img src="${assinaturaBase64}" class="assinatura-imagem" />`;


    const html = `
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background: white;
            }

            /* Container independente para cada página não travar o Android */
            .page-container {
              max-width: 900px;
              margin: 0 auto;
              padding: 30px;
            }

            .capa {
              background: #0a2f1f; 
              padding: 40px 40px 30px;
              border-radius: 20px 20px 0 0;
            }

            .selo {
              background: rgba(255, 255, 255, 0.1);
              padding: 10px 20px;
              border-radius: 100px;
              display: inline-block;
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: white;
              font-weight: 500;
              font-size: 14px;
              letter-spacing: 1px;
              margin-bottom: 25px;
            }

            .titulo-capa {
              color: white;
              font-size: 38px;
              font-weight: 700;
              line-height: 1.2;
              margin-bottom: 10px;
            }

            .subtitulo-capa {
              color: rgba(255, 255, 255, 0.7);
              font-size: 16px;
              font-weight: 300;
              margin-bottom: 30px;
            }

            .timestamp {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 30px;
              padding: 12px 20px;
              display: inline-flex;
              align-items: center;
              gap: 15px;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .timestamp span {
              color: white;
              font-weight: 500;
            }

            .timestamp .data-destaque {
              background: #eab308;
              color: #0a2f1f;
              padding: 5px 15px;
              border-radius: 30px;
              font-weight: 600;
            }

            .faixa-decorativa {
              background: #f8fafc;
              padding: 15px 40px;
              border-bottom: 1px solid #e2e8f0;
              border-left: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
              display: flex;
              gap: 30px;
              flex-wrap: wrap;
            }

            .tag {
              display: flex;
              align-items: center;
              gap: 8px;
              color: #475569;
              font-size: 14px;
            }

            .tag strong {
              color: #0a2f1f;
              font-weight: 600;
            }

            .conteudo {
              padding: 30px 40px;
              border-left: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
              border-bottom: 1px solid #e2e8f0;
              border-radius: 0 0 20px 20px;
            }

            .identificacao-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }

            .cartao-id {
              background: #ffffff;
              border-radius: 16px;
              padding: 20px;
              border: 1px solid #e2e8f0;
            }

            .label-cartao {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #64748b;
              margin-bottom: 5px;
            }

            .valor-cartao {
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
            }

            .declaracao {
              background: #f1f6fe;
              border-radius: 20px;
              padding: 25px;
              margin: 25px 0 0 0;
              border: 1px dashed #3b82f6;
            }

            .texto-declaracao {
              font-size: 16px;
              color: #1e293b;
              line-height: 1.6;
              font-style: italic;
            }

            .titulo-secao {
              font-size: 22px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 20px;
            }

            .timeline-item {
              display: flex;
              gap: 15px;
              margin-bottom: 15px;
              align-items: flex-start;
            }

            .timeline-marker {
              width: 35px;
              height: 35px;
              background: #0a2f1f;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 600;
              flex-shrink: 0;
            }

            .timeline-content {
              flex: 1;
              padding-bottom: 15px;
              border-bottom: 1px solid #e2e8f0;
            }

            .timeline-content p {
              font-size: 15px;
              color: #334155;
              line-height: 1.5;
            }

            .alerta-moderno {
              background: #fef9e7; 
              border-radius: 16px;
              padding: 20px;
              margin: 25px 0 0 0;
              display: flex;
              gap: 15px;
              align-items: center;
              border: 1px solid #fbbf24;
            }

            .alerta-texto {
              font-size: 15px;
              color: #854d0e;
              font-weight: 500;
            }

            .certificado-assinatura {
              background: white;
              border: 2px solid #e2e8f0;
              border-radius: 24px;
              padding: 30px;
              margin-bottom: 30px;
            }

            .assinatura-wrapper {
              display: flex;
              align-items: center;
              gap: 30px;
            }

            .assinatura-area {
              flex: 1;
            }

            .assinatura-label {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 5px;
            }

            .assinatura-imagem {
              max-width: 100%;
              height: 80px;
              object-fit: contain;
              background: #f8fafc;
              border-radius: 12px;
              padding: 10px;
              border: 1px dashed #0a2f1f;
            }

            .assinatura-nome-impresso {
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px dotted #cbd5e1;
            }

            .selo-autenticidade {
              background: #0a2f1f;
              color: white;
              padding: 15px 25px;
              border-radius: 50px;
              text-align: center;
            }

            .selo-autenticidade small {
              display: block;
              font-size: 10px;
              opacity: 0.7;
            }

            .grid-fotos {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }

            .card-foto {
              background: white;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            }

            .foto-container {
              height: 250px;
              overflow: hidden;
            }

            .foto-galeria {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .legenda-foto {
              padding: 15px;
            }

            .legenda-foto p {
              font-size: 15px;
              font-weight: 500;
              color: #0f172a;
            }

            .legenda-foto small {
              font-size: 13px;
              color: #64748b;
            }

            .rodape-documento {
              background: #0f172a;
              padding: 20px 30px;
              border-radius: 20px;
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .codigo-verificacao {
              font-family: monospace;
              background: #1e293b;
              padding: 10px 20px;
              border-radius: 12px;
              color: #86efac;
              font-size: 14px;
            }

            .copy-text {
              color: #94a3b8;
              font-size: 13px;
            }

            .page-break {
              page-break-before: always;
            }
          </style>
        </head>
        <body>
          
          <div class="page-container">
            <div class="capa">
              <div class="selo">DOCUMENTO OFICIAL</div>
              <h1 class="titulo-capa">Termo de Responsabilidade e Acesso</h1>
              <div class="subtitulo-capa">Grand Valle • Controle de Portaria</div>
              
              <div class="timestamp">
                <span>Data/Hora de Entrada:</span>
                <div class="data-destaque">${dataAtual}</div>
              </div>
            </div>

            <div class="faixa-decorativa">
              <div class="tag"><strong>Motorista:</strong> ${dados.nomeMotorista}</div>
              <div class="tag"><strong>Placa:</strong> ${dados.placa}</div>
              <div class="tag"><strong>Setor:</strong> ${dados.setor}</div>
            </div>

            <div class="conteudo">
              <div class="identificacao-grid">
                <div class="cartao-id">
                  <div class="label-cartao">Motorista</div>
                  <div class="valor-cartao">${dados.nomeMotorista}</div>
                </div>

                <div class="cartao-id">
                  <div class="label-cartao">CPF</div>
                  <div class="valor-cartao">${dados.cpf}</div>
                </div>

                <div class="cartao-id">
                  <div class="label-cartao">Empresa</div>
                  <div class="valor-cartao">${dados.empresa}</div>
                </div>

                <div class="cartao-id">
                  <div class="label-cartao">Autorizado por</div>
                  <div class="valor-cartao">${dados.autorizador}</div>
                </div>
              </div>

              <div class="declaracao">
                <p class="texto-declaracao">
                  "Declaro que recebi, li e estou ciente das normas internas abaixo descritas, 
                  comprometendo-me a cumpri-las integralmente durante minha permanência."
                </p>
              </div>
            </div>
          </div>

          <div class="page-break"></div>

          <div class="page-container">
            <h2 class="titulo-secao">Normas e Procedimentos</h2>

            <div class="timeline-item">
              <div class="timeline-marker">1</div>
              <div class="timeline-content"><p>Avisar com antecedência a visita;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">2</div>
              <div class="timeline-content"><p>Assinar o livro de presença na portaria;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">3</div>
              <div class="timeline-content"><p>Aguardar ser recepcionado pelo anfitrião da visita;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">4</div>
              <div class="timeline-content"><p>Aguardar vistoria do veículo, quando aplicável;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">5</div>
              <div class="timeline-content"><p>É proibida a entrada utilizando bermuda, saia, camiseta regata e chinelo;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">6</div>
              <div class="timeline-content"><p>Respeitar o limite de velocidade máxima de 20 km/h;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">7</div>
              <div class="timeline-content"><p>Colaborar com a limpeza, não jogando lixo no chão;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">8</div>
              <div class="timeline-content"><p>Informar à portaria sobre problemas de saúde ou ferimentos;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">9</div>
              <div class="timeline-content"><p>É proibido fumar nas dependências da fazenda;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">10</div>
              <div class="timeline-content"><p>É proibido realizar filmagens ou fotografias sem autorização;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">11</div>
              <div class="timeline-content"><p>Não tocar em frutos, equipamentos ou quaisquer objetos sem autorização;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">12</div>
              <div class="timeline-content"><p>Observar e seguir todas as instruções internas e sinalizações;</p></div>
            </div>

            <div class="timeline-item">
              <div class="timeline-marker">13</div>
              <div class="timeline-content"><p>Esclarecer dúvidas junto à portaria ou gerência.</p></div>
            </div>
            
            <div class="alerta-moderno">
              <div class="alerta-texto">
                <strong>AVISO:</strong> O descumprimento das normas poderá resultar na suspensão da visita e/ou impedimento de acesso futuro.
              </div>
            </div>
          </div>

          <div class="page-break"></div>

          <div class="page-container">
            <div class="certificado-assinatura">
              <div class="assinatura-wrapper">
                <div class="assinatura-area">
                  <div class="assinatura-label">Assinatura do Motorista</div>
                  
                  ${htmlAssinatura}
                  
                  <div class="assinatura-nome-impresso">${dados.nomeMotorista}</div>
                </div>
                <div class="selo-autenticidade">
                  <small>AUTENTICADO EM</small>
                  <strong>${dayjs().format("DD/MM/YYYY")}</strong>
                </div>
              </div>
            </div>

            <h2 class="titulo-secao">Registros Fotográficos</h2>

            <div class="grid-fotos">
              <div class="card-foto">
                <div class="foto-container">
                  <img src="${fotoMotoristaB64}" class="foto-galeria" />
                </div>
                <div class="legenda-foto">
                  <p>Registro do Motorista</p>
                  <small>Documentação de identificação</small>
                </div>
              </div>

              <div class="card-foto">
                <div class="foto-container">
                  <img src="${fotoCaminhaoB64}" class="foto-galeria" />
                </div>
                <div class="legenda-foto">
                  <p>Registro do Veículo</p>
                  <small>Placa: ${dados.placa}</small>
                </div>
              </div>
            </div>

            <div class="rodape-documento">
              <div class="codigo-verificacao">
                #${dayjs().format("YYYYMMDDHHmmss")}
              </div>
              <div class="copy-text">
                Registrado por: <strong>${nomePorteiro || 'Não informado'}</strong> | © Grand Valle
              </div>
            </div>
          </div>

        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return null;
  }
}