import { Link } from 'react-router-dom';
import { Request } from '../types';

interface RequestCardProps {
  request: Request;
}

const RequestCard = ({ request }: RequestCardProps) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: any) => {
    const parsed = Number(amount);
    return Number.isFinite(parsed)
      ? parsed.toLocaleString('en-KE', {
          style: 'currency',
          currency: 'KES',
        })
      : 'Invalid amount';
  };

  return (
    <Link to={`/requests/${request.id}`} className="request-card-link">
        <div className="request-card">
        <div className="request-card-header">
            <div>
            <h3>{request.title}</h3>
            {request.employee_username && (
                <small>By: {request.employee_username}</small>
            )}
            </div>
            <span className={`request-status status-${request.status}`}>
            {request.status.toUpperCase()}
            </span>
        </div>

        <div className="request-card-body">
            <p className="request-card-description">{request.description}</p>
            <small>Submitted on: {formatDate(request.created_at)}</small>
            {request.type === 'monetary' && (
            <p>
                <strong>Amount: {formatAmount(request.amount)}</strong>
            </p>
            )}
        </div>
        </div>
    </Link>
  );
};

export default RequestCard;
