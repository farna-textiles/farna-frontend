import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('Renders Dashboard Page', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
