import { Link } from 'react-router-dom';
import { Request } from '../types';
import { format } from 'date-fns';

interface RequestCardProps {
  request: Request;
}

const RequestCard = ({ request }: RequestCardProps) => {

  const formatAmount = (amount: any) => {
    const parsed = Number(amount);
    return Number.isFinite(parsed)
      ? parsed.toLocaleString('en-KE', {
          style: 'currency',
          currency: 'KES',
        })
      : 'N/A';
  };

  return (
    <Link to={`/requests/${request.id}`} className="request-card-link">
        <div className="card request-card">
            <div className="request-details-header">
                <div>
                    <h3>{request.title}</h3>
                    <small>
                        {request.employee_username ? `By ${request.employee_username} • ` : ''}
                        {format(new Date(request.created_at), 'PPP')}
                    </small>
                </div>
                <span className={`request-status-badge ${request.status}`}>
                    {request.status}
                </span>
            </div>

            <p className="request-card-description">{request.description}</p>
            
            {request.type === 'monetary' && (
                <div className="request-card-body">
                    <p><strong>Amount: {formatAmount(request.amount)}</strong></p>
                </div>
            )}
        </div>
    </Link>
  );
};

export default RequestCard;
