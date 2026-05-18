import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  register: async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data;
  },
}));

export const useJobStore = create((set) => ({
  currentJob: null,
  setJob: (job) => set({ currentJob: job }),
  resetJob: () => set({ currentJob: null }),
}));

export const useUIStore = create((set) => ({
  isMobile: typeof window !== 'undefined' && window.innerWidth < 768,
  setMobile: (val) => set({ isMobile: val }),
}));
