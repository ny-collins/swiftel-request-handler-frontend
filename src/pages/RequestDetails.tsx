import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Request as RequestType } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { FiCheck, FiX, FiClock, FiUser, FiTag, FiHash, FiCalendar } from 'react-icons/fi';
import FullScreenLoader from '../components/ui/FullScreenLoader';

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
            queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
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
        return <FullScreenLoader />;
    }

    if (error) {
        toast.error('Failed to fetch request details.');
        return <div className="card text-center"><p>Error loading request.</p></div>;
    }

    if (!request) {
        return <div className="card text-center"><p>Request not found.</p></div>;
    }

    const canDecide = (user?.role === 'admin' || user?.role === 'board_member') && request.status === 'pending';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
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
          ? parsed.toLocaleString('en-US', {
              style: 'currency',
              currency: 'KES',
            })
          : 'N/A';
      };

    return (
        <div>
            <div className="page-header">
                <h1>{request.title}</h1>
                <span className={`request-status-badge ${request.status}`}>
                    {request.status}
                </span>
            </div>

            <div className="request-details-grid">
                <div className="request-main-content">
                    <div className="card">
                        <div className="request-meta">
                            <div className="meta-item"><FiUser /><span>{request.employee_username}</span></div>
                            <div className="meta-item"><FiCalendar /><span>{formatDate(request.created_at)}</span></div>
                            <div className="meta-item"><FiTag /><span>{request.type}</span></div>
                            {request.type === 'monetary' && <div className="meta-item"><FiHash /><span>{formatAmount(request.amount)}</span></div>}
                        </div>
                        <hr className="divider" />
                        <div className="description-section">
                            <h3>Description</h3>
                            <p>{request.description}</p>
                        </div>
                    </div>
                </div>

                <div className="request-sidebar">
                    {canDecide && (
                        <div className="card request-actions">
                            <h4>Cast Your Vote</h4>
                            <p>This request is pending your decision.</p>
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

                    <div className="card decisions-section">
                        <h4>Board Decisions</h4>
                        {request.decisions && request.decisions.length > 0 ? (
                            <ul className="decision-list">
                                {request.decisions.map((d) => (
                                    <li key={d.board_member_id} className={`decision-item decision-${d.decision}`}>
                                        <span className="decision-user">{d.username}</span>
                                        <span className="decision-value">{d.decision}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-state-compact">
                                <FiClock />
                                <p>No decisions have been made yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;
