import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../lib/utils';

const getUsers = async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
};

const deleteUser = async (userId: number) => {
    await api.delete(`/users/${userId}`);
};

const Users = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        }
    });

    const handleDelete = (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteMutation.mutate(userId);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>User Management</h1>
                <p>View, edit, or delete user accounts.</p>
            </div>

            <div className="card full-width-card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined On</th>
                                {currentUser?.role === 'admin' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && <tr><td colSpan={5}>Loading users...</td></tr>}
                            {error && <tr><td colSpan={5} className="error-text">Failed to load users.</td></tr>}
                            {users?.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td style={{textTransform: 'capitalize'}}>{user.role}</td>
                                    <td>{format(new Date(user.created_at), 'PPP')}</td>
                                    {currentUser?.role === 'admin' && (
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn-icon" disabled={user.role === 'admin'}>
                                                    <FiEdit />
                                                </button>
                                                <button 
                                                    className="btn-icon btn-icon-danger" 
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={user.role === 'admin' || deleteMutation.isPending}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Users;
