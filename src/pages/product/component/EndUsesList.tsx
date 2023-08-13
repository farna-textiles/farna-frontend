/* eslint-disable react/no-array-index-key */
import React from 'react';
import { EndUsesListProps } from '../../../interfaces';

const EndUsesList: React.FC<EndUsesListProps> = ({ endUses }) => {
  return (
    <div>
      {endUses.map((endUse, index) => (
        <span key={index} title={endUse.description || ''}>
          {endUse.name}
          {index !== endUses.length - 1 && ' | '}
        </span>
      ))}
    </div>
  );
};

export default EndUsesList;
