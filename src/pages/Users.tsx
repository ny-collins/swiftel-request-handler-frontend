import { useState, useMemo } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { User } from '../types';
import UserItem from '../components/UserItem';
import UserItemSkeleton from '../components/ui/UserItemSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { FiUsers } from 'react-icons/fi';
import { Input } from '../components/ui/Input';

const fetchUsers = async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
};

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: users = [], isLoading, error } = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    if (error) {
        toast.error('Failed to fetch users.');
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="users-list-grid">
                    {[...Array(6)].map((_, i) => <UserItemSkeleton key={i} />)}
                </div>
            );
        }

        if (filteredUsers.length === 0) {
            return (
                <EmptyState 
                    icon={<FiUsers />}
                    title={searchTerm ? "No Users Found" : "No Users Yet"}
                    message={searchTerm ? `No users match the search term "${searchTerm}".` : "When new users register, they will appear here."}
                />
            );
        }

        return (
            <div className="users-list-grid">
                {filteredUsers.map(user => (
                    <UserItem key={user.id} user={user} />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="page-header">
                <h1>User Management</h1>
            </div>
            <div className="page-controls">
                 <Input 
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default Users;
