
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
}

const EmptyState = ({ icon, title, message }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
