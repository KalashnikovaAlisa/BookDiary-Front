
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '../app/auth/auth.interceptor';
import { BookService } from './services/book.service';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { MockBookService } from './services/mock-book.service';
import { MockAuthService } from './services/mock-auth.service';


export const appConfig = {
  providers: [
    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])), 

     // ВРЕМЕННО используем mock сервисы
    { provide: BookService, useClass: MockBookService },
    { provide: AuthService, useClass: MockAuthService },
    
    NotificationService
  ]
}; 