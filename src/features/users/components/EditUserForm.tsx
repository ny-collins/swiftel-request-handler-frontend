import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../../lib/utils';
import { User } from '../../../types';

interface EditUserFormProps {
    user: User;
    onClose: () => void;
}

interface EditUserFormData {
    username: string;
    email: string;
    role: 'employee' | 'board_member' | 'admin';
}

const updateUser = async ({ id, ...data }: EditUserFormData & { id: number }) => {
    const { data: response } = await api.patch(`/users/${id}`, data);
    return response;
};

const EditUserForm = ({ user, onClose }: EditUserFormProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<EditUserFormData>({
        defaultValues: {
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });

    const mutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            toast.success('User updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const onSubmit = (data: EditUserFormData) => {
        mutation.mutate({ ...data, id: user.id });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    className="input-field"
                    {...register('username', { required: 'Username is required' })}
                />
                {errors.username && <p className="error-text">{errors.username.message}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    className="input-field"
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" className="select-field" {...register('role')}>
                    <option value="employee">Employee</option>
                    <option value="board_member">Board Member</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default EditUserForm;
