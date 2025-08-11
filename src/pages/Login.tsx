import { useAuth } from '../hooks/useAuth';
import api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '../utils/error.utils';

interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

const Login = () => {
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            const { data: response } = await api.post('/auth/login', data);
            login(response.token);
            toast.success('Logged in successfully!');
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Login to Swiftel</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" className="input-field" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="input-field" {...register("password", { required: "Password is required" })} />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>
                    <div className="form-group">
                       <label className="checkbox-label">
                         <input type="checkbox" {...register("rememberMe")} />
                         Remember Me
                       </label>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <p className="text-center mt-1">
                    No account? <Link to="/register" className="link">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
