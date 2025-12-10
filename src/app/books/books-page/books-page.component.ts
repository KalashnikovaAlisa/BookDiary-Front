import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, debounceTime, distinctUntilChanged, Observable, of } from 'rxjs';
import { BookService } from '../../services/book.service';
import { Book, UserBookStatus } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component'; 
import { BookDetailsComponent } from '../book-details/book-details.component';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, BookDetailsComponent],
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.css'],
})
export class BooksPageComponent implements OnInit, OnDestroy {
  books$: Observable<Book[]>;
  searchTerm: string = '';
  searchTerm$ = new BehaviorSubject<string>('');
  selectedGenre$ = new BehaviorSubject<string | null>(null);
  filteredBooks$: Observable<Book[]>;
  userBookStatuses: { [bookId: string]: UserBookStatus } = {};
  
  selectedBook: Book | null = null;
  showBookDetails = false;

  private bookService = inject(BookService);

  constructor() {
    this.books$ = this.bookService.getAllBooks();
    
    this.filteredBooks$ = combineLatest([
      this.books$,
      this.searchTerm$.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.selectedGenre$
    ]).pipe(
      map(([books, searchTerm, selectedGenre]) => {
        return books.filter(book => 
          this.filterBook(book, searchTerm, selectedGenre)
        );
      })
    );
  }

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.bookService.getFavoriteBooks().subscribe({
      next: (favorites) => {
        this.userBookStatuses = {};
        favorites.forEach(fav => {
          if (fav.id) {
            this.userBookStatuses[fav.id] = {
              bookId: fav.id,
              userId: '', 
              status: (fav.status as UserBookStatus["status"]) || 'want-to-read',
              rating: fav.rating
            };
          }
        });
      },
      error: (err) => console.error('Error loading favorites:', err)
    });
  }

  ngOnDestroy() {
    this.searchTerm$.complete();
    this.selectedGenre$.complete();
  }

  openBookDetails(book: Book) {
    this.selectedBook = book;
    this.showBookDetails = true;
  }

  closeBookDetails() {
    this.showBookDetails = false;
    this.selectedBook = null;
  }

  onSearch() {
    this.searchTerm$.next(this.searchTerm.trim());
  }

  onClearSearch() {
    this.searchTerm = '';
    this.searchTerm$.next('');
    this.selectedGenre$.next(null);
  }

  toggleFavorite(book: Book) {
    this.bookService.toggleFavorite(book)
      .then(() => {
        // Перезагружаем статусы после изменения
        this.loadFavorites();
      })
      .catch(err => console.error('Error toggling favorite:', err));
  }

  filterByGenre(genre: string | null) {
    this.selectedGenre$.next(genre);
    this.searchTerm = '';
    this.searchTerm$.next('');
  }

  private filterBook(book: Book, search: string, genre: string | null): boolean {
    const matchesGenre = !genre || book.genre?.toLowerCase() === genre.toLowerCase();

    if (!search.trim()) {
      return matchesGenre;
    }

    const searchLower = search.toLowerCase();
    const matchesSearch = 
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower);

    return matchesGenre && matchesSearch;
  }

  trackByBookId(index: number, book: Book): string {
    return book.id || index.toString();
  }
}