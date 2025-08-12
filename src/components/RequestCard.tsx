import { Request } from '../types';
import { format } from 'date-fns';
import { FiClock, FiType, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface RequestCardProps {
    request: Request;
    role: 'employee' | 'admin' | 'board_member';
}

const getStatusChipClass = (status: string) => {
    switch (status) {
        case 'approved': return 'status-chip-success';
        case 'rejected': return 'status-chip-danger';
        case 'pending':
        default: return 'status-chip-warning';
    }
}

const RequestCard = ({ request, role }: RequestCardProps) => {
    const linkTo = role === 'employee' ? `/my-requests/${request.id}` : `/requests/${request.id}`;

    return (
        <Link to={linkTo} className="card request-card">
            <div className="request-card-header">
                <h3 className="request-card-title">{request.title}</h3>
                <span className={`status-chip ${getStatusChipClass(request.status)}`}>
                    {request.status}
                </span>
            </div>
            <p className="request-card-description">{request.description.substring(0, 100)}...</p>
            <div className="request-card-footer">
                <div className="request-card-info-item">
                    <FiClock />
                    <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="request-card-info-item">
                    <FiType />
                    <span style={{textTransform: 'capitalize'}}>{request.type}</span>
                </div>
                {request.type === 'monetary' && request.amount && (
                    <div className="request-card-info-item">
                        <FiDollarSign />
                        <span>{request.amount.toFixed(2)}</span>
                    </div>
                )}
                {role !== 'employee' && (
                     <div className="request-card-info-item">
                        <span>By: {request.employee_username}</span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default RequestCard;
