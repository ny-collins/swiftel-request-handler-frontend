const UserItemSkeleton = () => {
  return (
    <div className="card user-item-skeleton">
      <div className="skeleton-info">
        <div className="skeleton skeleton-text skeleton-title" style={{ width: '50%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '70%', height: '0.75rem' }}></div>
      </div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
};

export default UserItemSkeleton;