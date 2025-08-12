

const StatItemSkeleton = () => {
  return (
    <div className="stat-item-skeleton">
      <div className="skeleton-icon"></div>
      <div className="skeleton-info">
        <div className="skeleton skeleton-text skeleton-title"></div>
        <div className="skeleton skeleton-text skeleton-value"></div>
      </div>
    </div>
  );
};

export default StatItemSkeleton;