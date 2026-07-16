export interface Turma {
  id: number;
  nome: string;
  curso_id: number;
  curso_nome?: string;   // vem via JOIN no backend
  ciclo_atual: number;
  criado_em?: string;
}
