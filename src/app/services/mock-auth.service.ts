import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { User, LoginCredentials, RegisterData } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Храним "базу данных" пользователей в localStorage
  private readonly MOCK_USERS_KEY = 'mock_users_db';

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loadMockUsers();
  }

  private loadMockUsers(): void {
    // Создаем тестового пользователя если его нет
    const mockUsers = this.getMockUsers();
    if (!mockUsers.find(u => u.email === 'test@example.com')) {
      mockUsers.push({
        id: 1,
        username: 'Тестовый',
        email: 'test@example.com',
        password: '123456' // В реальности храним хеш
      });
      this.saveMockUsers(mockUsers);
    }
  }

  private getMockUsers(): any[] {
    const usersJson = localStorage.getItem(this.MOCK_USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveMockUsers(users: any[]): void {
    localStorage.setItem(this.MOCK_USERS_KEY, JSON.stringify(users));
  }

  login(credentials: LoginCredentials): Observable<any> {
    return new Observable(subscriber => {
      setTimeout(() => {
        const mockUsers = this.getMockUsers();
        const user = mockUsers.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const mockUser: User = {
            id: user.id,
            username: user.username,
            email: user.email
          };

          // Генерируем mock токен
          const mockToken = `mock-jwt-${Date.now()}`;
          
          localStorage.setItem('access_token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          this.currentUserSubject.next(mockUser);

          this.notificationService.success('Вход выполнен успешно!');

          subscriber.next({
            data: {
              access_token: mockToken,
              user: mockUser
            }
          });
          subscriber.complete();
        } else {
          this.notificationService.error('Неверный email или пароль');
          subscriber.error(new Error('Неверный email или пароль'));
        }
      }, 800); // Имитация задержки сети
    });
  }

  register(data: RegisterData): Observable<any> {
    return new Observable(subscriber => {
      setTimeout(() => {
        const mockUsers = this.getMockUsers();
        
        // Проверяем, существует ли email
        if (mockUsers.find(u => u.email === data.email)) {
          this.notificationService.error('Email уже зарегистрирован');
          subscriber.error(new Error('Email уже зарегистрирован'));
          return;
        }

        // Создаем нового пользователя
        const newUserId = mockUsers.length > 0 
          ? Math.max(...mockUsers.map(u => u.id)) + 1 
          : 1;

        const newUser = {
          id: newUserId,
          username: data.username || data.email.split('@')[0],
          email: data.email,
          password: data.password // В реальности хешируем
        };

        mockUsers.push(newUser);
        this.saveMockUsers(mockUsers);

        this.notificationService.success('Регистрация прошла успешно!');

        subscriber.next({
          data: {
            message: 'User registered successfully',
            user: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email
            }
          }
        });
        subscriber.complete();
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
    this.notificationService.success('Вы успешно вышли из системы');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}