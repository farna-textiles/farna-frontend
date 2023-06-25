import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SignUp from './SignUp';

describe('SignUp', () => {
  it('Renders Sign Up Page', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });
  it('Renders SignInp Link', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText('SignIn')).toBeInTheDocument();
  });
});
