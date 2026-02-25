import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function DevolverTabletScreen() {
  const navigation = useNavigation<any>();

  function handlePorteiroRecebeu() {
    console.log('Porteiro pegou o tablet de volta!');
    navigation.navigate('CameraVeiculo');
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icone}>🤝</Text>
        <Text style={styles.titulo}>Tudo certo, Motorista!</Text>
        <Text style={styles.texto}>
          Por favor, devolva este tablet para o porteiro para finalizar o registro da entrada.
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handlePorteiroRecebeu}>
        <Text style={styles.textoBotao}>Sou o Porteiro e recebi o tablet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginBottom: 40 },
  icone: { fontSize: 60, marginBottom: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#15803d', marginBottom: 12, textAlign: 'center' },
  texto: { fontSize: 16, color: '#4b5563', textAlign: 'center', lineHeight: 24 },
  botao: { backgroundColor: '#1f2937', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});