import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import { Controller } from "react-hook-form";
import { Feather } from '@expo/vector-icons';

import { useAcessoController } from "../controllers/useAcessoController";
import { useAcessoContext } from "../context/AcessoContext";

const { width } = Dimensions.get("window");

export function HomeScreen() {
  const { control, handleSubmit, errors, handleProximaEtapa } =
    useAcessoController();

  const { nomePorteiro, atualizarNomePorteiro } = useAcessoContext();  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com cor sólida ao invés de gradiente */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Registro de Acesso</Text>
            <Text style={styles.headerSubtitle}>
              Preencha os dados do motorista para gerar o termo
            </Text>
          </View>
        </View>

        {/* Card do Porteiro */}
        <View style={styles.operatorCard}>
          <View style={styles.operatorHeader}>
            <View style={styles.operatorIconContainer}>
              <Feather name="user" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.operatorTitle}>Operador do Turno</Text>
          </View>
          
          <TextInput
            style={styles.operatorInput}
            placeholder="Digite seu nome (Ex: João Silva)"
            placeholderTextColor="#94a3b8"
            value={nomePorteiro}
            onChangeText={atualizarNomePorteiro}
          />
          
          <View style={styles.operatorHint}>
            <Feather name="info" size={14} color="#3b82f6" />
            <Text style={styles.operatorHintText}>
              Este nome aparecerá no rodapé do PDF
            </Text>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Dados do Motorista</Text>
          
          {/* Campo: Nome do Motorista */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Feather name="user" size={16} color="#3b82f6" />
              <Text style={styles.label}>Nome completo</Text>
            </View>
            <Controller
              control={control}
              name="nomeMotorista"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.nomeMotorista && styles.inputError,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Ex: João da Silva"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
            {errors.nomeMotorista && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{errors.nomeMotorista.message}</Text>
              </View>
            )}
          </View>

          {/* Campo: CPF */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Feather name="credit-card" size={16} color="#3b82f6" />
              <Text style={styles.label}>CPF</Text>
            </View>
            <Controller
              control={control}
              name="cpf"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.cpf && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Somente números"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    maxLength={11}
                  />
                </View>
              )}
            />
            {errors.cpf && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{errors.cpf.message}</Text>
              </View>
            )}
          </View>

          {/* Linha: Empresa e Placa */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
              <View style={styles.labelContainer}>
                <Feather name="briefcase" size={16} color="#3b82f6" />
                <Text style={styles.label}>Empresa</Text>
              </View>
              <Controller
                control={control}
                name="empresa"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.empresa && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Ex: Transportes"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                )}
              />
              {errors.empresa && (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={14} color="#ef4444" />
                  <Text style={styles.errorText}>{errors.empresa.message}</Text>
                </View>
              )}
            </View>

            <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
              <View style={styles.labelContainer}>
                <Feather name="truck" size={16} color="#3b82f6" />
                <Text style={styles.label}>Placa</Text>
              </View>
              <Controller
                control={control}
                name="placa"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, errors.placa && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="ABC1D23"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="characters"
                      maxLength={10}
                    />
                  </View>
                )}
              />
              {errors.placa && (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={14} color="#ef4444" />
                  <Text style={styles.errorText}>{errors.placa.message}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Campo: Setor */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Feather name="map-pin" size={16} color="#3b82f6" />
              <Text style={styles.label}>Setor de destino</Text>
            </View>
            <Controller
              control={control}
              name="setor"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.setor && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Ex: Expedição"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
            {errors.setor && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{errors.setor.message}</Text>
              </View>
            )}
          </View>

          {/* Campo: Autorizador */}
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Feather name="check-circle" size={16} color="#3b82f6" />
              <Text style={styles.label}>Autorizado por</Text>
            </View>
            <Controller
              control={control}
              name="autorizador"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors.autorizador && styles.inputError]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Nome do responsável"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}
            />
            {errors.autorizador && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{errors.autorizador.message}</Text>
              </View>
            )}
          </View>

          {/* Botão de Avançar */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleProximaEtapa)}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Próximo: Tirar Foto</Text>
              <Feather name="arrow-right" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 22,
  },
  operatorCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  operatorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  operatorIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  operatorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  operatorInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 10,
  },
  operatorHint: {
    flexDirection: "row",
    alignItems: "center",
  },
  operatorHintText: {
    fontSize: 12,
    color: "#3b82f6",
    marginLeft: 6,
    fontWeight: "500",
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 18,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 8,
  },
  inputWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    padding: 14,
    fontSize: 15,
    color: "#0f172a",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 8,
  },
  marginLeft: {
    marginLeft: 8,
  },
  button: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
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
    marginRight: 10,
    letterSpacing: 0.5,
  },
});