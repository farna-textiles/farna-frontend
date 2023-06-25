import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from './SignIn';

describe('SignIn', () => {
  it('Renders Sign In Page', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  it('Renders Sign Up Link', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByText('SignUp')).toBeInTheDocument();
  });
});
