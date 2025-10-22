import React from "react";
import MovieCard from "./MovieCard";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function MovieList({ movies, loading, error, loadMore, hasMore }) {
  if (loading && movies.length === 0)
    return (
      <p className="text-center py-12 text-gray-400 animate-pulse">
        Loading movies…
      </p>
    );

  if (error)
    return (
      <p className="text-center py-12 text-red-400">
        ⚠️ {error}
      </p>
    );

  if (!movies || movies.length === 0)
    return (
      <p className="text-center py-12 text-gray-400">
        No movies found.
      </p>
    );

  return (
    <div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 md:px-8 lg:px-10">
        <AnimatePresence>
          {movies.map((movie) => (
            <Motion.div
              key={movie.imdbID}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              layout
            >
              <MovieCard movie={movie} />
            </Motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Load more button for fallback if infinite scroll fails */}
      {hasMore && !loading && (
        <div className="text-center my-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && movies.length > 0 && (
        <p className="text-center py-6 text-gray-400 animate-pulse">
          Loading more…
        </p>
      )}
    </div>
  );
}
