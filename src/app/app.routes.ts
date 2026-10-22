// ============================================================
// 📚 CONCEITO: Rotas (Angular Router)
//
// O Router troca o que aparece dentro de <router-outlet> no
// app.html SEM recarregar a página. Cada objeto abaixo mapeia
// um caminho de URL para um componente.
//
// canActivate: [authGuard] protege a rota — se o usuário não
// estiver logado, é redirecionado para /login automaticamente.
// ============================================================

import { Routes } from '@angular/router';
import { TurmasAdmin }    from './pages/turmas-admin/turmas-admin';
import { TurmaDashboard } from './pages/turma-dashboard/turma-dashboard';
import { Login }          from './pages/login/login';
import { UsuariosAdmin }  from './pages/usuarios-admin/usuarios-admin';
import { authGuard }      from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '',           component: TurmasAdmin,    canActivate: [authGuard] },
  { path: 'turma/:id',  component: TurmaDashboard, canActivate: [authGuard] },
  { path: 'usuarios',   component: UsuariosAdmin,  canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
