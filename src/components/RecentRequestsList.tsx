import { Link } from 'react-router-dom';
import { Request } from '../types';
import { FiInbox } from 'react-icons/fi';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';

interface RecentRequestsListProps {
  requests: Request[];
}

const RecentRequestsList = ({ requests }: RecentRequestsListProps) => {
  if (requests.length === 0) {
    return (
      <div className="recent-requests-card">
        <h3>Pending Review</h3>
        <EmptyState 
            icon={<FiInbox />}
            title="All Caught Up"
            message="There are no pending requests that need your review."
        />
      </div>
    );
  }

  return (
    <div className="recent-requests-card">
      <div className="recent-requests-header">
        <h3>Pending Review</h3>
        <Link to="/requests?status=pending">
          <Button variant="secondary" className="btn-sm">View All</Button>
        </Link>
      </div>
      <ul className="recent-requests-list">
        {requests.map(request => (
          <li key={request.id} className="recent-request-item">
            <div className="request-info">
              <span className="request-title">{request.title}</span>
              <span className="request-user">by {request.employee_username}</span>
            </div>
            <Link to={`/requests/${request.id}`}>
                <Button className="btn-sm">Review</Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentRequestsList;
