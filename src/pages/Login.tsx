import { useAuth } from '../hooks/useAuth';
import api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '../utils/error.utils';

interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

const loginUser = async (credentials: LoginForm) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
};

const Login = () => {
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            login(data.token);
            toast.success('Logged in successfully!');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    const onSubmit = (data: LoginForm) => {
        mutation.mutate(data);
    };

    return (
        <div className="form-container">
            <div className="card form-card">
                <h2>Login to Swiftel</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" className="input-field" {...register("email", { required: "Email is required" })} autoComplete="email" />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="input-field" {...register("password", { required: "Password is required" })} autoComplete="current-password" />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>
                    <div className="form-group">
                       <label className="checkbox-label">
                         <input type="checkbox" {...register("rememberMe")} />
                         Remember Me
                       </label>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    No account? <Link to="/register" className="link">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
