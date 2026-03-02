import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";
import { useAssinaturaController } from "../controllers/useAssinaturaController";

export function AssinaturaScreen() {
  const { handleSalvarAssinatura } = useAssinaturaController();
  const ref = useRef<SignatureViewRef>(null);
  
  // Estado para evitar que o usuário clique 10x no botão enquanto processa
  const [isProcessando, setIsProcessando] = useState(false);

  const webStyle = `.m-signature-pad--footer { display: none; margin: 0px; }`;

  // Função que a biblioteca chama quando o usuário tenta salvar um quadro em branco ou um rabisco muito pequeno
  const handleEmpty = () => {
    setIsProcessando(false);
    Alert.alert(
      "Quadro Vazio", 
      "Por favor, faça uma assinatura maior ou pressione um pouco mais forte na tela."
    );
  };

  const handleSignatureOK = (signature: string) => {
    // Se chegou aqui, a assinatura é válida e virou um Base64.
    handleSalvarAssinatura(signature);
    setIsProcessando(false);
  };

  const handleFinalizar = () => {
    setIsProcessando(true);
    // Esse comando manda a biblioteca "ler" o quadro. 
    // Se tiver tinta, ela chama o onOK. Se não, chama o onEmpty.
    ref.current?.readSignature();
    
    // Trava de segurança: se o WebView travar e não responder em 3 segundos, destrava o botão
    setTimeout(() => setIsProcessando(false), 3000);
  };

  const handleLimpar = () => {
    ref.current?.clearSignature();
  };

  // --- NOVA LÓGICA: PLANO B (RG) ---
  const handleAssinaturaRG = () => {
    Alert.alert(
      "Conferência de Documento",
      "Você confirma que conferiu o RG ou documento oficial do motorista fisicamente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, conferi", 
          onPress: () => {
            // Manda essa string específica no lugar do Base64 da imagem
            handleSalvarAssinatura("ASSINADO_VIA_RG");
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assinatura do Motorista</Text>

      <View style={styles.quadroContainer}>
        <SignatureScreen
          ref={ref}
          onOK={handleSignatureOK}
          onEmpty={handleEmpty} // CRUCIAL: Impede que o app trave em silêncio
          webStyle={webStyle}
          descriptionText="Assine aqui"
          minWidth={2} // Mais fino para melhorar a detecção de toques leves
          maxWidth={5}
          backgroundColor="#ffffff"
          penColor="#000000"
          // Força o Android a usar aceleração de hardware (resolve 90% dos travamentos de toque em Xiaomi)
          androidHardwareAccelerationDisabled={false}
        />
      </View>

      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.btnLimpar}
          onPress={handleLimpar}
          disabled={isProcessando}
        >
          <Text style={styles.textoBtnLimpar}>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnFinalizar, isProcessando && { opacity: 0.7 }]}
          onPress={handleFinalizar}
          disabled={isProcessando}
        >
          <Text style={styles.textoBtnFinalizar}>
            {isProcessando ? "Processando..." : "Finalizar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- NOVO BOTÃO DE EMERGÊNCIA --- */}
      <TouchableOpacity 
        style={styles.btnPlanoB} 
        onPress={handleAssinaturaRG}
        disabled={isProcessando}
      >
        <Text style={styles.textoBtnPlanoB}>
          Problemas na tela? Usar conferência de RG
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  quadroContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 15, // Diminui um pouco para dar espaço ao botão do RG
  },
  btnLimpar: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  textoBtnLimpar: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnFinalizar: {
    flex: 1,
    backgroundColor: "#15803d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  textoBtnFinalizar: {
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  /* ESTILOS DO NOVO BOTÃO */
  btnPlanoB: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#94a3b8",
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  textoBtnPlanoB: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
});