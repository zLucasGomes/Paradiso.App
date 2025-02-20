"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isLogged: boolean;
  userId: number | null; // Adicione o ID do usuário aqui
  userEmail: string | null; // Adicione o ID do usuário aqui
  setIsLogged: (isLogged: boolean) => void;
  setUserId: (id: number | null) => void; // Função para definir o ID do usuário
  setUserEmail: (email: string | null) => void; // Função para definir o ID do usuário
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null); // Estado para o ID do usuário
  const [userEmail, setUserEmail] = useState<string | null>(null); // Estado para o ID do usuário

  // Efeito para carregar o estado inicial do localStorage
  useEffect(() => {
    const storedIsLogged = localStorage.getItem('isLogged');
    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedIsLogged === 'true') {
      setIsLogged(true);
      setUserId(storedUserId ? parseInt(storedUserId, 10) : null);
      setUserEmail(storedUserEmail ? storedUserEmail : null);
    }
  }, []);

  const handleSetIsLogged = (status: boolean) => {
    setIsLogged(status);
    localStorage.setItem('isLogged', status.toString());
  };

  const handleSetUserId = (id: number | null) => {
    setUserId(id);
    if (id !== null) {
      localStorage.setItem('userId', id.toString());
    } else {
      localStorage.removeItem('userId');
    }
  };

  const handleSetUserEmail = (email: string | null) => {
    setUserEmail(email);
    if (email !== null) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userId');
    }
  };

  return (
    <AuthContext.Provider value={{ isLogged, userId, userEmail, setIsLogged: handleSetIsLogged, setUserId: handleSetUserId, setUserEmail: handleSetUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
