import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useCameraVeiculoController } from '../controllers/useCameraVeiculoController';

export function CameraVeiculoScreen() {
  const { permission, requestPermission, cameraRef, handleTirarFotoVeiculo } = useCameraVeiculoController();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.containerPermissao}>
        <Text style={styles.textoPermissao}>O porteiro precisa da câmera para fotografar o caminhão.</Text>
        <TouchableOpacity style={styles.botaoPermissao} onPress={requestPermission}>
          <Text style={styles.textoBotaoPermissao}>Liberar Câmera Traseira</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Foto do Veículo</Text>
        <Text style={styles.subtitulo}>Fotografe a placa frontal ou o caminhão.</Text>
      </View>

      <CameraView 
        style={styles.camera} 
        facing="back" 
        ref={cameraRef}
      >
        <View style={styles.rodapeCamera}>
          <TouchableOpacity style={styles.botaoCapturar} onPress={handleTirarFotoVeiculo}>
            <View style={styles.mioloBotao} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#1f2937', alignItems: 'center' },
  titulo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subtitulo: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  containerPermissao: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6', padding: 20 },
  textoPermissao: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  botaoPermissao: { backgroundColor: '#1f2937', padding: 12, borderRadius: 8 },
  textoBotaoPermissao: { color: '#fff', fontWeight: 'bold' },
  camera: { flex: 1 },
  rodapeCamera: { flex: 1, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 40 },
  botaoCapturar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255, 255, 255, 0.3)', justifyContent: 'center', alignItems: 'center' },
  mioloBotao: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' },
});