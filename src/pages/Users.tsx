import { useState, useMemo } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import UserItem from '../components/UserItem';
import EditUserModal from '../components/EditUserModal';
import UserItemSkeleton from '../components/ui/UserItemSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { FiUsers } from 'react-icons/fi';
import { Input } from '../components/ui/Input';

const fetchUsers = async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
};

const updateUser = async (userData: User) => {
    const { data } = await api.patch(`/users/${userData.id}`, userData);
    return data;
};

const Users = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: users = [], isLoading, error } = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const mutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            toast.success("User updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            setSelectedUser(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user.");
        }
    });

    const handleEditClick = (user: User) => {
        if (user.role === 'admin') {
            toast.error("Admin accounts cannot be modified.");
            return;
        }
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSave = (data: User) => {
        mutation.mutate(data);
    };

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
                    message={searchTerm ? `No users match the search term \"${searchTerm}\".` : "When new users register, they will appear here."}
                />
            );
        }

        return (
            <div className="users-list-grid">
                {filteredUsers.map(user => (
                    <UserItem key={user.id} user={user} onEdit={handleEditClick} />
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

            {isModalOpen && selectedUser && (
                <EditUserModal 
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    isSaving={mutation.isPending}
                />
            )}
        </div>
    );
};

export default Users;
