// ============================================================
// 📚 CONCEITO: Componente de navegação (Sidebar)
//
// Mostra os Cursos e, dentro de cada um, suas Turmas. Clicar numa
// turma navega para /turma/:id via routerLink (sem reload de página).
//
// effect() roda automaticamente sempre que um signal que ele lê
// muda de valor. Aqui usamos isso para recarregar a lista sempre
// que cursoService.versao() ou turmaService.versao() mudarem —
// ou seja, sempre que ALGUÉM (esta tela ou outra) criar/remover
// um curso ou turma.
// ============================================================

import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { TurmaService } from '../../services/turma.service';
import { Curso } from '../../models/curso';
import { Turma } from '../../models/turma';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private cursoService = inject(CursoService);
  private turmaService = inject(TurmaService);

  cursos = signal<Curso[]>([]);
  turmas = signal<Turma[]>([]);

  constructor() {
    effect(() => {
      // Apenas LER os signals aqui já registra a dependência do effect.
      this.cursoService.versao();
      this.turmaService.versao();
      this.carregar();
    });
  }

  carregar(): void {
    this.cursoService.listar().subscribe(c => this.cursos.set(c));
    this.turmaService.listar().subscribe(t => this.turmas.set(t));
  }

  turmasDoCurso(cursoId: number): Turma[] {
    return this.turmas().filter(t => t.curso_id === cursoId);
  }
}
