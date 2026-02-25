import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TermoScreen } from '../screens/TermoScreen';
import { AssinaturaScreen } from '../screens/AssinaturaScreen';
import { CameraMotoristaScreen } from '../screens/CameraMotoristaScreen';
import { DevolverTabletScreen } from '../screens/DevolverTabletScreen';
import { CameraVeiculoScreen } from '../screens/CameraVeiculoScreen';

const Stack = createNativeStackNavigator();

export function PortariaRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Termo" component={TermoScreen} />
      <Stack.Screen name="Assinatura" component={AssinaturaScreen} />
      <Stack.Screen name="CameraMotorista" component={CameraMotoristaScreen} />
      <Stack.Screen name="DevolverTablet" component={DevolverTabletScreen} />
      <Stack.Screen name="CameraVeiculo" component={CameraVeiculoScreen} /> 
    </Stack.Navigator>
  );
}