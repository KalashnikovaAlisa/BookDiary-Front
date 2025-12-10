import { Routes } from '@angular/router';
import { BooksPageComponent } from './books/books-page/books-page.component';
import { FavoritesPageComponent } from './books/favourites-page/favourites-page.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from '../app/auth/auth-guard';
/*
export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { 
    path: 'books', 
    component: BooksPageComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'favorites', 
    component: FavoritesPageComponent,
    canActivate: [authGuard]
  }
];*/ 
export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'books', component: BooksPageComponent },
  { path: 'favorites', component: FavoritesPageComponent }
];