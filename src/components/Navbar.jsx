import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      isActive
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
        : "text-gray-200 hover:bg-gray-700 hover:text-white hover:scale-105"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md bg-gray-900/95 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link
          to="/"
          className="text-2xl font-extrabold text-white hover:text-indigo-400 transition-colors"
        >
          🎬 OMDb Search
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            Favorites
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-200 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg z-50 overflow-hidden transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col mt-24 space-y-4 px-6 pb-6">
          <NavLink
            to="/"
            className={linkClass + " text-lg text-center"}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/favorites"
            className={linkClass + " text-lg text-center"}
            onClick={() => setOpen(false)}
          >
            Favorites
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
