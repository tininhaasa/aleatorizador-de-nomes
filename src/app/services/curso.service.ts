// ============================================================
// 📚 CONCEITO: Signal compartilhado dentro de um Service
//
// `versao` é um signal que vive no service (que é singleton —
// providedIn: 'root'). Qualquer componente que injete este
// service pode "observar" `versao()` dentro de um effect() para
// saber quando a lista de cursos mudou, mesmo que a mudança
// tenha sido feita por OUTRO componente (ex.: a Sidebar reage
// quando a página de administração cria um novo curso).
// ============================================================

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'https://aleatorizador-de-nomes-backend-three.onrender.com/api/cursos';

  // Incrementado a cada criação/remoção — sinaliza "algo mudou" para quem observa
  versao = signal(0);

  constructor(private http: HttpClient) {}

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  criar(nome: string): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, { nome }).pipe(
      tap(() => this.versao.update(v => v + 1))
    );
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.versao.update(v => v + 1))
    );
  }
}
