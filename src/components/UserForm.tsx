import React from 'react';
import { FormProps } from '../interfaces';
import Input from './elements/Input';

const UserForm: React.FC<FormProps> = ({
  inputList,
  handleFormSubmit,
  onChangeHandler,
  buttonLabel,
}) => (
  <form onSubmit={handleFormSubmit} className="space-y-5">
    {inputList.map((input) => (
      <div key={input.name}>
        <Input
          type={input.type}
          name={input.name}
          placeholder={input.placeholder}
          value={input.value}
          onChange={onChangeHandler}
        />
      </div>
    ))}
    <button
      type="submit"
      className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
    >
      {buttonLabel}
    </button>
  </form>
);

export default UserForm;
