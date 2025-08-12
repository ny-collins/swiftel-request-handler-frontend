import '../../styles/Skeleton.css';

const RequestCardSkeleton = () => {
  return (
    <div className="card request-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton skeleton-text skeleton-title" style={{ width: '70%' }}></div>
        <div className="skeleton skeleton-badge" style={{ width: '80px' }}></div>
      </div>
      <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
    </div>
  );
};

export default RequestCardSkeleton;