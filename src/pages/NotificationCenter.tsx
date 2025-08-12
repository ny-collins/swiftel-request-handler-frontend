import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiMail } from 'react-icons/fi';

const NotificationCenter = () => {
    const { notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>Notifications</h1>
                <p>Here is a list of all your recent notifications.</p>
            </div>

            <div className="card notification-center-card">
                <div className="notification-center-header">
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => markAllAsRead()}
                        disabled={notifications.every(n => n.is_read)}
                    >
                        Mark All as Read
                    </button>
                </div>
                <div className="notification-center-list">
                    {isLoading && <p>Loading notifications...</p>}
                    {!isLoading && notifications.length === 0 && (
                        <div className="notification-empty-state" style={{padding: '3rem'}}>
                            <FiCheck size={32} />
                            <h3>You're all caught up!</h3>
                            <p>You have no new notifications.</p>
                        </div>
                    )}
                    <ul>
                        {notifications.map(notif => (
                            <li 
                                key={notif.id} 
                                className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className="notification-icon">
                                    <FiMail />
                                </div>
                                <div className="notification-message">
                                    <p>{notif.message}</p>
                                    <small>
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                    </small>
                                </div>
                                {!notif.is_read && <div className="unread-dot"></div>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NotificationCenter;
