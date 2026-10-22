import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router      = inject(Router);

  email = signal('');
  senha = signal('');
  erro  = signal('');
  carregando = signal(false);

  entrar(): void {
    const email = this.email().trim();
    const senha = this.senha();

    if (!email || !senha) {
      this.erro.set('Preencha email e senha.');
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.authService.login(email, senha).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.erro.set(err?.error?.erro || 'Email ou senha inválidos.');
        this.carregando.set(false);
      },
    });
  }
}
