import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NotificationComponent } from "../../services/notification.component";
import { BookDetailsComponent } from '../book-details/book-details.component';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, NotificationComponent, BookDetailsComponent, RouterModule],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css'],
})
export class FavoritesPageComponent implements OnInit {
  favoriteBooks: (Book & { status?: string; rating?: number, favorite_id?: number })[] = [];
  filterStatus: 'want-to-read' | 'reading' | 'completed' | 'all' = 'all';
  editingBookId: string | null = null;
  previousFilterStatus: 'want-to-read' | 'reading' | 'completed' | 'all' | null = null;
  selectedBook: Book | null = null;
  showBookDetails = false;
  private bookService = inject(BookService);
  
  openBookDetails(book: Book) {
    this.selectedBook = book;
    this.showBookDetails = true;
  }

  closeBookDetails() {
    this.showBookDetails = false;
    this.selectedBook = null;
  }

  ngOnInit() {
    const savedFilter = localStorage.getItem('favoritesFilter') as
        | 'want-to-read'
        | 'reading'
        | 'completed'
        | null;

    this.filterStatus = savedFilter || 'want-to-read'; 
    this.loadFavorites();
  }

  changeFilter(status: 'want-to-read' | 'reading' | 'completed') {
    this.filterStatus = status;
    localStorage.setItem('favoritesFilter', status);
  }

  loadFavorites() {
    console.log('Loading favorites...');
    this.bookService.getFavoriteBooks().subscribe({
      next: books => {
        console.log('Favorites loaded:', books);
        this.favoriteBooks = books;
      },
      error: err => {
        console.error('Error loading favorites:', err);
        this.favoriteBooks = [];
      }
    });
  }

  startEditing(bookId: string | undefined) {
    if (!bookId) return;
    this.previousFilterStatus = this.filterStatus;
    this.editingBookId = bookId;
  }

  stopEditing() {
    this.editingBookId = null;
    if (this.previousFilterStatus) {
      this.filterStatus = this.previousFilterStatus;
    }
  }

  changeStatus(book: Book, status: 'want-to-read' | 'reading' | 'completed') {
    this.bookService.updateBookStatus(book.id!, status)
      .then(() => {
        const index = this.favoriteBooks.findIndex(b => b.id === book.id);
        if (index > -1) this.favoriteBooks[index].status = status;
      })
      .catch(err => console.error('Error updating status:', err));
  }

  rateBook(book: Book, rating: number) {
    this.bookService.updateBookRating(book.id!, rating)
      .then(() => this.loadFavorites())
      .catch(err => console.error('Error updating rating:', err));
  }

  filteredBooks() {
    if (this.filterStatus === 'all') return this.favoriteBooks;
    return this.favoriteBooks.filter(b => b.status === this.filterStatus);
  }

  removeFromFavorites(book: Book) {
    this.bookService.removeFromFavorites(book.id!)
      .then(() => this.loadFavorites())
      .catch(err => console.error('Error removing book:', err));
  }

  hasBooksInFilter(): boolean {
    return this.filteredBooks().length > 0;
  }
}