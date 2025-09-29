// src/pages/Capture.jsx
import { useEffect, useRef, useState } from 'react';
import useCamera from '../hooks/useCamera.js';
import { postForm } from '../lib/api.js';
import { useNavigate } from 'react-router-dom';

export default function Capture() {
  const nav = useNavigate();
  const { videoRef, start, stop, capture, ready, error } = useCamera();
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomCaption, setShowCustomCaption] = useState(false);
  const fileInputRef = useRef(null);
  
  // Sample captions from the seed data
  const sampleCaptions = [
    "Chasing light through the urban jungle 🌆 #CityVibes",
    "Where nature meets architecture 🍃 #UrbanNature",
    "Lost in the moment, found in the frame 📸 #StreetPhotography",
    "Colors that speak louder than words 🎨 #ColorGrading",
    "Shadows tell stories too 🌓 #LightAndShadow",
    "Morning coffee with a view ☕ #CafeHopping",
    "Urban patterns that catch the eye 🏗 #UrbanDesign",
    "Reflections of city life 🌍 #CityReflections",
    "Weekend wanderer finding beauty in the ordinary ✨ #StreetStyle",
    "Architecture that takes your breath away 🏛 #ArchitecturePhotography"
  ];

  useEffect(() => { 
    if (!preview) {
      start(); 
    }
    return () => stop(); 
  }, [preview]);

  const handleCapture = async () => {
    const blob = await capture();
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPreview({ 
        url, 
        blob: new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      });
      stop();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview({ url, blob: file });
      stop();
    }
  };

  const resetCapture = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  };

  const onSubmit = async () => {
    if (!preview?.blob || !caption.trim()) return;
    
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', preview.blob);
      fd.append('caption', caption);
      await postForm('/api/posts', fd);
      nav('/');
    } catch (error) {
      console.error('Error posting:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-3 max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Create New Post
      </h1>
      
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <img 
            src={preview.url} 
            alt="Preview" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={resetCapture}
              className="bg-black cursor-pointer bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              ↺ Retake
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-lg">
          {error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                className="px-6 py-3 cursor-pointer rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </button>
            </div>
          ) : (
            <div className="relative">
              <video 
                ref={videoRef} 
                className="w-full h-[400px] bg-black object-cover"
                playsInline 
                muted 
              />
              {!ready ? (
                <div className="absolute inset-0 grid place-items-center text-white bg-black bg-opacity-50">
                  <div className="text-center">
                    <div className="animate-spin mb-2">⌛</div>
                    Initializing camera...
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4">
                  <button 
                    onClick={handleCapture}
                    className="px-6 py-3 cursor-pointer rounded-full bg-white text-gray-900 font-medium shadow-lg hover:bg-gray-50 transition-all"
                  >
                    📸 Capture
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 cursor-pointer py-3 rounded-full bg-white text-gray-900 font-medium shadow-lg hover:bg-gray-50 transition-all"
                  >
                    📁 Upload
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white cursor-pointer"
          value={showCustomCaption ? "custom" : caption}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setShowCustomCaption(true);
              setCaption("");
            } else {
              setShowCustomCaption(false);
              setCaption(e.target.value);
            }
          }}
        >
          <option value="">Select a caption</option>
          {sampleCaptions.map((cap, index) => (
            <option key={index} value={cap}>{cap}</option>
          ))}
          <option value="custom">✏️ Write custom caption...</option>
        </select>

        {showCustomCaption && (
          <div className="animate-fadeIn">
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none h-24"
              placeholder="Write your custom caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <button 
        className={`px-6 py-3 rounded-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold 
          ${(!preview?.blob || !caption.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} 
          transition-all`}
        onClick={onSubmit}
        disabled={!preview?.blob || !caption.trim() || isLoading}
      >
        {isLoading ? '📤 Posting...' : '📤 Share Post'}
      </button>
    </div>
  );
}
