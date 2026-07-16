import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Turma } from '../models/turma';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private apiUrl = 'https://aleatorizador-de-nomes-backend.onrender.com/api/turmas';

  // Mesma ideia do CursoService: sinaliza mudanças para quem observa (ex.: Sidebar)
  versao = signal(0);

  constructor(private http: HttpClient) {}

  listar(cursoId?: number): Observable<Turma[]> {
    const url = cursoId ? `${this.apiUrl}?curso_id=${cursoId}` : this.apiUrl;
    return this.http.get<Turma[]>(url);
  }

  buscarPorId(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.apiUrl}/${id}`);
  }

  criar(nome: string, cursoId: number): Observable<Turma> {
    return this.http.post<Turma>(this.apiUrl, { nome, curso_id: cursoId }).pipe(
      tap(() => this.versao.update(v => v + 1))
    );
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.versao.update(v => v + 1))
    );
  }
}
