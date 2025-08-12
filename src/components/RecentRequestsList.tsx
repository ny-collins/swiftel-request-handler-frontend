import { Link } from 'react-router-dom';
import { Request } from '../types';
import { FiInbox } from 'react-icons/fi';
import EmptyState from './ui/EmptyState';


interface RecentRequestsListProps {
  requests: Request[];
}

const RecentRequestsList = ({ requests }: RecentRequestsListProps) => {
  if (requests.length === 0) {
    return (
      <div className="card">
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
    <div className="card">
      <div className="list-card-header">
        <h3>Pending Review</h3>
        <Link to="/requests?status=pending" className="btn btn-secondary btn-sm">View All</Link>
      </div>
      <ul className="list-card-list">
        {requests.map(request => (
          <li key={request.id} className="list-card-item">
            <div className="list-card-info">
              <span className="item-title">{request.title}</span>
              <span className="item-user">by {request.employee_username}</span>
            </div>
            <Link to={`/requests/${request.id}`} className="btn btn-primary btn-sm">Review</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentRequestsList;
