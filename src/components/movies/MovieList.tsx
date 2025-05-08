import React from 'react';
import { Movie } from '../../types';
import MovieCard from './MovieCard';
import { useMovies } from '../../context/MovieContext';
import { Film, Search, SlidersHorizontal, X } from 'lucide-react';

interface MovieListProps {
  title: string;
  emptyMessage: string;
  hideFilters?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ 
  title, 
  emptyMessage,
  hideFilters = false 
}) => {
  const { state, setFilter } = useMovies();
  const { filteredMovies, filter, isLoading } = state;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ searchQuery: e.target.value });
  };

  const handleClearSearch = () => {
    setFilter({ searchQuery: '' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilter({ 
      sortBy: sortBy as 'date' | 'title' | 'rating', 
      sortOrder: sortOrder as 'asc' | 'desc' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>

      {!hideFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                value={filter.searchQuery}
                onChange={handleSearch}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {filter.searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-500" />
              <select
                value={`${filter.sortBy}-${filter.sortOrder}`}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="rating-desc">Highest Rating</option>
                <option value="rating-asc">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredMovies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Film size={48} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No movies found</h3>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;