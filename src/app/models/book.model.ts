export interface Book {
  id?: string;
  title: string;
  author: string;
  genre: string;
  description: string;    
  pages: number;         
  coverImage: string;
  status?: string;  // Добавлено для избранных книг
  rating?: number;  // Добавлено для избранных книг
  favorite_id?: number; // ID в таблице избранных
}

export interface UserBookStatus {
  bookId: string;
  userId: string;
  status: 'want-to-read' | 'reading' | 'completed';
  rating?: number;
}

export interface Author {
  Id_автора: number;
  Имя_автора: string;
  Фамилия_автора: string;
}

export interface Genre {
  id_жанра: number;
  Наименование_жанра: string;
}

export interface Status {
  Id_статуса: number;
  Наименование_статуса: string;
}

/*
export interface Book {
  id?: number;           // Изменили string на number для PostgreSQL
  title: string;
  author: string;
  genre: string;
  description?: string;  // Добавили описание
  cover_url?: string;    // Переименовали URL_обложки
  pages?: number;        // Переименовали Кол-во_страниц
}

export interface UserBookStatus {
  id?: number;           // id_избранной_книги
  bookId: number;        // Изменили string на number
  userId: number;        // Добавили userId
  status: 'want-to-read' | 'reading' | 'completed';
  rating?: number;
}
*/ 