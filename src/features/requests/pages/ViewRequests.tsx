import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { Request } from '../../../types';
import { Link } from 'react-router-dom';

const getRequests = async (role: string) => {
    const url = role === 'employee' ? '/requests/my-requests' : '/requests';
    const { data } = await api.get<Request[]>(url);
    return data;
};

const ViewRequests = () => {
    const { user } = useAuth();
    const role = user?.role || 'employee';

    const { data: requests, isLoading, error } = useQuery({
        queryKey: ['requests', role],
        queryFn: () => getRequests(role),
    });

    return (
        <>
            <div className="page-header">
                <h1>{role === 'employee' ? 'My Requests' : 'All Requests'}</h1>
                <p>View and manage requests below.</p>
            </div>

            {isLoading && <p>Loading requests...</p>}
            {error && <p className="error-text">Failed to load requests.</p>}

            {requests && requests.length === 0 && (
                <div className="card text-center">
                    <p>No requests found.</p>
                    {role === 'employee' && (
                        <Link to="/make-request" className="btn btn-primary">Make Your First Request</Link>
                    )}
                </div>
            )}

            {requests && requests.length > 0 && (
                <div className="requests-grid">
                    {/* Request cards will go here */}
                </div>
            )}
        </>
    );
};

export default ViewRequests;
