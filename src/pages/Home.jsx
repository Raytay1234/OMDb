import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortType, setSortType] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRatings, setUserRatings] = useState(() => {
    const saved = localStorage.getItem("userRatings");
    return saved ? JSON.parse(saved) : {};
  });

  // Fetch genres and trending
  useEffect(() => {
    fetchGenres();
    fetchTrending();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("Error fetching trending:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) return fetchTrending();

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("Error searching movies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        searchMovies(query);
      } else {
        fetchTrending();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, searchMovies]);

  // Apply genre filter and sorting
  const filteredMovies = movies
    .filter((movie) =>
      selectedGenre
        ? movie.genre_ids?.includes(Number(selectedGenre))
        : true
    )
    .sort((a, b) => {
      if (sortType === "a-z") return a.title.localeCompare(b.title);
      if (sortType === "z-a") return b.title.localeCompare(a.title);
      if (sortType === "rating-high") return b.vote_average - a.vote_average;
      if (sortType === "rating-low") return a.vote_average - b.vote_average;
      return 0;
    });

  // Handle user rating
  const handleRating = (movieId, rating) => {
    const updatedRatings = { ...userRatings, [movieId]: rating };
    setUserRatings(updatedRatings);
    localStorage.setItem("userRatings", JSON.stringify(updatedRatings));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search bar */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Genre filter */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Sort By</option>
          <option value="a-z">A → Z</option>
          <option value="z-a">Z → A</option>
          <option value="rating-high">Rating: High → Low</option>
          <option value="rating-low">Rating: Low → High</option>
        </select>
      </div>

      {/* Movie grid */}
      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : filteredMovies.length === 0 ? (
        <p className="text-gray-400 text-center">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard movie={movie} />

              {/* Rating section */}
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const userRating = userRatings[movie.id] || 0;
                  return (
                    <span
                      key={star}
                      onClick={() => handleRating(movie.id, star)}
                      className={`cursor-pointer text-xl transition-transform duration-150 ${
                        star <= userRating
                          ? "text-yellow-400 scale-110"
                          : "text-gray-500 hover:text-yellow-300"
                      }`}
                    >
                      ★
                    </span>
                  );
                })}
              </div>

              {/* TMDB Rating */}
              <p className="text-center text-gray-400 text-sm mt-1">
                TMDB: ⭐ {movie.vote_average.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
