import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';

describe('Profile', () => {
  it('Renders Profile Page', () => {
    render(<Profile />);
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
