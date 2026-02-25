import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import { useAssinaturaController } from "../controllers/useAssinaturaController";

export function AssinaturaScreen() {
  const { handleSalvarAssinatura } = useAssinaturaController();
  const ref = useRef<SignatureViewRef>(null);

  const webStyle = `.m-signature-pad--footer { display: none; margin: 0px; }`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assinatura do Motorista</Text>

      <View style={styles.quadroContainer}>
        <SignatureScreen
          ref={ref}
          onOK={handleSalvarAssinatura}
          webStyle={webStyle}
          descriptionText="Assine aqui"
          minWidth={3}
          maxWidth={7}
        />
      </View>

      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.btnLimpar}
          onPress={() => ref.current?.clearSignature()}
        >
          <Text>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnFinalizar}
          onPress={() => ref.current?.readSignature()}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Finalizar</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
  },
  btnLimpar: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  btnFinalizar: {
    flex: 1,
    backgroundColor: "#15803d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
});
