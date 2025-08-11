import { Link } from 'react-router-dom';
import { Request } from '../types';
import { FiFileText, FiHelpCircle } from 'react-icons/fi';
import EmptyState from './ui/EmptyState';

interface MyRecentRequestStatusProps {
  latestRequest: Request | undefined;
}

const MyRecentRequestStatus = ({ latestRequest }: MyRecentRequestStatusProps) => {

  if (!latestRequest) {
    return (
        <div className="card">
            <h3>My Latest Request</h3>
            <EmptyState 
                icon={<FiHelpCircle />}
                title="No Requests Yet"
                message="You haven't made any requests. Submit one to see its status here."
            />
        </div>
    )
  }

  return (
    <div className="card">
        <h3>My Latest Request</h3>
        <div className="latest-request-widget">
            <div className={`status-icon-bg ${latestRequest.status}`}>
                <FiFileText className="status-icon"/>
            </div>
            <div className="request-widget-details">
                <h4>{latestRequest.title}</h4>
                <p>Status: <span className={`request-status-badge ${latestRequest.status}`}>{latestRequest.status}</span></p>
            </div>
            <Link to="/my-requests" className="btn btn-secondary btn-sm">View All</Link>
        </div>
    </div>
  );
};

export default MyRecentRequestStatus;
