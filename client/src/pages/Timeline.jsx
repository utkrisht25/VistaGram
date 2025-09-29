// src/pages/Timeline.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getJSON, postJSON } from "../lib/api.js";
import PostCard from "../components/PostCard.jsx";
import DarkVeil from "../components/dark_veil/DarkVeil.jsx";

export default function Timeline() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const load = async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    try {
      setLoading(true);
      const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
      const res = await getJSON(`/api/posts${q}`);
      setPosts((prev) => (cursor ? [...prev, ...res.data] : res.data));
      setCursor(res.nextCursor);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // Only runs once on mount
  const toggleLike = async (id) => {
    const prev = posts.slice();
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likeCount: p.likeCount + (p.liked ? -1 : 1),
            }
          : p
      )
    );
    try {
      await postJSON(`/api/posts/${id}/like`, {});
    } catch {
      setPosts(prev);
    }
  };
  const share = async (p) => {
    const url = `${window.location.origin}/post/${p.id}`;
    try {
      let shared = false;

      if (navigator.share) {
        try {
          await navigator.share({ title: "Vistagram", text: p.caption, url });
          shared = true;
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Share error:", error);
          }
          return; // Exit if sharing was cancelled or failed
        }
      } else {
        await navigator.clipboard.writeText(url);
        shared = true;
        // Show a nice toast notification
        const notification = document.createElement("div");
        notification.className =
          "fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg";
        notification.textContent = "Link copied to clipboard!";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }

      if (shared) {
        const res = await postJSON("/api/shares", {
          postId: p.id,
          channel: navigator.share ? "native" : "link",
        });
        setPosts((ps) =>
          ps.map((x) =>
            x.id === p.id ? { ...x, shareCount: res.shareCount } : x
          )
        );
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dark Veil Background */}
      <div className="fixed inset-0 w-full h-full">
        <DarkVeil />
      </div>
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-black/50 pointer-events-none" />
      
          {/* Content */}
          <div className="relative z-10 min-h-screen">
        <div className="max-w-2xl mx-auto py-8 px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'scale-90 opacity-80' : ''}`}
            >
              Explore Moments
            </motion.h1>

            <AnimatePresence mode="popLayout">
              <div className="grid gap-8">
                {posts.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={p}
                      onLike={() => toggleLike(p.id)}
                      onShare={() => share(p)}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {loading && (
              <div className="flex justify-center my-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full shadow-lg shadow-purple-500/20"
                />
              </div>
            )}

            {cursor && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <button
                  onClick={load}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all"
                >
                  Load More
                </button>
              </motion.div>
            )}

            {posts.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share a moment!
                </p>
              </motion.div>
            )}
          </div>
          </div>
      </div>
    
  );
}
