import api from '../api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';

interface AccountForm {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const fetchAccountDetails = async () => {
    const { data } = await api.get<User>('/users/me');
    return data;
};

const updateAccount = async (data: Partial<AccountForm>) => {
    const { data: response } = await api.patch('/users/me', data);
    return response;
};

const Account = () => {
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery<User, Error>({
        queryKey: ['account'],
        queryFn: fetchAccountDetails,
    });

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<AccountForm>({
        values: user, // Pre-fill form with fetched data
    });

    const mutation = useMutation({ 
        mutationFn: updateAccount,
        onSuccess: () => {
            toast.success("Account updated successfully!");
            reset({ password: '', confirmPassword: '' });
            queryClient.invalidateQueries({ queryKey: ['account'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update account.");
        }
    });

    const onSubmit = (data: AccountForm) => {
        const { confirmPassword, ...updateData } = data;
        if (!updateData.password) {
            delete updateData.password;
        }
        mutation.mutate(updateData);
    };

    if (isLoading) {
        return <p>Loading account details...</p>;
    }

    return (
        <div>
            <div className="page-header">
                <h1>My Account</h1>
                <p>Manage your profile details and password.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="account-form-grid">
                <div className="card">
                    <div className="card-header">
                        <FiUser />
                        <h3>Profile Information</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Username</label>
                            <input className="input-field" {...register("username", { required: "Username is required" })} />
                            {errors.username && <p className="error-text">{errors.username.message}</p>}
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" className="input-field" {...register("email", { required: "Email is required" })} />
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <FiLock />
                        <h3>Change Password</h3>
                    </div>
                    <div className="card-body">
                        <p className="form-hint">Leave fields blank to keep your current password.</p>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" className="input-field" {...register("password")} />
                        </div>
                         <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" className="input-field" {...register("confirmPassword", { 
                                validate: value => value === watch('password') || "Passwords do not match"
                            })} />
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="account-form-footer">
                    <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                        <FiSave />
                        {mutation.isPending ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Account;
