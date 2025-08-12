import { useState, useMemo } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import UserItem from '../components/UserItem';
import EditUserModal from '../components/EditUserModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import UserItemSkeleton from '../components/ui/UserItemSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { FiUsers, FiSearch } from 'react-icons/fi';

const fetchUsers = async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
};

const updateUser = async (userData: User) => {
    const { data } = await api.patch(`/users/${userData.id}`, userData);
    return data;
};

const deleteUser = async (userId: number) => {
    await api.delete(`/users/${userId}`);
};

const Users = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: users = [], isLoading, error } = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            toast.success("User updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsEditModalOpen(false);
            setSelectedUser(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete user.");
        }
    });

    const handleEditClick = (user: User) => {
        if (user.role === 'admin') {
            toast.error("Admin accounts cannot be modified.");
            return;
        }
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        if (user.role === 'admin') {
            toast.error("Admin accounts cannot be deleted.");
            return;
        }
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleSave = (data: User) => {
        updateMutation.mutate(data);
    };

    const handleDeleteConfirm = () => {
        if (selectedUser) {
            deleteMutation.mutate(selectedUser.id);
        }
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
                <div className="users-grid">
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
            <div className="users-grid">
                {filteredUsers.map(user => (
                    <UserItem key={user.id} user={user} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="page-header">
                <h1>User Management</h1>
            </div>
            <div className="page-controls-card">
                <div className="input-wrapper" style={{width: '100%'}}>
                    <FiSearch style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)'}} />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{paddingLeft: '2.5rem'}}
                    />
                </div>
            </div>
            
            {renderContent()}

            {isEditModalOpen && selectedUser && (
                <EditUserModal 
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    isSaving={updateMutation.isPending}
                />
            )}

            {isDeleteModalOpen && selectedUser && (
                <ConfirmationModal
                    title="Delete User"
                    message={`Are you sure you want to delete the user "${selectedUser.username}"? This action cannot be undone.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleCloseModal}
                    isConfirming={deleteMutation.isPending}
                />
            )}
        </div>
    );
};

export default Users;