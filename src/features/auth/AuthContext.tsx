import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { QueryClient } from '@tanstack/react-query';

interface DecodedToken extends User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
    queryClient: QueryClient;
}

export const AuthProvider = ({ children, queryClient }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser: DecodedToken = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decodedUser: DecodedToken = jwtDecode(token);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        queryClient.clear();
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
