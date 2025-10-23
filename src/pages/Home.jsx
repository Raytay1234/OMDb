import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import ScrollTop from "../components/ScrollTop";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortType, setSortType] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch genres and trending movies initially
  useEffect(() => {
    fetchGenres();
    fetchTrending(1, true);
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

  const fetchTrending = async (pageNumber = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${pageNumber}`
      );
      const data = await res.json();
      if (reset) setMovies(data.results || []);
      else setMovies((prev) => [...prev, ...(data.results || [])]);
      setHasMore(pageNumber < data.total_pages);
    } catch (err) {
      console.error("Error fetching trending:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = useCallback(
    async (searchTerm, pageNumber = 1, reset = false) => {
      if (!searchTerm.trim()) return fetchTrending(1, true);

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchTerm
          )}&page=${pageNumber}`
        );
        const data = await res.json();
        if (reset) setMovies(data.results || []);
        else setMovies((prev) => [...prev, ...(data.results || [])]);
        setHasMore(pageNumber < data.total_pages);
      } catch (err) {
        console.error("Error searching movies:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Handle query changes with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() !== "") searchMovies(query, 1, true);
      else fetchTrending(1, true);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, searchMovies]);

  // Filter & sort
  const filteredMovies = movies
    .filter((movie) =>
      selectedGenre ? movie.genre_ids?.includes(Number(selectedGenre)) : true
    )
    .sort((a, b) => {
      if (sortType === "a-z") return a.title.localeCompare(b.title);
      if (sortType === "z-a") return b.title.localeCompare(a.title);
      if (sortType === "rating-high") return b.vote_average - a.vote_average;
      if (sortType === "rating-low") return a.vote_average - b.vote_average;
      return 0;
    });

  // Load more function
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (query.trim()) searchMovies(query, nextPage);
    else fetchTrending(nextPage);
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
      {loading && movies.length === 0 ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : filteredMovies.length === 0 ? (
        <p className="text-gray-400 text-center">No movies found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 transition-transform active:scale-95 shadow-md"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
      <ScrollTop />
    </div>
  );
}
