import React from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";

const PLACEHOLDER = "https://via.placeholder.com/300x445?text=No+Poster";

export default function MovieCard({ movie }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const fav = isFavorite(movie.imdbID);

  // IMDb rating handling
  const imdbRating = parseFloat(movie.imdbRating);
  const ratingStars =
    !isNaN(imdbRating) && imdbRating > 0 ? Math.round(imdbRating / 2) : 0;

  return (
    <div className="bg-gray-800 dark:bg-gray-200 rounded-2xl shadow-lg p-3 flex flex-col transform transition-transform duration-300 hover:scale-105">
      <Link to={`/movie/${movie.imdbID}`} className="block">
        <div className="w-full aspect-2/3 overflow-hidden rounded-lg mb-3 shadow-md">

          <img
            src={movie.Poster === "N/A" ? PLACEHOLDER : movie.Poster}
            alt={`${movie.Title} poster`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        <h3 className="font-semibold text-md sm:text-lg md:text-xl line-clamp-2 text-gray-100 dark:text-gray-800">
          {movie.Title}
        </h3>
        <p className="text-sm sm:text-base text-gray-400 dark:text-gray-700">
          {movie.Year}
        </p>

        {/* ⭐ Star Rating Section */}
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < ratingStars
                  ? "text-yellow-400"
                  : "text-gray-500 dark:text-gray-400"
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.974a1 1 0 00-.364-1.118L2.627 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-300 dark:text-gray-600 text-sm">
            {imdbRating ? `${imdbRating}/10` : "N/A"}
          </span>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="text-sm sm:text-base text-yellow-300 font-medium">
          {imdbRating ? `⭐ ${imdbRating}` : ""}
        </div>
        <button
          onClick={() =>
            fav
              ? removeFromFavorites(movie.imdbID)
              : addToFavorites(movie)
          }
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition transform text-sm sm:text-base ${fav
              ? "bg-red-600 hover:bg-red-500"
              : "bg-indigo-600 hover:bg-indigo-500"
            } text-white active:scale-95`}
          aria-pressed={fav}
        >
          {fav ? "Remove" : "Favorite"}
        </button>
      </div>
    </div>
  );
}
