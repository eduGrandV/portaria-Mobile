import { useRef } from 'react';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useAcessoContext } from '../context/AcessoContext';

export function useCameraMotoristaController() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<any>();
  const { setFotoMotorista } = useAcessoContext();

  async function handleTirarFoto() {
    if (cameraRef.current) {
      const foto = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      console.log('Foto do motorista tirada:', foto?.uri);
      
      setFotoMotorista(foto.uri);
      navigation.navigate('DevolverTablet');
    }
  }

  return { permission, requestPermission, cameraRef, handleTirarFoto };
}