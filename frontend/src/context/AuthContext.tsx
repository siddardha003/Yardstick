import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, setToken, removeToken } from '../utils/storage';

interface User {
  userId: string;
  tenantId: string;
  role: 'Admin' | 'Member';
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info (simple base64 decode for demo)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          userId: payload.userId,
          tenantId: payload.tenantId,
          role: payload.role,
          email: payload.email,
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwt: string, user: User) => {
    setToken(jwt);
    setTokenState(jwt);
    setUser(user);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
