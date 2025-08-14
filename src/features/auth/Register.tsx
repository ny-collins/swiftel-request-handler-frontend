import { useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '../../lib/utils';
import { FiSettings, FiEye, FiEyeOff } from 'react-icons/fi';

interface RegisterForm {
    username: string;
    email: string;
    password: string;
}

const registerUser = async (userData: RegisterForm) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    const onSubmit = (data: RegisterForm) => {
        mutation.mutate(data);
    };

    return (
        <div className="form-container">
            <div className="card form-card">
                <div className="form-header">
                    <FiSettings className="form-logo-icon" />
                    <h2>Create an Account</h2>
                </div>
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
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                className="input-field" 
                                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.password && <p className="error-text">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="link">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;