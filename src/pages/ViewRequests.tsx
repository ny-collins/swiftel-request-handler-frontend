import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api';
import toast from 'react-hot-toast';
import RequestCard from '../components/RequestCard';
import EditDecisionModal from '../components/EditDecisionModal';
import FilterDropdown from '../components/ui/FilterDropdown';
import EmptyState from '../components/ui/EmptyState';
import RequestCardSkeleton from '../components/ui/RequestCardSkeleton';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FiInbox } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Request as RequestType, Decision } from '../types';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

interface EditDecisionPayload {
    requestId: number;
    boardMemberId: number;
    currentDecision: Decision['decision'];
}

const fetchRequests = async (isEmployee: boolean) => {
    const url = isEmployee ? '/requests/my-requests' : '/requests';
    const { data } = await api.get<RequestType[]>(url);
    return data;
};

const makeDecision = async (params: { requestId: number, decision: Decision['decision'], boardMemberId?: number }) => {
    const { requestId, ...payload } = params;
    const { data } = await api.post(`/requests/${requestId}/decide`, payload);
    return data;
};

function getScreenSize() {
    if (window.innerWidth < 768) return 'small';
    return 'large';
}

const ViewRequests = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const isEmployee = user?.role === 'employee';
    const isAdmin = user?.role === 'admin';

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPayload, setModalPayload] = useState<EditDecisionPayload | null>(null);
    const [screenSize, setScreenSize] = useState(getScreenSize());

    const getInitialFilter = (): StatusFilter => {
        const status = searchParams.get('status');
        if (status === 'pending' || status === 'approved' || status === 'rejected' || status === 'all') {
            return status;
        }
        return isEmployee ? 'all' : 'pending';
    };

    const [filter, setFilter] = useState<StatusFilter>(getInitialFilter);

    const handleFilterChange = (newFilter: StatusFilter) => {
        setFilter(newFilter);
        setSearchParams({ status: newFilter });
    };

    const handleResize = useCallback(() => {
        setScreenSize(getScreenSize());
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const { data: requests = [], isLoading, error } = useQuery<RequestType[], Error>({
        queryKey: ['requests', isEmployee],
        queryFn: () => fetchRequests(isEmployee),
    });

    const mutation = useMutation({ 
        mutationFn: makeDecision,
        onSuccess: () => {
            toast.success('Decision submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['requests'] });
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit decision.');
        }
    });

    

    const handleSaveChanges = (newDecision: Decision['decision']) => {
        if (!modalPayload) return;

        const payload: { requestId: number, decision: Decision['decision'], boardMemberId?: number } = {
            requestId: modalPayload.requestId,
            decision: newDecision,
        };

        if (isAdmin) {
            payload.boardMemberId = modalPayload.boardMemberId;
        }
        
        mutation.mutate(payload);
    };

    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ];

    const filteredRequests = useMemo(() => {
        let filtered = requests;

        if (filter !== 'all') {
            filtered = filtered.filter(req => req.status === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(req => 
                req.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [requests, filter, searchTerm]);

    if (error) {
        toast.error('Failed to fetch requests.');
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="content-area">
                    {[...Array(3)].map((_, i) => <RequestCardSkeleton key={i} />)}
                </div>
            );
        }

        if (filteredRequests.length === 0) {
            const emptyStateAction = isEmployee && filter === 'all' && !searchTerm ? (
                <Link to="/make-request">
                    <Button>Make Your First Request</Button>
                </Link>
            ) : undefined;

            return (
                <EmptyState 
                    icon={<FiInbox />}
                    title={searchTerm ? "No Requests Match Search" : "No Requests Found"}
                    message={`There are no requests in the "${filter}" category ${searchTerm ? `matching "${searchTerm}"` : ''}.`}
                    action={emptyStateAction}
                />
            );
        }

        return (
            <div className="content-area">
                {filteredRequests.map(req => (
                    <RequestCard 
                        key={req.id} 
                        request={req} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="page-header">
                <h1>{isEmployee ? 'My Requests' : 'All Employee Requests'}</h1>
            </div>

            <div className="page-controls">
                {!isEmployee && (
                    <Input 
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '350px' }}
                    />
                )}
            </div>

            {screenSize === 'small' ? (
                <FilterDropdown 
                    currentFilter={filter}
                    onFilterChange={(value) => handleFilterChange(value as StatusFilter)}
                    options={filterOptions}
                />
            ) : (
                <div className="filter-tabs">
                    <button onClick={() => handleFilterChange('all')} className={`filter-tab ${filter === 'all' ? 'active' : ''}`}>All</button>
                    <button onClick={() => handleFilterChange('pending')} className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}>Pending</button>
                    <button onClick={() => handleFilterChange('approved')} className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}>Approved</button>
                    <button onClick={() => handleFilterChange('rejected')} className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}>Rejected</button>
                </div>
            )}
            
            {renderContent()}

            {isModalOpen && modalPayload && (
                <EditDecisionModal 
                    payload={modalPayload}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveChanges}
                    isSaving={mutation.isPending}
                />
            )}
        </div>
    );
};

export default ViewRequests;
