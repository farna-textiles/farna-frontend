/* eslint-disable react/no-array-index-key */
import React from 'react';
import { EndUsesListProps } from '../../../interfaces';

const EndUsesList: React.FC<EndUsesListProps> = ({ endUses }) => {
  return (
    <div className="flex flex-wrap justify-start cursor-default">
      {endUses.map((endUse, index) => (
        <div
          key={index}
          title={endUse.description}
          className={`flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-${endUse.color}-700 bg-${endUse.color}-100 border border-${endUse.color}-700`}
        >
          <div className="text-xs font-normal leading-none max-w-full flex-initial">
            {endUse.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EndUsesList;
