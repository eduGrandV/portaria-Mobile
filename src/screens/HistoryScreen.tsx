import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import dayjs from "dayjs";
import { API_URL } from "../controllers/useCameraVeiculoController";

const { width } = Dimensions.get("window");

export function HistoryScreen() {
  const [historicoApi, setHistoricoApi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [baixandoId, setBaixandoId] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("Todos");
  const [anoSelecionado, setAnoSelecionado] = useState(dayjs().format("YYYY"));

  const [modalMesVisivel, setModalMesVisivel] = useState(false);
  const [modalAnoVisivel, setModalAnoVisivel] = useState(false);

  const meses = [
    { nome: "Todos os Meses", valor: "Todos" },
    { nome: "Janeiro", valor: "01" }, { nome: "Fevereiro", valor: "02" },
    { nome: "Março", valor: "03" }, { nome: "Abril", valor: "04" },
    { nome: "Maio", valor: "05" }, { nome: "Junho", valor: "06" },
    { nome: "Julho", valor: "07" }, { nome: "Agosto", valor: "08" },
    { nome: "Setembro", valor: "09" }, { nome: "Outubro", valor: "10" },
    { nome: "Novembro", valor: "11" }, { nome: "Dezembro", valor: "12" },
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

  async function visualizarPdf(id: string, nomeMotorista: string) {
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
        if (Platform.OS === 'android') {
          const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: contentUri,
            flags: 1, 
            type: 'application/pdf',
          });
        } else {
          await Sharing.shareAsync(downloadRes.uri, { UTI: 'com.adobe.pdf' });
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

  // LÓGICA DO CRACHÁ: Atualiza o status no banco de dados e na tela
  async function atualizarCracha(id: string, devolvido: boolean) {
    try {
      const resposta = await fetch(`${API_URL}/acessos/${id}/cracha`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ devolvido })
      });

      if (resposta.ok) {
        setHistoricoApi(prev => 
          prev.map(item => 
            item.id === id ? { ...item, crachaDevolvido: devolvido } : item
          )
        );
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o status do crachá.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  }

  // ALERTA DE CONFIRMAÇÃO DO CRACHÁ
  const confirmarDevolucao = (id: string) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que ele devolveu o crachá?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => atualizarCracha(id, true) }
      ]
    );
  };

  const extrairAnosDisponiveis = () => {
    const anosUnicos = Array.from(
      new Set(historicoApi.map((item) => item.dataFormatada.substring(6, 10)))
    ).sort().reverse();

    if (anosUnicos.length === 0) {
      return [dayjs().format("YYYY")];
    }
    return ["Todos", ...anosUnicos];
  };

  const anosDisponiveis = extrairAnosDisponiveis();

  const dadosFiltrados = historicoApi.filter((item) => {
    const texto = busca.toLowerCase();
    const nomeMotorista = item.motorista.nome.toLowerCase();
    const cpfMotorista = item.motorista.cpf || "";
    
    const matchNome = nomeMotorista.includes(texto);
    const matchCpf = cpfMotorista.includes(texto);
    
    const mesItem = item.dataFormatada.substring(3, 5);
    const matchMes = mesSelecionado === "Todos" || mesItem === mesSelecionado;

    const anoItem = item.dataFormatada.substring(6, 10);
    const matchAno = anoSelecionado === "Todos" || anoItem === anoSelecionado;

    return (matchNome || matchCpf) && matchMes && matchAno;
  });

  const getNomeMesSelecionado = () => {
    const mes = meses.find(m => m.valor === mesSelecionado);
    return mes ? mes.nome : "Mês";
  };

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

        <View style={styles.selectsRow}>
          <TouchableOpacity 
            style={styles.selectButton} 
            activeOpacity={0.7}
            onPress={() => setModalAnoVisivel(true)}
          >
            <Text style={styles.selectLabel}>Ano</Text>
            <View style={styles.selectValueContainer}>
              <Text style={styles.selectValue}>{anoSelecionado === "Todos" ? "Todos os Anos" : anoSelecionado}</Text>
              <Text style={styles.selectIcon}>▼</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.selectSpacer} />

          <TouchableOpacity 
            style={styles.selectButton} 
            activeOpacity={0.7}
            onPress={() => setModalMesVisivel(true)}
          >
            <Text style={styles.selectLabel}>Mês</Text>
            <View style={styles.selectValueContainer}>
              <Text style={styles.selectValue}>{getNomeMesSelecionado()}</Text>
              <Text style={styles.selectIcon}>▼</Text>
            </View>
          </TouchableOpacity>
        </View>
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
                {busca || mesSelecionado !== "Todos" || anoSelecionado !== "Todos"
                  ? "Tente remover os filtros aplicados"
                  : "Os termos compartilhados aparecerão aqui"}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.card, index === 0 && styles.firstCard]}
              onPress={() => visualizarPdf(item.id, item.motorista.nome)}
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

              {/* LÓGICA VISUAL DO CRACHÁ DENTRO DO CARD */}
              {item.numeroCracha ? (
                <View style={styles.crachaContainer}>
                  {item.crachaDevolvido ? (
                    <Text style={styles.crachaVerde}>
                      ✅ Crachá {item.numeroCracha} devolvido
                    </Text>
                  ) : (
                    <View style={styles.crachaPendenteWrapper}>
                      <Text style={styles.crachaVermelho}>
                        ❌ Crachá {item.numeroCracha} NÃO devolvido
                      </Text>
                      <View style={styles.crachaBotoesContainer}>
                        <Text style={styles.crachaPergunta}>Devolveu?</Text>
                        <TouchableOpacity 
                          style={styles.btnCrachaSim} 
                          onPress={() => confirmarDevolucao(item.id)}
                        >
                          <Text style={styles.btnCrachaTextSim}>SIM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.btnCrachaNao} 
                          onPress={() => atualizarCracha(item.id, false)}
                        >
                          <Text style={styles.btnCrachaTextNao}>NÃO</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : null}
              {/* FIM DA LÓGICA DO CRACHÁ */}

              <View style={styles.cardFooter}>
                <View style={styles.cardDataContainer}>
                  <Text style={styles.cardDataIcon}>📅</Text>
                  <Text style={styles.cardData}>{item.dataFormatada}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.cardShare}>
                    <Text style={styles.cardShareText}>Abrir PDF →</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={modalAnoVisivel} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalAnoVisivel(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Ano</Text>
            <FlatList
              data={anosDisponiveis}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, anoSelecionado === item && styles.modalItemAtivo]}
                  onPress={() => {
                    setAnoSelecionado(item);
                    setModalAnoVisivel(false);
                  }}
                >
                  <Text style={[styles.modalItemText, anoSelecionado === item && styles.modalItemTextAtivo]}>
                    {item === "Todos" ? "Todos os Anos" : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={modalMesVisivel} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalMesVisivel(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Mês</Text>
            <FlatList
              data={meses}
              keyExtractor={(item) => item.valor}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.modalItem, mesSelecionado === item.valor && styles.modalItemAtivo]}
                  onPress={() => {
                    setMesSelecionado(item.valor);
                    setModalMesVisivel(false);
                  }}
                >
                  <Text style={[styles.modalItemText, mesSelecionado === item.valor && styles.modalItemTextAtivo]}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 10,
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
    marginBottom: 16,
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
  selectsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectSpacer: {
    width: 12,
  },
  selectButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  selectIcon: {
    fontSize: 12,
    color: "#94a3b8",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  modalItemAtivo: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  modalItemText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalItemTextAtivo: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  
  /* ESTILOS DO CRACHÁ */
  crachaContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  crachaVerde: {
    color: "#16a34a",
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: 14,
  },
  crachaPendenteWrapper: {
    flexDirection: "column",
  },
  crachaVermelho: {
    color: "#dc2626",
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 10,
  },
  crachaBotoesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  crachaPergunta: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
    marginRight: 12,
  },
  btnCrachaSim: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  btnCrachaNao: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  btnCrachaTextSim: {
    color: "#16a34a",
    fontWeight: "800",
    fontSize: 12,
  },
  btnCrachaTextNao: {
    color: "#dc2626",
    fontWeight: "800",
    fontSize: 12,
  },
});