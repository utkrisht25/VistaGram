// src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const headers = () => {
  const h = { };
  const t = localStorage.getItem('vistagram_token');
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
};

export const postJSON = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers() },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};

export const getJSON = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers: headers(), credentials: 'include' });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};

export const postForm = async (path, formData) => {
  // Don't include Content-Type header for FormData, browser will set it with boundary
  const h = headers();
  const res = await fetch(`${BASE}${path}`, { 
    method: 'POST', 
    headers: h, 
    body: formData, 
    credentials: 'include'
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Upload failed');
  }
  return res.json();
};
