import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { useAuth } from '../../../hooks/useAuth';
import { Request } from '../../../types';
import { Link } from 'react-router-dom';
import RequestCard from '../components/RequestCard';

interface Filters {
    status: string;
    type: string;
}

interface Sort {
    sortBy: string;
    sortOrder: string;
}

const getRequests = async (role: string, filters: Filters, sort: Sort) => {
    const url = role === 'employee' ? '/requests/my-requests' : '/requests';
    
    const params = new URLSearchParams();
    if (role !== 'employee') {
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (sort.sortBy) params.append('sortBy', sort.sortBy);
        if (sort.sortOrder) params.append('sortOrder', sort.sortOrder);
    }

    const { data } = await api.get<Request[]>(url, { params });
    return data;
};

const ViewRequests = () => {
    const { user } = useAuth();
    const role = user?.role || 'employee';

    const [filters, setFilters] = useState<Filters>({ status: '', type: '' });
    const [sort, setSort] = useState<Sort>({ sortBy: 'created_at', sortOrder: 'DESC' });

    const { data: requests, isLoading, error } = useQuery({
        queryKey: ['requests', role, filters, sort],
        queryFn: () => getRequests(role, filters, sort),
        enabled: !!role,
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sortBy, sortOrder] = e.target.value.split(',');
        setSort({ sortBy, sortOrder });
    };

    const showFilters = role === 'admin' || role === 'board_member';

    return (
        <>
            <div className="page-header">
                <h1>{role === 'employee' ? 'My Requests' : 'All Requests'}</h1>
                <p>View and manage requests below.</p>
            </div>

            {showFilters && (
                <div className="card filter-bar">
                    <div className="filter-group">
                        <label htmlFor="status-filter">Status</label>
                        <select id="status-filter" name="status" className="select-field" onChange={handleFilterChange} value={filters.status}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="type-filter">Type</label>
                        <select id="type-filter" name="type" className="select-field" onChange={handleFilterChange} value={filters.type}>
                            <option value="">All</option>
                            <option value="monetary">Monetary</option>
                            <option value="non-monetary">Non-Monetary</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="sort-filter">Sort By</label>
                        <select id="sort-filter" className="select-field" onChange={handleSortChange} value={`${sort.sortBy},${sort.sortOrder}`}>
                            <option value="created_at,DESC">Newest First</option>
                            <option value="created_at,ASC">Oldest First</option>
                            <option value="title,ASC">Title (A-Z)</option>
                            <option value="title,DESC">Title (Z-A)</option>
                            <option value="status,ASC">Status</option>
                        </select>
                    </div>
                </div>
            )}

            {isLoading && <p>Loading requests...</p>}
            {error && <p className="error-text">Failed to load requests.</p>}

            {requests && requests.length === 0 && (
                <div className="card text-center" style={{ marginTop: '1.5rem' }}>
                    <p>No requests found.</p>
                    {role === 'employee' && (
                        <Link to="/make-request" className="btn btn-primary">Make Your First Request</Link>
                    )}
                </div>
            )}

            {requests && requests.length > 0 && (
                <div className="requests-grid" style={{ marginTop: '1.5rem' }}>
                    {requests.map((request: Request) => (
                        <RequestCard key={request.id} request={request} role={role} />
                    ))}
                </div>
            )}
        </>
    );
};

export default ViewRequests;
