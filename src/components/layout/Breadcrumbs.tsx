
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const formatCrumb = (str: string) => {
        return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (pathnames.length === 0) {
        return <nav className="breadcrumbs" aria-label="breadcrumb"><span>Dashboard</span></nav>;
    }

    return (
        <nav className="breadcrumbs" aria-label="breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                // Don't show breadcrumb for dashboard again
                if (name.toLowerCase() === 'dashboard') return null;

                return (
                    <span key={name} className="breadcrumb-item">
                        <FiChevronRight />
                        {isLast ? (
                            <span aria-current="page">{formatCrumb(name)}</span>
                        ) : (
                            <Link to={routeTo}>{formatCrumb(name)}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
