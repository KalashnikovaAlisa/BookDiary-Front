import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">×</button>
        
        <div class="book-details-container">
          <!-- Обложка -->
          <div class="book-cover" *ngIf="book?.coverImage">
            <img [src]="book?.coverImage" [alt]="book?.title" class="cover-image">
          </div>
          <div class="book-cover placeholder" *ngIf="!book?.coverImage">
            <div class="no-cover">Нет обложки</div>
          </div>
          
          <!-- Информация о книге -->
          <div class="book-info">
            <h2 class="book-title">{{ book?.title }}</h2>
            <div class="book-author">
              <strong>Автор:</strong> {{ book?.author }}
            </div>
            
            <div class="book-meta">
              <div class="meta-item" *ngIf="book?.pages">
                <strong>Страниц:</strong> {{ book?.pages }}
              </div>
              <div class="meta-item">
                <strong>Жанр:</strong> {{ book?.genre }}
              </div>
            </div>
            
            <div class="book-description" *ngIf="book?.description">
              <h3>Описание</h3>
              <p>{{ book?.description }}</p>
            </div>
            
            <div class="book-description" *ngIf="!book?.description">
              <p class="no-description">Описание отсутствует</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 30px;
      max-width: 800px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      position: relative;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s ease;
    }
    
    .close-btn:hover {
      background: #c0392b;
      transform: scale(1.1);
    }
    
    .book-details-container {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
    }
    
    .book-cover {
      flex: 0 0 250px;
      height: 350px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(139, 90, 43, 0.2);
    }
    
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .book-cover.placeholder {
      background: linear-gradient(145deg, #fff8dc, #fffbeb);
      border: 2px dashed #d4a76a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .no-cover {
      color: #8b5a2b;
      font-size: 16px;
      font-weight: 500;
    }
    
    .book-info {
      flex: 1;
      min-width: 300px;
    }
    
    .book-title {
      color: #2c1810;
      font-size: 28px;
      margin-bottom: 15px;
      line-height: 1.3;
    }
    
    .book-author {
      font-size: 18px;
      color: #5d4037;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0e6d6;
    }
    
    .book-meta {
      display: flex;
      gap: 30px;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0e6d6;
    }
    
    .meta-item {
      font-size: 16px;
      color: #6c757d;
    }
    
    .meta-item strong {
      color: #8b5a2b;
      margin-right: 8px;
    }
    
    .book-description {
      margin-top: 20px;
    }
    
    .book-description h3 {
      color: #2c1810;
      font-size: 20px;
      margin-bottom: 15px;
    }
    
    .book-description p {
      color: #5d4037;
      line-height: 1.6;
      font-size: 16px;
    }
    
    .no-description {
      color: #a67c52;
      font-style: italic;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .modal-content {
        padding: 20px;
        width: 95%;
      }
      
      .book-details-container {
        flex-direction: column;
      }
      
      .book-cover {
        flex: 0 0 auto;
        height: 300px;
        width: 200px;
        margin: 0 auto;
      }
      
      .book-title {
        font-size: 24px;
      }
      
      .book-meta {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class BookDetailsComponent {
  @Input() book: Book | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}