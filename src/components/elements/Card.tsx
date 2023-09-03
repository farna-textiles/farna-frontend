import { FC, ReactElement } from 'react';

interface CardProps {
  title: string;
  value: string;
  percentage: string;
  icon: ReactElement;
}

const Card: FC<CardProps> = ({ title, value, percentage, icon }) => {
  let formattedPercentage = `${percentage}%`;
  let percentageBgClass = 'bg-green-100';
  let percentageTextColor = 'text-green-600';

  const numericPercentage = parseFloat(percentage);
  if (numericPercentage > 0) {
    formattedPercentage = `+${formattedPercentage}`;
    percentageBgClass = 'bg-green-100';
    percentageTextColor = 'text-green-600';
  } else if (numericPercentage < 0) {
    percentageBgClass = 'bg-red-100';
    percentageTextColor = 'text-red-600';
  } else {
    percentageBgClass = 'bg-gray-200';
    percentageTextColor = 'text-gray-600';
  }

  return (
    <div className="card flex items-center justify-between p-4 bg-white rounded-md shadow-md dark:bg-darker">
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
