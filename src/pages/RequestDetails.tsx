import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Request as RequestType } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { FiCheck, FiX } from 'react-icons/fi';

const fetchRequestById = async (id: string) => {
    const { data } = await api.get<RequestType>(`/requests/${id}`);
    return data;
};

const makeDecision = async ({ id, decision }: { id: string, decision: 'approved' | 'rejected' }) => {
    const { data } = await api.post(`/requests/${id}/decide`, { decision });
    return data;
};

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: request, isLoading, error } = useQuery<RequestType, Error>({
        queryKey: ['request', id],
        queryFn: () => fetchRequestById(id!),
        enabled: !!id,
    });

    const mutation = useMutation({ 
        mutationFn: makeDecision,
        onSuccess: () => {
            toast.success("Decision recorded successfully!");
            queryClient.invalidateQueries({ queryKey: ['request', id] });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
            navigate('/requests');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to record decision.");
        }
    });

    const handleDecision = (decision: 'approved' | 'rejected') => {
        if (!id) return;
        mutation.mutate({ id, decision });
    };

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

    const canDecide = (user?.role === 'admin' || user?.role === 'board_member') && request.status === 'pending';

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
                {canDecide && (
                    <div className="request-actions">
                        <p>This request is pending. Please cast your vote.</p>
                        <div className="decision-buttons">
                            <button className="btn btn-approve" onClick={() => handleDecision('approved')} disabled={mutation.isPending}>
                                <FiCheck /> Approve
                            </button>
                            <button className="btn btn-reject" onClick={() => handleDecision('rejected')} disabled={mutation.isPending}>
                                <FiX /> Reject
                            </button>
                        </div>
                    </div>
                )}

                <div className="request-details-header">
                    <div>
                        <h3>{request.title}</h3>
                        <small>By: {request.employee_username}</small>
                    </div>
                    <span className={`request-status-badge ${request.status}`}>
                        {request.status}
                    </span>
                </div>
                <div className="request-details-body">
                    <p><strong>Submitted On:</strong> {formatDate(request.created_at)}</p>
                    <p><strong>Type:</strong> <span style={{textTransform: 'capitalize'}}>{request.type}</span></p>
                    {request.type === 'monetary' && (
                        <p><strong>Amount:</strong> {formatAmount(request.amount)}</p>
                    )}
                    <div className="description-section">
                        <p><strong>Description:</strong></p>
                        <p>{request.description}</p>
                    </div>
                </div>

                {request.decisions && (
                    <div className="decisions-section">
                        <h4>Board Decisions:</h4>
                        {request.decisions.length > 0 ? (
                            <ul>
                                {request.decisions.map((d) => (
                                    <li key={d.board_member_id} className={`decision-item`}>
                                        {d.username}: <strong className={`decision-${d.decision}`}>{d.decision.toUpperCase()}</strong>
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