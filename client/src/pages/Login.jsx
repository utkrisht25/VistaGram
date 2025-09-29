import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { postJSON } from '../lib/api.js';
import { setToken } from '../lib/auth.js';
import { setUser, setLoading, setError } from '../store/userSlice';

export default function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await postJSON('/api/auth/login', { email, password });
      setToken(res.token);
      dispatch(setUser({ email, id: res.userId }));
      nav('/');
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto mt-8"
    >
      <form 
        onSubmit={submit} 
        className="bg-white p-8 rounded-lg shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        
        <div className="space-y-4">
          <div>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Login
        </motion.button>

        <p className="text-center text-gray-600">
          No account?{' '}
          <Link 
            to="/register" 
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            Register here
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

