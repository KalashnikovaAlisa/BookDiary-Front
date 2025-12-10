import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <a routerLink="/books" 
         routerLinkActive="active" 
         [routerLinkActiveOptions]="{exact: false}">
         Найти книгу
      </a>
      <a routerLink="/favorites" 
         routerLinkActive="active" 
         [routerLinkActiveOptions]="{exact: true}">
         Избранное
      </a>
      <button (click)="logout()">Выйти</button>
    </nav>
    <hr>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
  }
}