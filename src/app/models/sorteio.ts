// ============================================================
// 📚 Models relacionados ao sorteio: resultado, status e histórico
// ============================================================

export interface ResultadoSorteio {
  sorteados: { id: number; nome: string }[];
  ciclo: number;
  ciclo_reiniciado: boolean;
}

export interface StatusSorteio {
  ciclo_atual: number;
  alunos: {
    id: number;
    nome: string;
    ja_sorteado_ciclo: boolean;
  }[];
}

export interface ItemHistorico {
  id: number;
  ciclo: number;
  data_sorteio: string;
  aluno_nome: string;
}
