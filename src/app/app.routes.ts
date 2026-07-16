// ============================================================
// 📚 CONCEITO: Rotas (Angular Router)
//
// O Router troca o que aparece dentro de <router-outlet> no
// app.html SEM recarregar a página. Cada objeto abaixo mapeia
// um caminho de URL para um componente.
//
// ':id' em 'turma/:id' é um PARÂMETRO DE ROTA — o componente lê
// esse valor via ActivatedRoute (veja turma-dashboard.ts).
// ============================================================

import { Routes } from '@angular/router';
import { TurmasAdmin } from './pages/turmas-admin/turmas-admin';
import { TurmaDashboard } from './pages/turma-dashboard/turma-dashboard';

export const routes: Routes = [
  { path: '', component: TurmasAdmin },
  { path: 'turma/:id', component: TurmaDashboard },
];
