import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { AcessoSchema, AcessoFormData } from '../models/AcessoModel';
import { useAcessoContext } from '../context/AcessoContext';

export function useAcessoController() {
  const navigation = useNavigation<any>();
  const { setDadosMotorista } = useAcessoContext();
  
  const form = useForm<AcessoFormData>({
    resolver: zodResolver(AcessoSchema),
  });

  function handleProximaEtapa(data: AcessoFormData) {
    console.log('Controller: Dados validados com sucesso!', data);
    setDadosMotorista(data);
    navigation.navigate('Termo'); 
  }

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    handleProximaEtapa,
  };
}