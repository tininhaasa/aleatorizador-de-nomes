// ============================================================
// 📚 CONCEITO: AuthService — gerencia login, token e estado
//
// O token JWT fica no localStorage para sobreviver a recargas
// de página. O `usuarioLogado` é um signal para que qualquer
// componente (ex.: Sidebar) reaja automaticamente ao logout.
// ============================================================

import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'professor';
}

const TOKEN_KEY   = 'sorteador_token';
const USUARIO_KEY = 'sorteador_usuario';
const API = 'https://aleatorizador-de-nomes-backend-three.onrender.com/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  // Signal público — componentes reagem a mudanças automaticamente
  usuarioLogado = signal<Usuario | null>(this.carregarUsuarioSalvo());

  login(email: string, senha: string) {
    return this.http.post<{ token: string; usuario: Usuario }>(`${API}/login`, { email, senha }).pipe(
      tap(({ token, usuario }) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
        this.usuarioLogado.set(usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioLogado.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.usuarioLogado()?.role === 'admin';
  }

  private carregarUsuarioSalvo(): Usuario | null {
    const salvo = localStorage.getItem(USUARIO_KEY);
    return salvo ? JSON.parse(salvo) : null;
  }
}
