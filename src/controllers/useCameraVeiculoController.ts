import { useRef, useState } from 'react';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { gerarPdfTermo } from '../utils/gerarPdfTermo';
import dayjs from 'dayjs';
import { useAcessoContext } from '../context/AcessoContext';

//const API_URL = 'http://192.168.253.18:3333';
const API_URL = 'http://192.168.250.235:3333';


export function useCameraVeiculoController() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();
  const [isProcessando, setIsProcessando] = useState(false);

  const { 
    dadosMotorista, 
    assinatura, 
    fotoMotorista, 
    adicionarAoHistorico, 
    limparDados,
    nomePorteiro
  } = useAcessoContext();

  async function handleTirarFotoVeiculo() {
    if (cameraRef.current && !isProcessando) {
      setIsProcessando(true);
      try {
        const foto = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        
        if (dadosMotorista && assinatura && fotoMotorista && foto?.uri) {
          
          
          const pdfUri = await gerarPdfTermo(
            dadosMotorista, 
            assinatura, 
            fotoMotorista, 
            foto.uri,
            nomePorteiro 
          );
          
          if (pdfUri) {
            
            const formData = new FormData();
            formData.append('nomePorteiro', nomePorteiro || 'Não informado');
            formData.append('nomeMotorista', dadosMotorista.nomeMotorista);
            formData.append('cpf', dadosMotorista.cpf);
            formData.append('empresa', dadosMotorista.empresa);
            formData.append('placa', dadosMotorista.placa);
            formData.append('setor', dadosMotorista.setor);

            
            formData.append('pdf', {
              uri: pdfUri,
              name: `termo-${dadosMotorista.cpf}.pdf`,
              type: 'application/pdf',
            } as any);

            
            console.log("Enviando dados para o servidor...");
            const resposta = await fetch(`${API_URL}/acessos`, {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            if (!resposta.ok) {
              throw new Error('Falha ao salvar no servidor.');
            }

            console.log("Sucesso! Salvo no banco de dados.");

            adicionarAoHistorico({
              id: String(Date.now()),
              nome: dadosMotorista.nomeMotorista,
              cpf: dadosMotorista.cpf, 
              data: dayjs().format('DD/MM/YYYY HH:mm'),
              uri: pdfUri
            });
          }

          Alert.alert('Sucesso!', 'Acesso registrado com sucesso!');
          limparDados();
          navigation.navigate('Home');
        }
      } catch (e) {
        console.error("Erro no fluxo final:", e);
        Alert.alert('Erro', 'Não foi possível enviar os dados para o servidor. Verifique a conexão.');
      } finally {
        setIsProcessando(false);
      }
    }
  }

  return { 
    permission, 
    requestPermission, 
    cameraRef, 
    handleTirarFotoVeiculo, 
    isProcessando 
  };
}