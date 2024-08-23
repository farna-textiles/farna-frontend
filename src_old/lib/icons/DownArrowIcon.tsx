import React from 'react';

const DownArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 17H3m0 0V9m0 0l8 8 4-4 6 6"
    />
  </svg>
);

DownArrowIcon.defaultProps = {
  className: '',
};

export default DownArrowIcon;
