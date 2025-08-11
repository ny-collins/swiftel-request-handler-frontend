import { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import { Notification } from '../../types';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        setIsOpen(false);
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAllAsRead();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button onClick={handleToggle} className="notification-bell-button" aria-label={`Notifications (${unreadCount} unread)`}>
                <FiBell className="notification-bell-icon" />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">Notifications</div>
                    {notifications.length === 0 ? (
                        <p className="notification-empty-state">You're all caught up!</p>
                    ) : (
                        <ul className="notification-list">
                            {notifications.slice(0, 10).map(notif => (
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
                    )}
                    <div className="notification-footer">
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead}>Mark all as read</button>
                        )}
                        <Link to="/notifications" onClick={() => setIsOpen(false)}>View All</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;