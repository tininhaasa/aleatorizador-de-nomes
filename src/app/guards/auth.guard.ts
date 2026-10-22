// ============================================================
// 📚 CONCEITO: Route Guard (CanActivateFn)
//
// Um guard decide se uma rota pode ser acessada ou não.
// Se o usuário não estiver logado, redirecionamos para /login
// antes que o componente da rota seja carregado.
//
// No app.routes.ts usamos assim:
//   { path: 'turma/:id', component: TurmaDashboard, canActivate: [authGuard] }
// ============================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.estaLogado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
