import React, { createContext, useState, useContext, ReactNode } from "react";
import { AcessoFormData } from "../models/AcessoModel";

interface HistoricoItem {
  id: string;
  nome: string;
  cpf: string;
  data: string;
  uri: string;
}

interface AcessoContextData {
  dadosMotorista: AcessoFormData | null;
  setDadosMotorista: (dados: AcessoFormData) => void;
  assinatura: string | null;
  setAssinatura: (ass: string) => void;
  fotoMotorista: string | null;
  setFotoMotorista: (foto: string) => void;
  fotoCaminhao: string | null;
  setFotoCaminhao: (foto: string) => void;

  historico: HistoricoItem[];
  adicionarAoHistorico: (item: HistoricoItem) => void;

  limparDados: () => void;

  nomePorteiro: string;
  atualizarNomePorteiro: (nome: string) => void;
}

const AcessoContext = createContext<AcessoContextData>({} as AcessoContextData);

export function AcessoProvider({ children }: { children: ReactNode }) {
  const [dadosMotorista, setDadosMotorista] = useState<AcessoFormData | null>(
    null,
  );
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [fotoMotorista, setFotoMotorista] = useState<string | null>(null);
  const [fotoCaminhao, setFotoCaminhao] = useState<string | null>(null);

  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  const [nomePorteiro, setNomePorteiro] = useState("");

  function adicionarAoHistorico(item: HistoricoItem) {
    setHistorico((prev) => [item, ...prev]);
  }

  function atualizarNomePorteiro(nome: string) {
    setNomePorteiro(nome);
  }

  function limparDados() {
    setDadosMotorista(null);
    setAssinatura(null);
    setFotoMotorista(null);
    setFotoCaminhao(null);
  }

  return (
    <AcessoContext.Provider
      value={{
        dadosMotorista,
        setDadosMotorista,
        assinatura,
        setAssinatura,
        fotoMotorista,
        setFotoMotorista,
        fotoCaminhao,
        setFotoCaminhao,
        historico,
        adicionarAoHistorico,
        limparDados,

        nomePorteiro,
        atualizarNomePorteiro,
      }}
    >
      {children}
    </AcessoContext.Provider>
  );
}

export function useAcessoContext() {
  return useContext(AcessoContext);
}
