// ============================================================
// 📚 CONCEITO: app.config.ts — Configuração global da aplicação
//
// withInterceptors([authInterceptor]) registra o interceptor HTTP
// que injeta o token JWT em TODAS as requisições automaticamente.
// ============================================================

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
  ]
};
