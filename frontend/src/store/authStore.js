import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ loading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          
          if (data.success) {
            set({
              user: data.data.user,
              token: data.data.token,
              isAuthenticated: true,
              error: null
            });
            return data;
          } else {
            set({ error: data.message });
            return data;
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      register: async (name, email, password, confirmPassword) => {
        set({ loading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirmPassword })
          });
          const data = await response.json();
          
          if (data.success) {
            set({
              user: data.data.user,
              token: data.data.token,
              isAuthenticated: true,
              error: null
            });
          } else {
            set({ error: data.message });
          }
          return data;
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      }),

      checkAuth: () => {
        // Check if user data exists in localStorage
        const storedAuth = localStorage.getItem('auth-store');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.state?.isAuthenticated) {
            set({ isAuthenticated: true });
          }
        }
      }
    }),
    {
      name: 'auth-store'
    }
  )
);