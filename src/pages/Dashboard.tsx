import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <div className="page-header">
                <h1>Welcome back, {user?.username}!</h1>
                <p>Here's a summary of your activity and system status.</p>
            </div>
            {/* The rest of the dashboard content will go here */}
        </div>
    );
};

export default Dashboard;