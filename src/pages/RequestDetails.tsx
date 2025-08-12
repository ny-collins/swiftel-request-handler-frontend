import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Request as RequestType, Decision } from '../types';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/error.utils';

const getRequestById = async (id: string) => {
    const { data } = await api.get<RequestType>(`/requests/${id}`);
    return data;
};

const makeDecision = async ({ id, decision }: { id: number, decision: 'approved' | 'rejected' }) => {
    const { data } = await api.post(`/requests/${id}/decide`, { decision });
    return data;
};

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: request, isLoading, error, refetch } = useQuery({
        queryKey: ['request', id],
        queryFn: () => getRequestById(id!),
        enabled: !!id,
    });

    const decisionMutation = useMutation({
        mutationFn: makeDecision,
        onSuccess: () => {
            toast.success('Decision submitted successfully');
            queryClient.invalidateQueries({ queryKey: ['request', id] });
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        }
    });

    const handleDecision = (decision: 'approved' | 'rejected') => {
        if (!id) return;
        decisionMutation.mutate({ id: Number(id), decision });
    };

    const userDecision = request?.decisions?.find(d => d.board_member_id === user?.id)?.decision;

    if (isLoading) return <p>Loading request details...</p>;
    if (error) return <p className="error-text">Failed to load request details.</p>;
    if (!request) return <p>Request not found.</p>;

    const canMakeDecision = user?.role === 'board_member' && request.status === 'pending';

    return (
        <div className="request-details-container">
            <div className="card request-main-card">
                <div className="request-card-header">
                    <h1 className="request-card-title">{request.title}</h1>
                    <span className={`status-chip status-chip-lg ${request.status === 'approved' ? 'status-chip-success' : request.status === 'rejected' ? 'status-chip-danger' : 'status-chip-warning'}`}>
                        {request.status}
                    </span>
                </div>
                <div className="request-meta">
                    <span>By: <strong>{request.employee_username}</strong></span>
                    <span>On: <strong>{format(new Date(request.created_at), 'PPP p')}</strong></span>
                    <span>Type: <strong style={{textTransform: 'capitalize'}}>{request.type}</strong></span>
                    {request.type === 'monetary' && <span>Amount: <strong>${request.amount?.toFixed(2)}</strong></span>}
                </div>
                <div className="request-description">
                    <p>{request.description}</p>
                </div>
            </div>

            {user?.role !== 'employee' && (
                <div className="card decisions-card">
                    <h3>Board Member Decisions</h3>
                    {request.decisions && request.decisions.length > 0 ? (
                        <ul className="decision-list">
                            {request.decisions.map(d => (
                                <li key={d.board_member_id} className="decision-item">
                                    <span>{d.username}</span>
                                    <span className={`decision-pill decision-${d.decision}`}>{d.decision}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No decisions have been made yet.</p>
                    )}
                </div>
            )}

            {canMakeDecision && (
                <div className="card decision-actions-card">
                    <h3>Your Decision</h3>
                    {userDecision ? (
                        <p>You have already decided: <strong className={`decision-text decision-${userDecision}`}>{userDecision}</strong>. You can change your decision until the request is finalized.</p>
                    ) : (
                        <p>You have not made a decision on this request yet.</p>
                    )}
                    <div className="decision-buttons">
                        <button 
                            className="btn btn-success" 
                            onClick={() => handleDecision('approved')}
                            disabled={decisionMutation.isPending}
                        >
                            Approve
                        </button>
                        <button 
                            className="btn btn-danger" 
                            onClick={() => handleDecision('rejected')}
                            disabled={decisionMutation.isPending}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestDetails;
