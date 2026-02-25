import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import dayjs from "dayjs";

const { width } = Dimensions.get("window");
const API_URL = "http://192.168.250.235:3333";

export function HistoryScreen() {
  const [historicoApi, setHistoricoApi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [baixandoId, setBaixandoId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("Todos");

  const meses = [
    { nome: "Todos", valor: "Todos" },
    { nome: "Jan", valor: "01" },
    { nome: "Fev", valor: "02" },
    { nome: "Mar", valor: "03" },
    { nome: "Abr", valor: "04" },
    { nome: "Mai", valor: "05" },
    { nome: "Jun", valor: "06" },
    { nome: "Jul", valor: "07" },
    { nome: "Ago", valor: "08" },
    { nome: "Set", valor: "09" },
    { nome: "Out", valor: "10" },
    { nome: "Nov", valor: "11" },
    { nome: "Dez", valor: "12" },
  ];

  useFocusEffect(
    useCallback(() => {
      async function carregarHistoricoDoBanco() {
        setLoading(true);
        try {
          const resposta = await fetch(`${API_URL}/acessos`);
          if (resposta.ok) {
            const dados = await resposta.json();
            const dadosFormatados = dados.map((item: any) => ({
              ...item,
              dataFormatada: dayjs(item.dataEntrada).format("DD/MM/YYYY HH:mm"),
            }));
            setHistoricoApi(dadosFormatados);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      carregarHistoricoDoBanco();
    }, [])
  );

  async function compartilharPdf(id: string, nomeMotorista: string) {
    setBaixandoId(id);
    try {
      const pastaBase = FileSystem.cacheDirectory || FileSystem.documentDirectory;

      if (!pastaBase) {
        Alert.alert("Erro", "Sistema de arquivos indisponível.");
        return;
      }

      const fileUri = `${pastaBase}termo_${id}.pdf`;
      const urlPdf = `${API_URL}/acessos/${id}/pdf`;

      const downloadRes = await FileSystem.downloadAsync(urlPdf, fileUri);

      if (downloadRes.status === 200) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(downloadRes.uri, {
            mimeType: "application/pdf",
            dialogTitle: `Compartilhar Termo: ${nomeMotorista}`,
          });
        }
      } else {
        Alert.alert("Erro", "Arquivo não encontrado.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao processar arquivo.");
    } finally {
      setBaixandoId(null);
    }
  }

  const dadosFiltrados = historicoApi.filter((item) => {
    const texto = busca.toLowerCase();
    const nomeMotorista = item.motorista.nome.toLowerCase();
    const cpfMotorista = item.motorista.cpf || "";
    const matchNome = nomeMotorista.includes(texto);
    const matchCpf = cpfMotorista.includes(texto);
    const mesItem = item.dataFormatada.substring(3, 5);
    const matchMes = mesSelecionado === "Todos" || mesItem === mesSelecionado;
    return (matchNome || matchCpf) && matchMes;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico de Acessos</Text>
        <Text style={styles.headerSubtitle}>{dadosFiltrados.length} registros encontrados</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar por nome ou CPF..."
            value={busca}
            onChangeText={setBusca}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mesesContainer}
        >
          {meses.map((mes) => (
            <TouchableOpacity
              key={mes.nome}
              style={[
                styles.botaoMes,
                mesSelecionado === mes.valor && styles.botaoMesAtivo,
              ]}
              onPress={() => setMesSelecionado(mes.valor)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.textoMes,
                  mesSelecionado === mes.valor && styles.textoMesAtivo,
                ]}
              >
                {mes.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      ) : (
        <FlatList
          data={dadosFiltrados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📭</Text>
              </View>
              <Text style={styles.emptyTitle}>Nenhum registro</Text>
              <Text style={styles.emptySubtitle}>
                {busca || mesSelecionado !== "Todos"
                  ? "Tente remover os filtros aplicados"
                  : "Os termos compartilhados aparecerão aqui"}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.card, index === 0 && styles.firstCard]}
              onPress={() => compartilharPdf(item.id, item.motorista.nome)}
              disabled={baixandoId === item.id}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardAvatar}>
                  <Text style={styles.cardAvatarText}>
                    {item.motorista.nome.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNome}>{item.motorista.nome}</Text>
                  <Text style={styles.cardCpf}>
                    CPF: {item.motorista.cpf || "Não informado"}
                  </Text>
                </View>
                <View style={styles.cardBadge}>
                  {baixandoId === item.id ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <Text style={styles.cardBadgeText}>PDF</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.cardDataContainer}>
                  <Text style={styles.cardDataIcon}>📅</Text>
                  <Text style={styles.cardData}>{item.dataFormatada}</Text>
                </View>
                <View style={styles.cardShare}>
                  <Text style={styles.cardShareText}>Compartilhar →</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    backgroundColor: "#0f172a",
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight! + 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  searchContainer: {
    marginTop: -20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputBusca: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  mesesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  botaoMes: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  botaoMesAtivo: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  textoMes: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  textoMesAtivo: {
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  firstCard: {
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardCpf: {
    fontSize: 13,
    color: "#64748b",
  },
  cardBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  cardBadgeText: {
    color: "#3b82f6",
    fontWeight: "700",
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 14,
  },
  cardDataContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDataIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  cardData: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  cardShare: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cardShareText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});