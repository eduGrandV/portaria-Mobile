import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 1. Importando a biblioteca de ícones do Expo
import { Ionicons } from '@expo/vector-icons'; 

import { PortariaRoutes } from './portaria.routes';
import { HistoryScreen } from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export function Routes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#15803d' }, 
        tabBarActiveTintColor: '#15803d',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="PortariaTab" 
        component={PortariaRoutes} 
        options={{ 
          title: 'Controle de Acesso',
          // 2. Adicionando o ícone para a primeira aba
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Histórico" 
        component={HistoryScreen} 
        options={{ 
          title: 'Acessos Anteriores',
          // 3. Adicionando o ícone para a segunda aba
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}