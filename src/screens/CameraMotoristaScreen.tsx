import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useAcessoContext } from '../context/AcessoContext';

export function CameraMotoristaScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();
  
  
  
  const { setFotoMotorista } = useAcessoContext(); 

  
  const [tabletComPorteiro, setTabletComPorteiro] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.containerPermissao}>
        <Text style={styles.textPermissao}>Precisamos de permissão para a câmera.</Text>
        <TouchableOpacity style={styles.btnPermissao} onPress={requestPermission}>
          <Text style={styles.btnTextPermissao}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  if (!tabletComPorteiro) {
    return (
      <View style={styles.passarTabletContainer}>
        <Text style={styles.iconeGrande}>🤝</Text>
        <Text style={styles.tituloPassar}>Assinatura Concluída!</Text>
        <Text style={styles.subtituloPassar}>
          Motorista, por favor, devolva o tablet para o porteiro continuar o atendimento.
        </Text>

        <TouchableOpacity 
          style={styles.btnPorteiro} 
          onPress={() => setTabletComPorteiro(true)}
        >
          <Text style={styles.btnPorteiroText}>Sou o Porteiro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  async function tirarFotoDocumento() {
    if (cameraRef.current) {
      const foto = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (foto) {
        setFotoMotorista(foto.uri); 
        
        navigation.navigate('CameraVeiculo'); 
      }
    }
  }

  return (
    <View style={styles.containerCamera}>
      <Text style={styles.instrucaoCamera}>📸 PORTEIRO: Fotografe o RG ou CNH do motorista</Text>
      
      {/* Câmera traseira ativada para tirar foto do documento */}
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      
      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.btnCapturar} onPress={tirarFotoDocumento}>
          <Text style={styles.btnCapturarText}>Tirar Foto do Documento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  passarTabletContainer: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconeGrande: { fontSize: 80, marginBottom: 20 },
  tituloPassar: { fontSize: 28, fontWeight: 'bold', color: '#15803d', marginBottom: 15, textAlign: 'center' },
  subtituloPassar: { fontSize: 18, color: '#374151', textAlign: 'center', marginBottom: 50, lineHeight: 26 },
  btnPorteiro: { backgroundColor: '#15803d', paddingVertical: 20, paddingHorizontal: 40, borderRadius: 12, elevation: 4 },
  btnPorteiroText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  
  containerCamera: { flex: 1, backgroundColor: '#000' },
  instrucaoCamera: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#15803d'
  },
  camera: { flex: 1 },
  botoesContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  btnCapturar: {
    backgroundColor: '#15803d',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5
  },
  btnCapturarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  
  containerPermissao: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  textPermissao: { fontSize: 16, marginBottom: 20 },
  btnPermissao: { backgroundColor: '#15803d', padding: 15, borderRadius: 8 },
  btnTextPermissao: { color: '#fff', fontWeight: 'bold' }
});