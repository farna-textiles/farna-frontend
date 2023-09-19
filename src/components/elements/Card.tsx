/* eslint-disable no-nested-ternary */
import { FC, ReactElement } from 'react';

interface CardProps {
  title: string;
  value: string;
  percentage: string;
  icon: ReactElement;
}

const Card: FC<CardProps> = ({ title, value, percentage, icon }) => {
  const numericPercentage = parseFloat(percentage);
  const isPositive = numericPercentage > 0;
  const isNegative = numericPercentage < 0;

  const percentageBgClass = isPositive
    ? 'bg-green-100'
    : isNegative
    ? 'bg-red-100'
    : 'bg-gray-200';

  const percentageTextColor = isPositive
    ? 'text-green-600'
    : isNegative
    ? 'text-red-600'
    : 'text-gray-600';

  const formattedPercentage = isPositive ? `+${percentage}%` : `${percentage}%`;

  return (
    <div className="card flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-50 rounded-md shadow-md dark:bg-darker">
      <div className="card__info">
        <h6 className="card__title text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
          {title}
        </h6>
        <span className="card__value text-xl font-semibold">{value}</span>
        <span
          className={`card__percentage inline-block px-2 py-px ml-2 text-xs rounded-md ${percentageBgClass} ${percentageTextColor}`}
        >
          {formattedPercentage}
        </span>
      </div>
      <div className="card__icon">{icon}</div>
    </div>
  );
};

export default Card;
