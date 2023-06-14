import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignIn from './SignIn';

describe('SignIn', () => {
  it('Renders Sign In Page', () => {
    render(<SignIn />);
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });
});
