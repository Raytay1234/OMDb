import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBar({ onSearch, initial = "" }) {
  const [query, setQuery] = useState(initial);
  const [lastSearch, setLastSearch] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed !== lastSearch) {
      onSearch(trimmed);
      setLastSearch(trimmed);
    }
  }, [debouncedQuery, lastSearch, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed !== lastSearch) {
      onSearch(trimmed);
      setLastSearch(trimmed);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col sm:flex-row items-center gap-4 max-w-3xl mx-auto my-8 px-4"
    >
      {/* Input field with icon */}
      <div className="relative flex-1 w-full">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          aria-label="Search movies"
          className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:scale-95 transition-all duration-150 shadow-md"
      >
        <span className="flex items-center gap-2 justify-center">
          <Search size={18} className="sm:hidden" />
          <span>Search</span>
        </span>
      </button>
    </form>
  );
}
