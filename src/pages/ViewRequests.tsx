import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api';
import toast from 'react-hot-toast';
import RequestCard from '../components/RequestCard';
import FilterDropdown from '../components/ui/FilterDropdown';
import EmptyState from '../components/ui/EmptyState';
import RequestCardSkeleton from '../components/ui/RequestCardSkeleton';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FiInbox } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Request as RequestType } from '../types';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const fetchRequests = async (isEmployee: boolean) => {
    const url = isEmployee ? '/requests/my-requests' : '/requests';
    const { data } = await api.get<RequestType[]>(url);
    return data;
};

const ViewRequests = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const isEmployee = user?.role === 'employee';

    const [searchTerm, setSearchTerm] = useState('');

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

    const { data: requests = [], isLoading, error } = useQuery<RequestType[], Error>({
        queryKey: ['requests', isEmployee],
        queryFn: () => fetchRequests(isEmployee),
    });

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
                <Input 
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="filter-controls">
                <div className="filter-tabs">
                    <button onClick={() => handleFilterChange('all')} className={`filter-tab ${filter === 'all' ? 'active' : ''}`}>All</button>
                    <button onClick={() => handleFilterChange('pending')} className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}>Pending</button>
                    <button onClick={() => handleFilterChange('approved')} className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}>Approved</button>
                    <button onClick={() => handleFilterChange('rejected')} className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}>Rejected</button>
                </div>
                <FilterDropdown 
                    currentFilter={filter}
                    onFilterChange={(value) => handleFilterChange(value as StatusFilter)}
                    options={filterOptions}
                />
            </div>
            
            {renderContent()}

        </div>
    );
};

export default ViewRequests;
