import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import { FiBell } from 'react-icons/fi';
import { Notification } from '../types';

const NotificationCenter = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const renderSkeleton = () => (
        <div className="notification-center-list">
            <ul>
                {[...Array(5)].map((_, i) => (
                    <li key={i} className="notification-item-skeleton">
                        <div className="skeleton skeleton-icon"></div>
                        <div className="skeleton-info">
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

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

            {isLoading ? renderSkeleton() :
                notifications.length === 0 ? (
                    <EmptyState 
                        icon={<FiBell />}
                        title="No Notifications Yet"
                        message="Important updates and mentions will appear here."
                    />
                ) : (
                    <div className="card">
                        <ul className="notification-center-list">
                            {notifications.map(notif => (
                                <li 
                                    key={notif.id} 
                                    className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    {!notif.is_read && <div className="unread-dot"></div>}
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
                )
            }
        </div>
    );
};

export default NotificationCenter;
