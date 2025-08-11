import api from '../api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '../utils/error.utils';

interface RegisterForm {
    username: string;
    email: string;
    password: string;
}

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        try {
            await api.post('/auth/register', data);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error: any) {
            toast.error(getErrorMessage(error));
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="username">Name</label>
                        <input type="text" id="username" className="input-field" {...register("username", { required: "Username is required" })} />
                        {errors.username && <p className="error-text">{errors.username.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" className="input-field" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className="error-text">{errors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="input-field" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
                <p className="text-center mt-1">
                    Already have an account? <Link to="/login" className="link">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
