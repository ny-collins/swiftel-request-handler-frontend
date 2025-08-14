import api from '.';
import { Notification } from '../types';

export const getNotifications = async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data;
};

export const markNotificationAsRead = async (notificationId: number): Promise<Notification> => {
    const { data } = await api.put(`/notifications/${notificationId}/read`);
    return data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.put('/notifications/mark-all-read');
};
