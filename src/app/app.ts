// ============================================================
// 📚 CONCEITO: Componente "shell" (casca)
//
// Agora o App não tem mais lógica de negócio — ele só monta o
// layout fixo (sidebar à esquerda) e deixa o <router-outlet>
// decidir qual página aparece à direita, de acordo com a URL.
//
// Toda a lógica que antes estava aqui (alunos, sorteio, histórico)
// foi movida para pages/turma-dashboard, que só existe quando uma
// turma está selecionada na rota (/turma/:id).
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
