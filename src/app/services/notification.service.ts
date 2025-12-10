import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  show(notification: Notification) {
    this.notificationSubject.next(notification);
    
    // Автоматическое скрытие
    if (notification.duration !== 0) {
      setTimeout(() => {
        this.clear();
      }, notification.duration || 3000);
    }
  }

  success(message: string, duration?: number) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    this.show({ type: 'error', message, duration });
  }

  info(message: string, duration?: number) {
    this.show({ type: 'info', message, duration });
  }

  clear() {
    this.notificationSubject.next({ type: 'info', message: '' });
  }
}