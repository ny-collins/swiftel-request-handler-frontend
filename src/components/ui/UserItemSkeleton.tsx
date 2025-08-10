
const UserItemSkeleton = () => {
  return (
    <div className="user-item-skeleton">
      <div>
        <div className="skeleton skeleton-text skeleton-title"></div>
        <div className="skeleton skeleton-text skeleton-text-short mt-2"></div>
      </div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
};

export default UserItemSkeleton;
