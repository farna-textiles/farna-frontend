import React from 'react';
import { Loader } from '@mantine/core';
import { FormProps } from '../../interfaces';
import Input from './Input';

const Form: React.FC<FormProps> = ({
  inputList,
  handleFormSubmit,
  onChangeHandler,
  buttonLabel,
  isLoading,
  error,
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
    {error}
    <button
      type="submit"
      className="relative w-full px-4 py-2 h-10 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader color="white" />
        </div>
      ) : (
        buttonLabel
      )}
    </button>
  </form>
);

export default Form;
