// src/pages/Landing.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import urban_photo from '../assets/Urban_Photography.jpg';
import nature_photo from '../assets/Nature_Photography.jpeg';
import portrait_photo from '../assets/Portrait_Photography.jpg';
import creative_photo from '../assets/Creative_Photography.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Share Your Moments, Connect with the World
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Capture, create, and share beautiful moments with the Vistagram community.
              Express yourself through stunning visuals and connect with like-minded creators.
            </p>
            <div className="flex gap-4">
              <Link
                to="/capture"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                📸 Start Capturing
              </Link>
              <Link
                to="/timeline"
                className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-500 transition-all shadow-lg hover:shadow-xl"
              >
                ✨ Explore Timeline
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.img
                  src={urban_photo}
                  alt="Urban Photography"
                  className="rounded-lg shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.img
                  src={nature_photo}
                  alt="Nature Photography"
                  className="rounded-lg shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="space-y-4 pt-8">
                <motion.img
                  src={portrait_photo}
                  alt="Portrait Photography"
                  className="rounded-lg shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.img
                  src={creative_photo}
                  alt="Creative Photography"
                  className="rounded-lg shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-16 dark:text-white"
          >
            Why Choose Vistagram?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📸",
                title: "Capture Moments",
                description: "Use our built-in camera or upload your favorite shots instantly.",
              },
              {
                icon: "🎨",
                title: "Express Yourself",
                description: "Add creative captions and share your unique perspective with the world.",
              },
              {
                icon: "🌍",
                title: "Connect & Engage",
                description: "Join a community of creators, share experiences, and get inspired.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-32"
        >
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already sharing their stories on Vistagram.
            Start your visual journey today!
          </p>
          <Link
            to="/register"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            Create Your Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
}