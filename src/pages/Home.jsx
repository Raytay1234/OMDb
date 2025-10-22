import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";

const FEATURED = [
  "Avengers", "Batman", "Spiderman", "Jurassic Park",
  "Inception", "The Matrix", "Titanic",
  "The Dark Knight", "Forrest Gump", "Interstellar", "Gladiator",
  "Star Wars", "The Lord of the Rings", "Harry Potter",
  "Pirates of the Caribbean", "Transformers",
  "Mission Impossible", "The Godfather", "Joker", "Frozen", "Toy Story"
];

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE = "https://www.omdbapi.com/";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showTop, setShowTop] = useState(false);

  // Scroll listener for "Back to Top"
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Fetch Featured Movies
  const fetchFeaturedMovies = async (signal) => {
    if (!API_KEY) {
      setError("API key not found. Add VITE_OMDB_API_KEY to .env");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Fetch featured titles in parallel
      const searchPromises = FEATURED.map((title) =>
        fetch(`${BASE}?s=${encodeURIComponent(title)}&apikey=${API_KEY}`, { signal })
          .then((res) => res.json())
          .catch(() => null)
      );

      const searchResults = await Promise.all(searchPromises);

      // Collect IMDb IDs
      const ids = searchResults
        .flatMap((r) => (r?.Search ? r.Search.slice(0, 2) : []))
        .map((m) => m.imdbID);

      // Fetch details in parallel
      const detailPromises = ids.map((id) =>
        fetch(`${BASE}?i=${id}&apikey=${API_KEY}`, { signal })
          .then((res) => res.json())
          .catch(() => null)
      );

      const detailedMovies = (await Promise.all(detailPromises)).filter(Boolean);
      setMovies(detailedMovies);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Failed to load featured movies.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch featured on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchFeaturedMovies(controller.signal);
    return () => controller.abort();
  }, []);

  // 🔍 Search handler
  const handleSearch = async (query) => {
    if (!API_KEY) {
      setError("API key not found. Add VITE_OMDB_API_KEY to .env");
      return;
    }

    // ✅ If query is empty → reload featured
    if (!query.trim()) {
      const controller = new AbortController();
      fetchFeaturedMovies(controller.signal);
      return;
    }

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
  };

  // 🔸 Sorting logic
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "title") return a.Title.localeCompare(b.Title);
    if (sortBy === "year") return (b.Year || "").localeCompare(a.Year || "");
    if (sortBy === "imdb") return (b.imdbRating || 0) - (a.imdbRating || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Featured Movies</h1>

      {/* 🔍 Search */}
      <SearchBar onSearch={handleSearch} />

      {/* ⚙️ Sort Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-gray-200">
        <span>Sort by:</span>
        {["title", "year", "imdb"].map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-3 py-1 rounded transition ${sortBy === key
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {key === "title"
              ? "Title A–Z"
              : key === "year"
                ? "Year"
                : "IMDb Rating"}
          </button>
        ))}
      </div>

      {/* 🎬 Movie List */}
      <MovieList movies={sortedMovies} loading={loading} error={error} />

      {/* ⬆️ Scroll to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white px-4 py-2 
                     rounded-full shadow-lg hover:bg-indigo-500 transition"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}
