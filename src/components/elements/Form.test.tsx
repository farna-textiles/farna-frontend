import { describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserFormInput } from '../../interfaces';
import Form from './Form';

describe('Form', () => {
  it('renders the form with input fields and submit button', () => {
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

    render(
      <Form
        inputList={inputList}
        handleFormSubmit={handleFormSubmit}
        onChangeHandler={onChangeHandler}
        buttonLabel={buttonLabel}
      />
    );

    inputList.forEach((input) => {
      expect(screen.getByLabelText(input.label)).toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: buttonLabel })
    ).toBeInTheDocument();
  });

  it('calls handleFormSubmit when the form is submitted', () => {
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
      <Form
        inputList={inputList}
        handleFormSubmit={handleFormSubmit}
        onChangeHandler={onChangeHandler}
        buttonLabel={buttonLabel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: buttonLabel }));

    expect(handleFormSubmit).toHaveBeenCalled();
  });

  it('displays the correct placeholder text', () => {
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
      <Form
        inputList={inputList}
        handleFormSubmit={handleFormSubmit}
        onChangeHandler={onChangeHandler}
        buttonLabel={buttonLabel}
      />
    );

    const inputElement = screen.getByLabelText(
      inputList[0].label
    ) as HTMLInputElement;
    expect(inputElement.placeholder).toBe(inputList[0].placeholder);
  });
});
