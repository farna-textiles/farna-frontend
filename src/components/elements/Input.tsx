/* eslint-disable import/no-extraneous-dependencies */
import { twMerge } from 'tailwind-merge';
import _ from 'lodash';
import { InputProps } from '../../interfaces';

const Input = ({ type, className = '', name, ...rest }: InputProps) => {
  return (
    <label htmlFor={`${name}Input`} className="font-medium">
      {_.capitalize(name)}
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        type={type}
        name={name}
        id={`${name}Input`}
        className={twMerge(
          'w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg',
          className
        )}
      />
    </label>
  );
};

export default Input;
