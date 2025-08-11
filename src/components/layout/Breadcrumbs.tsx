
import { useLocation, Link } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const formatCrumb = (str: string) => {
        // Replace dashes with spaces and capitalize words
        return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <nav className="breadcrumbs" aria-label="breadcrumb">
            <Link to="/dashboard" className="breadcrumb-item home">
                <FiHome />
            </Link>
            {pathnames.map((name, index) => {
                // Skip the dashboard link in the loop as it's already handled
                if (name.toLowerCase() === 'dashboard') return null;

                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

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
