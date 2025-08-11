import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import { FiBell } from 'react-icons/fi';

const NotificationCenter = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: any) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    if (isLoading) {
        return <div>Loading notifications...</div>
    }

    return (
        <div>
            <div className="page-header">
                <h1>Notifications</h1>
                {unreadCount > 0 && (
                    <button className="btn btn-secondary btn-sm" onClick={() => markAllAsRead()} disabled={unreadCount === 0}>
                        Mark All as Read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <EmptyState 
                    icon={<FiBell />}
                    title="No Notifications Yet"
                    message="Important updates and mentions will appear here."
                />
            ) : (
                <div className="notification-center-list">
                    <ul>
                        {notifications.map(notif => (
                            <li 
                                key={notif.id} 
                                className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className="dot"></div>
                                <div className="notification-message">
                                    <p>{notif.message}</p>
                                    <small>
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                    </small>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
