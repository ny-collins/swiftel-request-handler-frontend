import { ReactNode } from "react";

interface StatItemProps {
    title: string;
    value: string | number;
    icon: ReactNode;
}

const StatItem = ({ title, value, icon }: StatItemProps) => {
    return (
        <div className="stat-item">
            <div className="stat-item-header">
                <span className="stat-item-icon">{icon}</span>
                <span>{title}</span>
            </div>
            <p className="stat-item-value">{value}</p>
        </div>
    );
};

export default StatItem;