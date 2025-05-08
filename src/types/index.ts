export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  releaseYear?: number;
  director?: string;
  genre?: string[];
  watched: boolean;
  rating?: number;
  comment?: string;
  addedAt: Date;
  watchedAt?: Date;
  userId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: User }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

export interface MoviesState {
  movies: Movie[];
  filteredMovies: Movie[];
  isLoading: boolean;
  error: string | null;
  filter: {
    status: 'all' | 'watched' | 'unwatched';
    searchQuery: string;
    genre?: string;
    sortBy: 'date' | 'title' | 'rating';
    sortOrder: 'asc' | 'desc';
  };
}

export type MoviesAction =
  | { type: 'FETCH_MOVIES_START' }
  | { type: 'FETCH_MOVIES_SUCCESS'; payload: Movie[] }
  | { type: 'FETCH_MOVIES_FAILURE'; payload: string }
  | { type: 'ADD_MOVIE_SUCCESS'; payload: Movie }
  | { type: 'UPDATE_MOVIE_SUCCESS'; payload: Movie }
  | { type: 'DELETE_MOVIE_SUCCESS'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<MoviesState['filter']> }
  | { type: 'APPLY_FILTERS' };