import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import { Notification } from '../../types';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
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
                <FiBell />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">Mark all as read</button>
                        )}
                    </div>
                    <div className="notification-dropdown-content">
                        {isLoading ? (
                            <p className="notification-empty-state">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty-state">
                                <FiCheck size={24} />
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            <ul className="notification-list">
                                {notifications.slice(0, 5).map(notif => (
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
                        )}
                    </div>
                    <div className="notification-footer">
                        <Link to="/notifications" onClick={() => setIsOpen(false)}>View All Notifications</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
