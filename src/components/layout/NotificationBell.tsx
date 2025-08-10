import { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
        setIsOpen(false);
    };

    const handleMarkAllAsRead = () => {
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
        <div className="notification-bell-container" ref={dropdownRef}>
            <button onClick={handleToggle} className="notification-bell-button">
                <FiBell className="notification-bell-icon" />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">Notifications</div>
                    {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No new notifications.</p>
                    ) : (
                        <ul className="notification-list">
                            {notifications.map(notif => (
                                <li 
                                    key={notif.id} 
                                    className={`notification-item ${notif.is_read ? '' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <p>{notif.message}</p>
                                    <small>
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="notification-footer">
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-sm text-primary font-bold">Mark all as read</button>
                        )}
                        <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-sm text-primary font-bold">View All</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;