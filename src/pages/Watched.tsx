import React from 'react';
import MovieList from '../components/movies/MovieList';
import { useMovies } from '../context/MovieContext';

const Watched: React.FC = () => {
  const { setFilter } = useMovies();

  // Set filter to show only watched movies
  React.useEffect(() => {
    setFilter({ status: 'watched' });
    return () => {
      // Reset filter when component unmounts
      setFilter({ status: 'all' });
    };
  }, [setFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Watched Movies</h1>
        <p className="text-gray-600">
          Your watched movies collection with ratings and reviews.
        </p>
      </div>

      <MovieList 
        title="" 
        emptyMessage="You haven't watched any movies yet! Mark movies as watched to see them here."
      />
    </div>
  );
};

export default Watched;