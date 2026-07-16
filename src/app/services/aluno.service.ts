// ============================================================
// 📚 Service: comunicação HTTP com /api/alunos (escopado por turma)
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';

@Injectable({
  providedIn: 'root'
})


export class AlunoService {
  private apiUrl = 'https://aleatorizador-de-nomes-backend-three.onrender.com/api/alunos';

  constructor(private http: HttpClient) {}

  listarPorTurma(turmaId: number): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.apiUrl}?turma_id=${turmaId}`);
  }

  criar(nome: string, turmaId: number): Observable<Aluno> {
    return this.http.post<Aluno>(this.apiUrl, { nome, turma_id: turmaId });
  }

  atualizar(id: number, dados: Partial<Aluno>): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, dados);
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
