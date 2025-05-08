import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MoviesState, MoviesAction, Movie } from '../types';
import { useAuth } from './AuthContext';

const initialState: MoviesState = {
  movies: [],
  filteredMovies: [],
  isLoading: false,
  error: null,
  filter: {
    status: 'all',
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
};

const MovieContext = createContext<{
  state: MoviesState;
  dispatch: React.Dispatch<MoviesAction>;
  addMovie: (movie: Omit<Movie, 'id' | 'addedAt' | 'userId'>) => void;
  updateMovie: (id: string, updates: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  setFilter: (filter: Partial<MoviesState['filter']>) => void;
}>({
  state: initialState,
  dispatch: () => null,
  addMovie: () => {},
  updateMovie: () => {},
  deleteMovie: () => {},
  setFilter: () => {},
});

const applyFilters = (movies: Movie[], filter: MoviesState['filter']): Movie[] => {
  let result = [...movies];
  
  // Filter by status
  if (filter.status === 'watched') {
    result = result.filter(movie => movie.watched);
  } else if (filter.status === 'unwatched') {
    result = result.filter(movie => !movie.watched);
  }
  
  // Filter by search query
  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    result = result.filter(
      movie => 
        movie.title.toLowerCase().includes(query) || 
        (movie.director?.toLowerCase().includes(query) || false) ||
        (movie.genre?.some(g => g.toLowerCase().includes(query)) || false)
    );
  }
  
  // Filter by genre
  if (filter.genre) {
    result = result.filter(
      movie => movie.genre?.includes(filter.genre as string) || false
    );
  }
  
  // Sort
  result.sort((a, b) => {
    if (filter.sortBy === 'title') {
      return a.title.localeCompare(b.title) * (filter.sortOrder === 'asc' ? 1 : -1);
    } else if (filter.sortBy === 'rating') {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return (ratingA - ratingB) * (filter.sortOrder === 'asc' ? 1 : -1);
    } else {
      // Default sort by date
      return (new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()) * 
        (filter.sortOrder === 'asc' ? 1 : -1);
    }
  });
  
  return result;
};

const movieReducer = (state: MoviesState, action: MoviesAction): MoviesState => {
  switch (action.type) {
    case 'FETCH_MOVIES_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_MOVIES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        movies: action.payload,
        filteredMovies: applyFilters(action.payload, state.filter),
        error: null,
      };
    case 'FETCH_MOVIES_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_MOVIE_SUCCESS':
      const updatedMovies = [...state.movies, action.payload];
      return {
        ...state,
        movies: updatedMovies,
        filteredMovies: applyFilters(updatedMovies, state.filter),
      };
    case 'UPDATE_MOVIE_SUCCESS':
      const updatedMoviesList = state.movies.map(movie => 
        movie.id === action.payload.id ? action.payload : movie
      );
      return {
        ...state,
        movies: updatedMoviesList,
        filteredMovies: applyFilters(updatedMoviesList, state.filter),
      };
    case 'DELETE_MOVIE_SUCCESS':
      const remainingMovies = state.movies.filter(movie => movie.id !== action.payload);
      return {
        ...state,
        movies: remainingMovies,
        filteredMovies: applyFilters(remainingMovies, state.filter),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'APPLY_FILTERS':
      return {
        ...state,
        filteredMovies: applyFilters(state.movies, state.filter),
      };
    default:
      return state;
  }
};

// Mock movie data
const generateMockMovies = (userId: string): Movie[] => [
  {
    id: '1',
    title: 'Inception',
    posterUrl: 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=600',
    releaseYear: 2010,
    director: 'Christopher Nolan',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    watched: true,
    rating: 4.5,
    comment: 'Mind-bending plot with amazing visuals.',
    addedAt: new Date('2023-01-15'),
    watchedAt: new Date('2023-01-20'),
    userId,
  },
  {
    id: '2',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://images.pexels.com/photos/3692550/pexels-photo-3692550.jpeg?auto=compress&cs=tinysrgb&w=600',
    releaseYear: 1994,
    director: 'Frank Darabont',
    genre: ['Drama'],
    watched: true,
    rating: 5,
    comment: 'One of the best films ever made.',
    addedAt: new Date('2023-02-10'),
    watchedAt: new Date('2023-02-15'),
    userId,
  },
  {
    id: '3',
    title: 'The Dark Knight',
    posterUrl: 'https://images.pexels.com/photos/10904746/pexels-photo-10904746.jpeg?auto=compress&cs=tinysrgb&w=600',
    releaseYear: 2008,
    director: 'Christopher Nolan',
    genre: ['Action', 'Crime', 'Drama'],
    watched: true,
    rating: 4.8,
    comment: 'Heath Ledger\'s Joker is unforgettable.',
    addedAt: new Date('2023-03-05'),
    watchedAt: new Date('2023-03-10'),
    userId,
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    posterUrl: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=600',
    releaseYear: 1994,
    director: 'Quentin Tarantino',
    genre: ['Crime', 'Drama'],
    watched: false,
    addedAt: new Date('2023-04-20'),
    userId,
  },
  {
    id: '5',
    title: 'Dune',
    posterUrl: 'https://images.pexels.com/photos/9544131/pexels-photo-9544131.jpeg?auto=compress&cs=tinysrgb&w=600',
    releaseYear: 2021,
    director: 'Denis Villeneuve',
    genre: ['Sci-Fi', 'Adventure'],
    watched: false,
    addedAt: new Date('2023-05-15'),
    userId,
  }
];

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: authState } = useAuth();
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Load movies from localStorage or generate mock data
  useEffect(() => {
    if (authState.user) {
      dispatch({ type: 'FETCH_MOVIES_START' });
      try {
        const storedMovies = localStorage.getItem(`movies-${authState.user.id}`);
        let movies: Movie[];
        
        if (storedMovies) {
          movies = JSON.parse(storedMovies);
          // Convert string dates back to Date objects
          movies = movies.map(movie => ({
            ...movie,
            addedAt: new Date(movie.addedAt),
            watchedAt: movie.watchedAt ? new Date(movie.watchedAt) : undefined
          }));
        } else {
          // Generate mock data for first login
          movies = generateMockMovies(authState.user.id);
          localStorage.setItem(`movies-${authState.user.id}`, JSON.stringify(movies));
        }
        
        dispatch({ type: 'FETCH_MOVIES_SUCCESS', payload: movies });
      } catch (error) {
        dispatch({ 
          type: 'FETCH_MOVIES_FAILURE', 
          payload: error instanceof Error ? error.message : 'Failed to load movies' 
        });
      }
    } else {
      // Reset movies when logged out
      dispatch({ type: 'FETCH_MOVIES_SUCCESS', payload: [] });
    }
  }, [authState.user]);

  // Save movies to localStorage whenever they change
  useEffect(() => {
    if (authState.user && state.movies.length > 0) {
      localStorage.setItem(`movies-${authState.user.id}`, JSON.stringify(state.movies));
    }
  }, [state.movies, authState.user]);

  const addMovie = (movieData: Omit<Movie, 'id' | 'addedAt' | 'userId'>) => {
    if (!authState.user) return;
    
    const newMovie: Movie = {
      ...movieData,
      id: Math.random().toString(36).substring(2, 11),
      addedAt: new Date(),
      userId: authState.user.id,
    };
    
    dispatch({ type: 'ADD_MOVIE_SUCCESS', payload: newMovie });
  };

  const updateMovie = (id: string, updates: Partial<Movie>) => {
    const movie = state.movies.find(m => m.id === id);
    if (!movie) return;
    
    const updatedMovie: Movie = { 
      ...movie, 
      ...updates,
      // If marking as watched for the first time
      watchedAt: updates.watched && !movie.watched ? new Date() : movie.watchedAt
    };
    
    dispatch({ type: 'UPDATE_MOVIE_SUCCESS', payload: updatedMovie });
  };

  const deleteMovie = (id: string) => {
    dispatch({ type: 'DELETE_MOVIE_SUCCESS', payload: id });
  };

  const setFilter = (filter: Partial<MoviesState['filter']>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
    dispatch({ type: 'APPLY_FILTERS' });
  };

  return (
    <MovieContext.Provider value={{ state, dispatch, addMovie, updateMovie, deleteMovie, setFilter }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);