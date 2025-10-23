import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Home, Film, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md fixed w-full top-0 left-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
        >
          <Film size={24} className="text-indigo-400" />
          <span>MovieSearch</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm sm:text-base transition-all duration-200 ${isActive
                ? "text-indigo-400 font-semibold"
                : "text-gray-300 hover:text-white"
              }`
            }
          >
            <Home size={18} /> <span>Home</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm sm:text-base transition-all duration-200 ${isActive
                ? "text-indigo-400 font-semibold"
                : "text-gray-300 hover:text-white"
              }`
            }
          >
            <Heart size={18} /> <span>Favorites</span>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-gray-300 hover:text-white transition-colors duration-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden bg-gray-900 border-t border-gray-800 px-5 pb-4 space-y-3">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-all ${isActive ? "text-indigo-400 font-semibold" : ""
              }`
            }
          >
            <Home size={18} /> <span>Home</span>
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-all ${isActive ? "text-indigo-400 font-semibold" : ""
              }`
            }
          >
            <Heart size={18} /> <span>Favorites</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
}
