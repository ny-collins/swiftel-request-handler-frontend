import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

interface UserItemProps {
    user: User;
    onEdit: (user: User) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onEdit }) => {
    const { user: currentUser } = useAuth();
    const role = user.role?.replace('_', ' ') || 'N/A';

    return (
        <div className="card user-item-card">
            <div className="user-details">
                <h3>{user.username}</h3>
                <p className="user-email">{user.email}</p>
                <span className={`user-role ${user.role}`}>{role}</span>
            </div>
            {currentUser?.role === 'admin' && user.role !== 'admin' && (
                <button onClick={() => onEdit(user)} className="btn btn-secondary btn-sm">Edit</button>
            )}
        </div>
    );
};

export default UserItem;
