// src/components/FavoritesList.jsx
import React from "react";
import MovieCard from "./MovieCard";

const FavoritesList = ({ movies, removeFromFavorites }) => {
  if (movies.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-10">No favorites added yet.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onRemove={() => removeFromFavorites(movie.imdbID)}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
