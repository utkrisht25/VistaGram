import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import fetch from 'node-fetch';
import bcrypt from 'bcryptjs';

dotenv.config();

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Sample usernames with creative photographer names
const sampleUsers = [
  { username: 'lighthunter', email: 'light@example.com' },
  { username: 'pixelpoet', email: 'pixel@example.com' },
  { username: 'momentmaker', email: 'moment@example.com' },
  { username: 'visualvoyager', email: 'visual@example.com' },
  { username: 'framefinder', email: 'frame@example.com' },
];

// Sample captions with location tags
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

async function fetchRandomImages(count) {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Please provide UNSPLASH_ACCESS_KEY in .env file');
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=${count}&query=urban-architecture&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Unsplash API Error:', error);
      throw new Error(`Unsplash API error: ${error.errors?.[0] || 'Unknown error'}`);
    }

    const images = await response.json();
    console.log(images);
    
    if (!Array.isArray(images)) {
      console.error('Unexpected response:', images);
      throw new Error('Unexpected response from Unsplash API');
    }

    return images.map(img => ({
      url: img.urls.regular,
      photographer: img.user.name
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    // Return some placeholder images if Unsplash fails
    return Array(count).fill({
      url: 'https://via.placeholder.com/800x800.png?text=Sample+Image',
      photographer: 'Sample Photographer'
    });
  }
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'vistagram' });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create users
    const password = await bcrypt.hash('password123', 10);
    const users = await User.insertMany(
      sampleUsers.map(u => ({
        ...u,
        passwordHash: password
      }))
    );

    // Fetch random images from Unsplash
    const images = await fetchRandomImages(15);

    // Create posts
    const posts = [];
    for (let i = 0; i < images.length; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const timeOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time within last 7 days
      
      posts.push({
        author: user._id,
        username: user.username,
        imageUrl: images[i].url,
        caption: `${sampleCaptions[i % sampleCaptions.length]} 📍 Photo by: ${images[i].photographer}`,
        createdAt: new Date(Date.now() - timeOffset),
        location: 'Urban Explorer'
      });
    }

    await Post.insertMany(posts);
    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();