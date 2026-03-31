import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { User } from '../types';
import apiClient from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; access_token: string; refresh_token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = { user: null, isAuthenticated: false, isLoading: true };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch {
      // ignore logout errors
    } finally {
      window.__accessToken = undefined;
      localStorage.removeItem('refresh_token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Listen for forced logout from interceptor
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  // Bootstrap: try to re-auth from stored refresh token
  useEffect(() => {
    const bootstrap = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const { data: refreshData } = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
        window.__accessToken = refreshData.data.access_token;
        localStorage.setItem('refresh_token', refreshData.data.refresh_token);

        const { data: meData } = await apiClient.get('/auth/me');
        dispatch({
          type: 'LOGIN',
          payload: {
            user: meData.data,
            access_token: refreshData.data.access_token,
            refresh_token: refreshData.data.refresh_token,
          },
        });
      } catch {
        window.__accessToken = undefined;
        localStorage.removeItem('refresh_token');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    const { user, access_token, refresh_token } = data.data;
    window.__accessToken = access_token;
    localStorage.setItem('refresh_token', refresh_token);
    dispatch({ type: 'LOGIN', payload: { user, access_token, refresh_token } });
  };

  const register = async (full_name: string, email: string, password: string) => {
    const { data } = await apiClient.post('/auth/register', { full_name, email, password });
    const { user, access_token, refresh_token } = data.data;
    window.__accessToken = access_token;
    localStorage.setItem('refresh_token', refresh_token);
    dispatch({ type: 'LOGIN', payload: { user, access_token, refresh_token } });
  };

  const refreshUser = async () => {
    const { data } = await apiClient.get('/auth/me');
    dispatch({ type: 'UPDATE_USER', payload: data.data });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
