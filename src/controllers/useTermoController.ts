import { useNavigation } from '@react-navigation/native';

export function useTermoController() {
  const navigation = useNavigation<any>();
  
  function handleIrParaAssinatura() {
    console.log('Indo para a tela de Assinatura...');
    navigation.navigate('Assinatura');
  }

  return {
    handleIrParaAssinatura,
  };
}