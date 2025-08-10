
const RequestCardSkeleton = () => {
  return (
    <div className="request-card-skeleton">
      <div className="request-card-skeleton-header">
        <div className="skeleton skeleton-text skeleton-title"></div>
        <div className="skeleton skeleton-text skeleton-status"></div>
      </div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text skeleton-text-short"></div>
    </div>
  );
};

export default RequestCardSkeleton;
