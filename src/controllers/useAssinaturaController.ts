import { useNavigation } from '@react-navigation/native';
import { useAcessoContext } from '../context/AcessoContext';

export function useAssinaturaController() {
  const navigation = useNavigation<any>();
  const { setAssinatura } = useAcessoContext();

  function handleSalvarAssinatura(assinaturaBase64: string) {
    console.log('Assinatura salva!');
    setAssinatura(assinaturaBase64);
    navigation.navigate('CameraMotorista');
  }

  return { handleSalvarAssinatura };
}