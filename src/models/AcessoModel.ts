import { z } from "zod";

export const AcessoSchema = z.object({
  nomeMotorista: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  cpf: z.string().min(11, "CPF incompleto"),
  empresa: z.string().min(2, "Informe o nome da empresa"),
  placa: z.string().min(5, "Placa incompleta"),
  setor: z.string().min(2, "Informe o setor de destino"),
  autorizador: z.string().min(2, "Informe quem autorizou a entrada"),

});

export type AcessoFormData = z.infer<typeof AcessoSchema>;
