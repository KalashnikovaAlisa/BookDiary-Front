import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Book } from '../models/book.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MockBookService {
  private mockBooks: Book[] = [
    {
      id: '1',
      title: 'Война и мир',
      author: 'Лев Толстой',
      genre: 'Русская классика',
      description: 'Великий роман-эпопея Льва Толстого...',
      pages: 1225,
      coverImage: 'https://s1.livelib.ru/boocover/1010906243/200x305/39e6/Lev_Tolstoj__Vojna_i_mir._V_4h_tomah._Tom_1.jpg'
    },
    {
      id: '2',
      title: 'Преступление и наказание',
      author: 'Фёдор Достоевский',
      genre: 'Русская классика',
      description: 'Психологический роман о студенте Раскольникове...',
      pages: 671,
      coverImage: 'https://s1.livelib.ru/boocover/1012789114/200x305/cec2/Fjodor_Dostoevskij__Prestuplenie_i_nakazanie.jpg'
    },
    {
      id: '3',
      title: 'Руслан и Людмила',
      author: 'Александр Пушкин',
      genre: 'Поэзия',
      description: 'Поэма в стихах о любви и приключениях...',
      pages: 180,
      coverImage: 'https://s1.livelib.ru/boocover/1007675476/200x305/6f32/Aleksandr_Pushkin__Ruslan_i_Lyudmila.jpg'
    }
  ];

  private mockFavorites: (Book & { status?: string; rating?: number })[] = [
    {
      id: '1',
      title: 'Война и мир',
      author: 'Лев Толстой',
      genre: 'Русская классика',
      description: 'Великий роман-эпопея Льва Толстого...',
      pages: 1225,
      coverImage: 'https://s1.livelib.ru/boocover/1010906243/200x305/39e6/Lev_Tolstoj__Vojna_i_mir._V_4h_tomah._Tom_1.jpg',
      status: 'want-to-read',
      rating: 5
    }
  ];

  constructor(private notificationService: NotificationService) {}

  getAllBooks(): Observable<Book[]> {
    return of(this.mockBooks).pipe(delay(500));
  }

  searchBooks(term: string): Observable<Book[]> {
    const results = this.mockBooks.filter(book =>
      book.title.toLowerCase().includes(term.toLowerCase()) ||
      book.author.toLowerCase().includes(term.toLowerCase())
    );
    return of(results).pipe(delay(300));
  }

  getBooksByGenre(genre: string): Observable<Book[]> {
    const results = this.mockBooks.filter(book =>
      book.genre.toLowerCase() === genre.toLowerCase()
    );
    return of(results).pipe(delay(300));
  }

  getFavoriteBooks(): Observable<(Book & { status?: string; rating?: number })[]> {
    return of(this.mockFavorites).pipe(delay(500));
  }

  async toggleFavorite(book: Book): Promise<void> {
    const existing = this.mockFavorites.find(fav => fav.id === book.id);
    
    if (existing) {
      this.mockFavorites = this.mockFavorites.filter(fav => fav.id !== book.id);
      this.notificationService.success('Книга удалена из избранного');
    } else {
      this.mockFavorites.push({
        ...book,
        status: 'want-to-read',
        rating: undefined
      });
      this.notificationService.success('Книга добавлена в "Хочу прочитать"');
    }
    return Promise.resolve();
  }

  async updateBookStatus(bookId: string, status: string): Promise<void> {
    const favorite = this.mockFavorites.find(fav => fav.id === bookId);
    if (favorite) {
      favorite.status = status;
      this.notificationService.success(`Статус изменен на "${status}"`);
    }
    return Promise.resolve();
  }

  async updateBookRating(bookId: string, rating: number): Promise<void> {
    const favorite = this.mockFavorites.find(fav => fav.id === bookId);
    if (favorite) {
      favorite.rating = rating;
      this.notificationService.success(`Оценка ${rating} сохранена`);
    }
    return Promise.resolve();
  }

  async removeFromFavorites(bookId: string): Promise<void> {
    this.mockFavorites = this.mockFavorites.filter(fav => fav.id !== bookId);
    this.notificationService.success('Книга удалена из избранного');
    return Promise.resolve();
  }
}