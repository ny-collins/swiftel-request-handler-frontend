import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import { User } from '../types';

interface UserItemProps {
    user: User;
    onEdit: (user: User) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onEdit }) => {
    const { user: currentUser } = useAuth();

    return (
        <div className="user-item-card">
            <div className="user-item-display">
                <div className="user-details">
                    <h3>{user.username}</h3>
                    <p className="user-email">{user.email}</p>
                    <span className={`user-role role-${user.role!}`}>{user.role!.replace('_', ' ').toUpperCase()}</span>
                </div>
                {currentUser?.role === 'admin' && user.role !== 'admin' && (
                    <Button onClick={() => onEdit(user)} className="btn-sm">Edit</Button>
                )}
            </div>
        </div>
    );
};

export default UserItem;
