import { Injectable } from '@angular/core';
import { Observable, map, from } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Book, UserBookStatus } from '../models/book.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  // Получение всех книг
  getAllBooks(): Observable<Book[]> {
    return this.apiService.get<Book[]>('books')
      .pipe(map(response => response.data));
  }

  // Поиск книг
  searchBooks(term: string): Observable<Book[]> {
    return this.apiService.get<Book[]>('books/search', { q: term })
      .pipe(map(response => response.data));
  }

  // Получение книг по жанру
  getBooksByGenre(genre: string): Observable<Book[]> {
    return this.apiService.get<Book[]>(`books/genre/${genre}`)
      .pipe(map(response => response.data));
  }

  // Получение книги по ID
  getBookById(id: string): Observable<Book> {
    return this.apiService.get<Book>(`books/${id}`)
      .pipe(map(response => response.data));
  }

  // Получение избранных книг
  getFavoriteBooks(): Observable<(Book & { status?: string; rating?: number, favorite_id?: number })[]> {
    return this.apiService.get<any[]>('favorites')
      .pipe(map(response => response.data.map(book => ({
        id: book.Id_книги?.toString(),
        title: book.Название_книги,
        author: book.Автор ? `${book.Автор.Имя_автора} ${book.Автор.Фамилия_автора}` : 'Неизвестный автор',
        genre: book.Жанр?.Наименование_жанра || 'Не указан',
        description: book.Описание,
        pages: book.Кол_во_страниц,
        coverImage: book.URL_обложки,
        status: book.Статус_книги,
        rating: book.Оценка,
        favorite_id: book.id_избранной_книги
      }))));
  }

  // Обновление статуса книги
  async updateBookStatus(bookId: string, status: string): Promise<void> {
    try {
      // Map status string to status_id
      const statusMap: { [key: string]: number } = {
        'want-to-read': 1,  // Хочу прочитать
        'reading': 2,       // В процессе
        'completed': 3      // Прочитано
      };
      
      const statusId = statusMap[status] || 1;
      
      await this.apiService.put(`favorites/${bookId}/status`, { status_id: statusId }).toPromise();
      
            const messages: Record<string, string> = {
        'want-to-read': 'Книга перемещена в "Хочу прочитать"',
        'reading': 'Книга перемещена в "В процессе"',
        'completed': 'Книга перемещена в "Прочитано"'
      };
      
      this.notificationService.success(messages[status] || 'Статус обновлен');
    
    } catch (error) {
      console.error('Error updating status:', error);
      this.notificationService.error('Ошибка при обновлении статуса');
      throw error;
    }
  }

  // Обновление рейтинга
  async updateBookRating(bookId: string, rating: number): Promise<void> {
    try {
      await this.apiService.put(`favorites/${bookId}/rating`, { rating }).toPromise();
      this.notificationService.success(`Оценка ${rating} сохранена`);
    } catch (error) {
      console.error('Error updating rating:', error);
      this.notificationService.error('Ошибка при сохранении оценки');
      throw error;
    }
  }

  // Добавить/убрать из избранного
async toggleFavorite(book: Book): Promise<void> {
  try {
    const result = await this.apiService.post<any>(`favorites/toggle/${book.id}`, {}).toPromise();
    
    // Проверяем, что result существует и имеет ожидаемую структуру
    if (result?.data?.action === 'added') {
      this.notificationService.success('Книга добавлена в "Хочу прочитать"');
    } else if (result?.data?.action === 'removed') {
      this.notificationService.success('Книга удалена из избранного');
    } else {
      // Фолбэк на основе сообщения
      if (result?.data?.message?.includes('added')) {
        this.notificationService.success('Книга добавлена в избранное');
      } else {
        this.notificationService.success('Операция выполнена');
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    this.notificationService.error('Ошибка при изменении статуса книги');
    throw error;
  }
}

  // Удалить из избранного
  async removeFromFavorites(bookId: string): Promise<void> {
    try {
      await this.apiService.delete(`favorites/${bookId}`).toPromise();
      this.notificationService.success('Книга удалена из избранного');
    } catch (error) {
      console.error('Error removing book from favorites:', error);
      this.notificationService.error('Ошибка при удалении книги');
      throw error;
    }
  }
}