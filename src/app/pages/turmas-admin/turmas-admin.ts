// ============================================================
// 📚 Página inicial ('/'): cadastro de Cursos e Turmas
//
// Esta é a tela de "gerenciamento" — criar cursos, criar turmas
// dentro de um curso, e remover qualquer um dos dois. A navegação
// para dentro de uma turma específica acontece pela Sidebar.
// ============================================================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { TurmaService } from '../../services/turma.service';
import { Curso } from '../../models/curso';
import { Turma } from '../../models/turma';

@Component({
  selector: 'app-turmas-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './turmas-admin.html',
  styleUrl: './turmas-admin.css'
})
export class TurmasAdmin {
  private cursoService = inject(CursoService);
  private turmaService = inject(TurmaService);

  cursos = signal<Curso[]>([]);
  turmas = signal<Turma[]>([]);

  novoNomeCurso = signal('');
  novoNomeTurma = signal('');
  cursoSelecionadoId = signal<number | null>(null);

  erro = signal('');

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.cursoService.listar().subscribe({
      next: (dados) => this.cursos.set(dados),
      error: () => this.erro.set('Erro ao carregar cursos. O servidor/banco está rodando?'),
    });
    this.turmaService.listar().subscribe({
      next: (dados) => this.turmas.set(dados),
    });
  }

  turmasDoCurso(cursoId: number): Turma[] {
    return this.turmas().filter(t => t.curso_id === cursoId);
  }

  // ── Cursos ──────────────────────────────────────────────
  adicionarCurso(): void {
    const nome = this.novoNomeCurso().trim();
    if (!nome) return;

    this.cursoService.criar(nome).subscribe({
      next: () => {
        this.novoNomeCurso.set('');
        this.carregar();
      },
      error: () => this.erro.set('Erro ao adicionar curso.'),
    });
  }

  removerCurso(id: number): void {
    this.cursoService.remover(id).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao remover curso. Verifique se não há turmas vinculadas.'),
    });
  }

  // ── Turmas ──────────────────────────────────────────────
  adicionarTurma(): void {
    const nome = this.novoNomeTurma().trim();
    const cursoId = this.cursoSelecionadoId();
    if (!nome || !cursoId) {
      this.erro.set('Escolha um curso e digite o nome da turma.');
      return;
    }

    this.turmaService.criar(nome, cursoId).subscribe({
      next: () => {
        this.novoNomeTurma.set('');
        this.carregar();
      },
      error: () => this.erro.set('Erro ao adicionar turma.'),
    });
  }

  removerTurma(id: number): void {
    this.turmaService.remover(id).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao remover turma.'),
    });
  }

  trocadeCurso(cursoId: number): void {
    console.log('Curso selecionadAo:', cursoId);
    this.cursoSelecionadoId.set(cursoId);
  }
}
