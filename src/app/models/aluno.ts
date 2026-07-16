// ============================================================
// 📚 Model: formato de um Aluno, espelhando a tabela `alunos`
// ============================================================

export interface Aluno {
  id: number;
  nome: string;
  turma_id: number;
  ativo: boolean;
  ja_sorteado_ciclo: boolean;
  criado_em?: string;
}
