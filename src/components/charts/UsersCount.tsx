import React from 'react';

type UsersCountProps = {
  count: number;
};

const UsersCount: React.FC<UsersCountProps> = ({ count }) => {
  return (
    <div>
      <span className="text-2xl font-medium text-gray-500 dark:text-light">
        {count}
      </span>
      <span className="text-sm font-medium text-gray-500 dark:text-primary">
        Users
      </span>
    </div>
  );
};

export default UsersCount;
