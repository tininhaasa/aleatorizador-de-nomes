// ============================================================
// 📚 Service: comunicação HTTP com /api/sorteio (escopado por turma)
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultadoSorteio, StatusSorteio, ItemHistorico } from '../models/sorteio';

@Injectable({
  providedIn: 'root'
})
export class SorteioService {
  private apiUrl = 'https://aleatorizador-de-nomes-backend-three.onrender.com/api/sorteio';

  constructor(private http: HttpClient) {}

  sortear(turmaId: number, ausentes: number[]): Observable<ResultadoSorteio> {
    return this.http.post<ResultadoSorteio>(`${this.apiUrl}/${turmaId}/sortear`, { ausentes });
  }

  status(turmaId: number): Observable<StatusSorteio> {
    return this.http.get<StatusSorteio>(`${this.apiUrl}/${turmaId}/status`);
  }

  historico(turmaId: number): Observable<ItemHistorico[]> {
    return this.http.get<ItemHistorico[]>(`${this.apiUrl}/${turmaId}/historico`);
  }
}
