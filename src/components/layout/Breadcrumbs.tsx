
import { useLocation, Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const formatCrumb = (str: string) => {
        return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <nav className="breadcrumbs" aria-label="breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return (
                    <span key={name}>
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
