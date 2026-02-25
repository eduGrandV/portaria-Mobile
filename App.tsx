import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes';
import { AcessoProvider } from './src/context/AcessoContext';

export default function App() {
  return (
    <NavigationContainer>
      <AcessoProvider> 
        <Routes />
      </AcessoProvider>
    </NavigationContainer>
  );
}