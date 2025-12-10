import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  isLoginMode = true;
  email = '';
  password = '';
  username = '';
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    if (this.isLoginMode) {
      // Логика входа
      this.authService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: () => {
          this.router.navigate(['/books']);
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Ошибка входа';
          this.loading = false;
        }
      });
    } else {
      // Логика регистрации
      this.authService.register({
        email: this.email,
        password: this.password,
        username: this.username
      }).subscribe({
        next: (response) => {
          this.successMessage = 'Регистрация успешна! Автоматический вход...';
          
          // Автоматически логинимся после регистрации
          setTimeout(() => {
            this.authService.login({
              email: this.email,
              password: this.password
            }).subscribe({
              next: () => {
                this.router.navigate(['/books']);
                this.loading = false;
              },
              error: (err) => {
                this.error = 'Регистрация успешна, но не удалось войти автоматически';
                this.loading = false;
              }
            });
          }, 1500);
        },
        error: (err) => {
          this.error = err.message || 'Ошибка регистрации';
          this.loading = false;
        }
      });
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.successMessage = '';
  }
}