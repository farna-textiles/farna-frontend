import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('renders input field with correct label and type', () => {
    render(<Input type="text" name="username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toHaveAttribute('type', 'text');
  });

  it('applies custom className to input element', () => {
    const customClassName = 'custom-class';
    render(<Input type="text" name="username" className={customClassName} />);

    expect(screen.getByLabelText('Username')).toHaveClass(customClassName);
  });

  it('applies additional props to input element', () => {
    const dataTestId = 'username-input';
    const placeholder = 'Enter your username';
    render(
      <Input
        type="text"
        name="username"
        data-testid={dataTestId}
        placeholder={placeholder}
      />
    );

    const inputElement = screen.getByLabelText('Username');
    expect(inputElement).toHaveAttribute('data-testid', dataTestId);
    expect(inputElement).toHaveAttribute('placeholder', placeholder);
  });

  it('capitalizes the label text', () => {
    const name = 'email';
    render(<Input type="text" name={name} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('merges Tailwind CSS classes with custom className', () => {
    const customClassName = 'custom-class';
    render(<Input type="text" name="password" className={customClassName} />);

    const expectedClasses = [
      'w-full',
      'mt-2',
      'px-3',
      'py-2',
      'text-gray-500',
      'bg-transparent',
      'outline-none',
      'border',
      'focus:border-indigo-600',
      'shadow-sm',
      'rounded-lg',
      customClassName,
    ];
    const inputElement = screen.getByLabelText('Password');
    expectedClasses.forEach((className) => {
      expect(inputElement).toHaveClass(className);
    });
  });
});
