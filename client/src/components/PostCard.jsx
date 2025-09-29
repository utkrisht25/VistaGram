// src/components/PostCard.jsx
import { motion } from 'framer-motion';

export default function PostCard({ post, onLike, onShare }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50"
    >
      <motion.div 
        className="flex items-center gap-3 p-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white grid place-items-center font-semibold text-lg shadow-md"
        >
          {post.username[0].toUpperCase()}
        </motion.div>
        <div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-semibold text-gray-100 hover:text-purple-400 transition-colors"
          >
            @{post.username}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-gray-400"
          >
            {new Date(post.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100"
      >
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={post.imageUrl} 
          alt={post.caption} 
          className="w-full h-full object-cover hover:opacity-95 transition-opacity duration-300"
          loading="lazy"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 space-y-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              post.liked
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
            onClick={onLike}
          >
            <motion.span
              animate={post.liked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {post.liked ? '❤️' : '🤍'}
            </motion.span>
            <span>{post.likeCount}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md font-medium transition-all duration-300"
            onClick={onShare}
          >
            <motion.span whileHover={{ rotate: 20 }}>🔗</motion.span>
            <span>{post.shareCount}</span>
          </motion.button>
        </div>

        {post.caption && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-200 leading-relaxed"
          >
            <span className="font-semibold text-purple-600">@{post.username}</span>{' '}
            {post.caption}
          </motion.p>
        )}
      </motion.div>
    </motion.article>
  );
}
