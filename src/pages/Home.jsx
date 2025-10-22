import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";

const FEATURED = ["Avengers", "Batman", "Inception", "Interstellar"];
const PLACEHOLDER = "https://via.placeholder.com/400x600?text=No+Poster";
const BASE = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function Home() {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch featured movies on mount
  useEffect(() => {
    fetchFeaturedMovies();
  }, []);

  // 🔹 Helper: Fetch Featured Movies
  async function fetchFeaturedMovies() {
    try {
      setLoading(true);
      setError("");

      const searchPromises = FEATURED.map((title) =>
        fetch(`${BASE}?s=${encodeURIComponent(title)}&apikey=${API_KEY}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      const searchResults = await Promise.all(searchPromises);

      const ids = searchResults
        .flatMap((r) => (r?.Search ? r.Search.slice(0, 2) : []))
        .map((m) => m.imdbID);

      const detailsPromises = ids.map((id) =>
        fetch(`${BASE}?i=${id}&apikey=${API_KEY}`)
          .then((res) => res.json())
          .catch(() => null)
      );

      const detailedMovies = (await Promise.all(detailsPromises)).filter(Boolean);
      setMovies(detailedMovies);
    } catch {
      setError("Failed to load featured movies.");
    } finally {
      setLoading(false);
    }
  }

  // 🔍 Handle Search
  async function handleSearch(query) {
    if (!API_KEY) {
      setError("API key not found. Add VITE_OMDB_API_KEY to your .env file.");
      return;
    }

    // If input is empty, reload featured movies
    if (!query.trim()) return fetchFeaturedMovies();

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
      const json = await res.json();

      if (json.Response === "True") {
        const details = await Promise.all(
          json.Search.map((m) =>
            fetch(`${BASE}?i=${m.imdbID}&apikey=${API_KEY}`).then((r) => r.json())
          )
        );
        setMovies(details);
      } else {
        setMovies([]);
      }
    } catch {
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🎬 Movie Search</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search movies..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg text-black focus:outline-none"
        />
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden relative hover:scale-105 transition-transform"
          >
            <Link to={`/movie/${movie.imdbID}`}>
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER}
                alt={movie.Title}
                className="w-full h-80 object-cover"
              />
            </Link>

            <div className="p-3">
              <h3 className="text-lg font-semibold truncate">{movie.Title}</h3>
              <p className="text-sm text-gray-400">{movie.Year}</p>
            </div>

            <button
              onClick={() =>
                isFavorite(movie.imdbID)
                  ? removeFromFavorites(movie.imdbID)
                  : addToFavorites(movie)
              }
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm ${isFavorite(movie.imdbID)
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-200"
                }`}
            >
              {isFavorite(movie.imdbID) ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && movies.length === 0 && !error && (
        <p className="text-center text-gray-400 mt-10">No movies found.</p>
      )}
    </div>
  );
}
