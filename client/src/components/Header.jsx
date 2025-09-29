import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../store/userSlice';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, isAuthenticated } = useSelector(state => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 fixed top-0 left-0 right-0 z-50 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Vistagram
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4 mr-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium hover:bg-gray-200"
              >
                <Link to="/timeline">Timeline</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white"
              >
                <Link to="/capture">Capture</Link>
              </motion.button>
            </div>
          )}
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white grid place-items-center font-semibold"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </motion.button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 transition-colors"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium hover:bg-gray-200"
              >
                <Link to="/login">Login</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white"
              >
                <Link to="/register">Sign Up</Link>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}