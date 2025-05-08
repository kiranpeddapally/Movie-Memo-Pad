import React, { useState } from 'react';
import MovieList from '../components/movies/MovieList';
import MovieForm from '../components/movies/MovieForm';
import { PlusCircle } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

const Watchlist: React.FC = () => {
  const [showAddMovie, setShowAddMovie] = useState(false);
  const { setFilter } = useMovies();

  // Set filter to show only unwatched movies
  React.useEffect(() => {
    setFilter({ status: 'unwatched' });
    return () => {
      // Reset filter when component unmounts
      setFilter({ status: 'all' });
    };
  }, [setFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Watchlist</h1>
        <button
          onClick={() => setShowAddMovie(true)}
          className="mt-4 md:mt-0 flex items-center bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" /> Add New Movie
        </button>
      </div>

      {showAddMovie && <MovieForm onClose={() => setShowAddMovie(false)} />}

      <MovieList 
        title="" 
        emptyMessage="Your watchlist is empty! Add movies you want to watch."
      />
    </div>
  );
};

export default Watchlist;