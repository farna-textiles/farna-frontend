import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from './SignUp';

describe('SignUp', () => {
  it('Renders Sign Up Page', () => {
    render(<SignUp />);
    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });
});
