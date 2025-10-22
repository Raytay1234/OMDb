import React from "react";
import { useMovies } from "../hooks/useMovies";
import MovieList from "../components/MovieList";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const { favorites, toast } = useMovies();

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No favorites added yet.</p>
      ) : (
        <MovieList movies={favorites} loading={false} error={""} />
      )}

      {/* Toast animation */}
      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {toast}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
