import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Request as RequestType } from '../types';
import toast from 'react-hot-toast';

const fetchRequestById = async (id: string) => {
    const { data } = await api.get<RequestType>(`/requests/${id}`);
    return data;
};

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { data: request, isLoading, error } = useQuery<RequestType, Error>({
        queryKey: ['request', id],
        queryFn: () => fetchRequestById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return <div>Loading request details...</div>; // Replace with a proper skeleton loader later
    }

    if (error) {
        toast.error('Failed to fetch request details.');
        return <div>Error loading request.</div>;
    }

    if (!request) {
        return <div>Request not found.</div>;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
        <div>
            <div className="page-header">
                <h1>Request Details</h1>
            </div>
            <div className="request-details-card">
                <div className="request-card-header">
                    <div>
                        <h3>{request.title}</h3>
                        <small>By: {request.employee_username}</small>
                    </div>
                    <span className={`request-status status-${request.status}`}>
                        {request.status.toUpperCase()}
                    </span>
                </div>
                <div className="request-details-body">
                    <p><strong>Submitted On:</strong> {formatDate(request.created_at)}</p>
                    <p><strong>Type:</strong> <span style={{textTransform: 'capitalize'}}>{request.type}</span></p>
                    {request.type === 'monetary' && (
                        <p><strong>Amount:</strong> {formatAmount(request.amount)}</p>
                    )}
                    <p className="description-section"><strong>Description:</strong></p>
                    <p>{request.description}</p>
                </div>

                {request.decisions && (
                    <div className="decisions-section">
                        <h4>Board Decisions:</h4>
                        {request.decisions.length > 0 ? (
                            <ul>
                                {request.decisions.map((d) => (
                                    <li key={d.board_member_id} className={`decision-item decision-${d.decision}`}>
                                        <span className="decision-text">
                                            {d.username}: <strong className={`decision-${d.decision}`}>{d.decision.toUpperCase()}</strong>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No decisions have been made yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestDetails;
