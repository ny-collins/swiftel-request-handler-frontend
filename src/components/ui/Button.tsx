import { ButtonHTMLAttributes, ReactNode } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'approve' | 'reject';
}

const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
    const variantClass = `btn-${variant}`;
    
    return (
        <button className={`btn ${variantClass} ${className || ''}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
