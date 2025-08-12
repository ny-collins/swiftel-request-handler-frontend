import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/error.utils';
import { User } from '../types';

interface AccountUpdateForm {
    username?: string;
    email?: string;
    password?: string;
}

const getMyAccount = async (): Promise<User> => {
    const { data } = await api.get('/users/me');
    return data;
};

const updateMyAccount = async (data: AccountUpdateForm) => {
    const { data: response } = await api.patch('/users/me', data);
    return response;
};

const Account = () => {
    const { user, login } = useAuth();
    const queryClient = useQueryClient();

    const { data: account, isLoading, error } = useQuery({
        queryKey: ['myAccount'],
        queryFn: getMyAccount,
    });

    const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<AccountUpdateForm>({
        values: {
            username: account?.username,
            email: account?.email,
            password: ''
        }
    });

    const mutation = useMutation({
        mutationFn: updateMyAccount,
        onSuccess: (data) => {
            toast.success('Account updated successfully!');
            // If the user details are in the token, we might need to re-login to get a new token
            // For now, just refetch the account data.
            queryClient.invalidateQueries({ queryKey: ['myAccount'] });
            reset({
                username: data.updatedUser?.username || account?.username,
                email: data.updatedUser?.email || account?.email,
                password: ''
            });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    const onSubmit = (data: AccountUpdateForm) => {
        const payload: AccountUpdateForm = {};
        if (data.username !== account?.username) payload.username = data.username;
        if (data.email !== account?.email) payload.email = data.email;
        if (data.password) payload.password = data.password;

        if (Object.keys(payload).length === 0) {
            toast.error("No changes to submit.");
            return;
        }
        mutation.mutate(payload);
    };

    if (isLoading) return <div>Loading account details...</div>;
    if (error) return <div className="error-text">Failed to load account details.</div>

    return (
        <>
            <div className="page-header">
                <h1>My Account</h1>
                <p>View and edit your account details.</p>
            </div>
            <div className="card" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" className="input-field" {...register("username", { required: "Username is required" })} />
                        {errors.username && <p className="error-text">{errors.username.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" className="input-field" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" className="input-field" {...register("password", { minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                        <small className="text-color-secondary">Leave blank to keep your current password.</small>
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input type="text" className="input-field" value={user?.role} disabled style={{ textTransform: 'capitalize'}} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={mutation.isPending || !isDirty}>
                        {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Account;
