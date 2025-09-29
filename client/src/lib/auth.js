// src/lib/auth.js
const TOKEN_KEY = 'vistagram_token';
const EXPIRY_KEY = 'vistagram_token_expiry';
const HOURS_VALID = 12;

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + HOURS_VALID);
  localStorage.setItem(EXPIRY_KEY, expiryTime.toISOString());
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  if (new Date() > new Date(expiry)) {
    clearToken();
    return null;
  }
  
  return token;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};
