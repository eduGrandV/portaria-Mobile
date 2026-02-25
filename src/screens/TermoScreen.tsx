import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTermoController } from "../controllers/useTermoController";

const { width } = Dimensions.get("window");

export function TermoScreen() {
  const { handleIrParaAssinatura } = useTermoController();

  const normas = [
    "Avisar com antecedência a visita",
    "Assinar o livro de presença na portaria",
    "Aguardar ser recepcionado pelo anfitrião da visita",
    "Aguardar vistoria do veículo, quando aplicável",
    "É proibida a entrada utilizando bermuda, saia, camiseta regata e chinelo",
    "Respeitar o limite de velocidade máxima de 20 km/h",
    "Colaborar com a limpeza, não jogando lixo no chão",
    "Informar à portaria sobre problemas de saúde ou ferimentos",
    "É proibido fumar nas dependências da fazenda",
    "É proibido realizar filmagens ou fotografias sem autorização",
    "Observar e seguir todas as instruções internas e sinalizações",
    "Esclarecer dúvidas junto à portaria ou gerência",
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <Feather name="file-text" size={32} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>Termo de Responsabilidade</Text>
            <Text style={styles.headerSubtitle}>
              Leia atentamente as normas antes de assinar
            </Text>
          </View>
        </View>

        {/* Seção de Normas */}
        <View style={styles.normasSection}>
         

          <View style={styles.cardRegras}>
            {normas.map((norma, index) => (
              <View key={index} style={styles.itemRegra}>
                <View style={styles.bulletContainer}>
                  <Text style={styles.bulletNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.textoRegra}>{norma}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Regras Especiais */}
        <View style={styles.especiaisSection}>
          <View style={styles.sectionHeader}>
            <Feather name="alert-triangle" size={20} color="#eab308" />
            <Text style={[styles.sectionTitle, { color: "#eab308" }]}>
              Regras Especiais
            </Text>
          </View>

          <View style={styles.especiaisGrid}>
            <View style={styles.especialCard}>
              <Feather name="camera-off" size={24} color="#ef4444" />
              <Text style={styles.especialText}>Proibido fotografar</Text>
            </View>
            <View style={styles.especialCard}>
              <Feather name="slash" size={24} color="#ef4444" />
              <Text style={styles.especialText}>Proibido fumar</Text>
            </View>
            <View style={styles.especialCard}>
              <Feather name="alert-octagon" size={24} color="#eab308" />
              <Text style={styles.especialText}>20km/h máx</Text>
            </View>
            <View style={styles.especialCard}>
              <Feather name="users" size={24} color="#3b82f6" />
              <Text style={styles.especialText}>Acompanhamento</Text>
            </View>
          </View>
        </View>

        {/* Alerta de Descumprimento */}
        <View style={styles.caixaAlerta}>
          <View style={styles.alertaIconContainer}>
            <Feather name="shield" size={24} color="#991b1b" />
          </View>
          <Text style={styles.textoAlerta}>
            Declaro estar ciente de que o descumprimento das normas poderá
            resultar na suspensão da visita e/ou impedimento de acesso futuro.
          </Text>
        </View>

        {/* Botão de Aceite */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleIrParaAssinatura}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Feather name="check-circle" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Li e Aceito os Termos</Text>
            <Feather name="arrow-right" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Selo de Segurança */}
        <View style={styles.seloContainer}>
          <Feather name="lock" size={12} color="#94a3b8" />
          <Text style={styles.seloText}>Documento com validade </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#0f172a",
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight! + 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  statSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    marginTop: 4,
  },
  normasSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  especiaisSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  cardRegras: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRegra: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 10,
  },
  bulletContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bulletNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  textoRegra: {
    fontSize: 14,
    color: "#334155",
    flex: 1,
    lineHeight: 20,
  },
  especiaisGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  especialCard: {
    width: (width - 60) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  especialText: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
  caixaAlerta: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  alertaIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textoAlerta: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    flex: 1,
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  seloContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  seloText: {
    fontSize: 11,
    color: "#94a3b8",
    marginLeft: 4,
    fontWeight: "500",
  },
});
