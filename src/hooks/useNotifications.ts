import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api';
import toast from 'react-hot-toast';

export const useNotifications = () => {
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            toast.error('Failed to mark notification as read.');
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            toast.error('Failed to mark all notifications as read.');
        }
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return {
        notifications,
        isLoading,
        unreadCount,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
    };
};
