import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface UsuarioItem {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'professor';
  ativo: boolean;
}

const API = 'https://aleatorizador-de-nomes-backend-three.onrender.com/api/usuarios';

@Component({
  selector: 'app-usuarios-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css'
})
export class UsuariosAdmin {
  private http = inject(HttpClient);

  usuarios  = signal<UsuarioItem[]>([]);
  erro      = signal('');
  sucesso   = signal('');

  // Formulário de novo usuário
  novoNome  = signal('');
  novoEmail = signal('');
  novaSenha = signal('');
  novoRole  = signal<'professor' | 'admin'>('professor');

  constructor() { this.carregar(); }

  carregar(): void {
    this.http.get<UsuarioItem[]>(API).subscribe({
      next: (dados) => this.usuarios.set(dados),
      error: () => this.erro.set('Erro ao carregar usuários.'),
    });
  }

  criar(): void {
    const nome  = this.novoNome().trim();
    const email = this.novoEmail().trim();
    const senha = this.novaSenha();
    const role  = this.novoRole();

    if (!nome || !email || !senha) {
      this.erro.set('Preencha todos os campos.');
      return;
    }

    this.http.post<UsuarioItem>(API, { nome, email, senha, role }).subscribe({
      next: () => {
        this.novoNome.set('');
        this.novoEmail.set('');
        this.novaSenha.set('');
        this.novoRole.set('professor');
        this.sucesso.set('Usuário criado com sucesso!');
        this.erro.set('');
        this.carregar();
        setTimeout(() => this.sucesso.set(''), 3000);
      },
      error: (err) => this.erro.set(err?.error?.erro || 'Erro ao criar usuário.'),
    });
  }

  alternarAtivo(usuario: UsuarioItem): void {
    this.http.patch(`${API}/${usuario.id}/ativo`, { ativo: !usuario.ativo }).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao atualizar usuário.'),
    });
  }
}
