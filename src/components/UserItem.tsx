import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface UserItemProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onEdit, onDelete }) => {
    const { user: currentUser } = useAuth();
    const role = user.role?.replace('_', ' ') || 'N/A';

    const getInitials = (name: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="card user-item-card">
            <div className="user-item-header">
                <div className="user-avatar">{getInitials(user.username)}</div>
                <div className="user-info">
                    <h3 className="user-name">{user.username}</h3>
                    <p className="user-email">{user.email}</p>
                </div>
            </div>
            <div className="user-item-footer">
                <span className={`user-role-badge role-${user.role}`}>{role}</span>
                {currentUser?.role === 'admin' && user.role !== 'admin' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => onEdit(user)} className="btn btn-secondary btn-sm edit-btn">
                            <FiEdit />
                            <span>Edit</span>
                        </button>
                        <button onClick={() => onDelete(user)} className="btn btn-danger btn-sm">
                            <FiTrash2 />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserItem;
