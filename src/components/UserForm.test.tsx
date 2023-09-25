import { describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserFormInput } from '../interfaces';
import UserForm from './UserForm';

describe('UserForm', () => {
  it('renders the form with input fields and submit button', () => {
    // ARRANGE
    const inputList: UserFormInput[] = [
      {
        label: 'Username',
        type: 'text',
        name: 'username',
        placeholder: 'Enter your username',
        value: '',
      },
      {
        label: 'Password',
        type: 'password',
        name: 'password',
        placeholder: 'Enter your password',
        value: '',
      },
    ];
    const handleFormSubmit = vi.fn();
    const onChangeHandler = vi.fn();
    const buttonLabel = 'Submit';

    // ACT
    render(
      <UserForm
        inputList={inputList}
        handleFormSubmit={handleFormSubmit}
        onChangeHandler={onChangeHandler}
        buttonLabel={buttonLabel}
        isLoading={false}
      />
    );

    // EXPECT
    inputList.forEach((input) => {
      expect(screen.getByLabelText(input.label)).toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: buttonLabel })
    ).toBeInTheDocument();
  });

  it('calls handleFormSubmit when the form is submitted', () => {
    // ARRANGE
    const inputList: UserFormInput[] = [
      {
        label: 'Username',
        type: 'text',
        name: 'username',
        placeholder: 'Enter your username',
        value: '',
      },
    ];
    const handleFormSubmit = vi.fn();
    const onChangeHandler = vi.fn();
    const buttonLabel = 'Submit';
    render(
      <UserForm
        inputList={inputList}
        handleFormSubmit={handleFormSubmit}
        onChangeHandler={onChangeHandler}
        buttonLabel={buttonLabel}
        isLoading={false}
      />
    );

    // ACT
    fireEvent.click(screen.getByRole('button', { name: buttonLabel }));

    // EXPECT
    expect(handleFormSubmit).toHaveBeenCalled();
  });

  it('displays the correct placeholder text', () => {
    // ARRANGE
    const inputList: UserFormInput[] = [
      {
        label: 'Username',
        type: 'text',
        name: 'username',
        placeholder: 'Enter your username',
        value: '',
      },
    ];
    const handleFormSubmit = vi.fn();
    const onChangeHandler = vi.fn();
    const buttonLabel = 'Submit';
    render(
      <UserForm
        inputList={inputList}
        handleFormSubmit={handleFormSubmit}
        onChangeHandler={onChangeHandler}
        buttonLabel={buttonLabel}
        isLoading={false}
      />
    );

    // ACT

    // EXPECT
    const inputElement = screen.getByLabelText(
      inputList[0].label
    ) as HTMLInputElement;
    expect(inputElement.placeholder).toBe(inputList[0].placeholder);
  });
});
