import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const wsUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/^http/, 'ws');
            socketRef.current = new WebSocket(`${wsUrl}?token=${token}`);

            socketRef.current.onmessage = () => {
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            };

            return () => {
                socketRef.current?.close();
            };
        }
    }, [queryClient]);
};
