// ============================================================
// 📚 CONCEITO: HTTP Interceptor
//
// Um interceptor "intercepta" TODA requisição HTTP feita pelo
// HttpClient antes de enviá-la ao servidor. Aqui usamos isso
// para injetar o header Authorization em todas as chamadas,
// sem precisar repetir esse código em cada service.
//
// Sem interceptor:
//   http.get('/api/cursos', { headers: { Authorization: 'Bearer ...' } })
//
// Com interceptor:
//   http.get('/api/cursos')  ← o header é adicionado automaticamente
// ============================================================

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const reqComToken = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(reqComToken);
  }

  return next(req);
};
