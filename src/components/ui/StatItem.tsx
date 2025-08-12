import { ReactNode } from "react";
import './StatItem.css';

interface StatItemProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: 'purple' | 'yellow' | 'green' | 'red';
}

const StatItem = ({ title, value, icon, color }: StatItemProps) => {
    const colorClasses = {
        purple: { background: '#eef2ff', color: '#6366f1' },
        yellow: { background: '#fef9c3', color: '#ca8a04' },
        green: { background: '#dcfce7', color: '#16a34a' },
        red: { background: '#fee2e2', color: '#dc2626' },
    };

    return (
        <div className="card stat-item">
            <div className="stat-item-icon-wrapper" style={colorClasses[color]}>
                {icon}
            </div>
            <div className="stat-item-info">
                <h4>{title}</h4>
                <p>{value}</p>
            </div>
        </div>
    );
};

export default StatItem;