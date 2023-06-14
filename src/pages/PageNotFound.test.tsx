import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageNotFound from './PageNotFound';

describe('PageNotFound', () => {
  it('Renders 404 Page Not Found', () => {
    render(<PageNotFound />);
    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
  });
});
