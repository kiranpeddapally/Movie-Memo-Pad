import React from 'react';
import { useMovies } from '../context/MovieContext';
import { Filter, ArrowUpDown } from 'lucide-react';

const FilterBar: React.FC = () => {
  const { state, setFilter } = useMovies();
  const { filter } = state;

  const handleStatusChange = (newStatus: 'all' | 'watched' | 'unwatched') => {
    setFilter({ status: newStatus });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <Filter size={18} />
        <span className="font-medium">Filters</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusChange('all')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter.status === 'all'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Movies
        </button>
        <button
          onClick={() => handleStatusChange('watched')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter.status === 'watched'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Watched
        </button>
        <button
          onClick={() => handleStatusChange('unwatched')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter.status === 'unwatched'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Watchlist
        </button>
      </div>
    </div>
  );
};

export default FilterBar;