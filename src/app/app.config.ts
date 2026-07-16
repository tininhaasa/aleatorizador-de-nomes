// ============================================================
// 📚 CONCEITO: app.config.ts — Configuração global da aplicação
//
// Aqui registramos os "providers" que o Angular vai disponibilizar
// para toda a aplicação.
//
// provideHttpClient() habilita o HttpClient para ser injetado
// em qualquer service ou componente.
// ============================================================

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),    // ← necessário para usar HttpClient nos services
    provideRouter(routes),  // ← habilita o Angular Router com as rotas definidas em app.routes.ts
  ]
};
