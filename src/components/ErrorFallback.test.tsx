import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorFallback from './ErrorFallback';

describe('App', () => {
  it('Renders hello world', () => {
    // ARRANGE
    render(<ErrorFallback />);
    // ACT
    // EXPECT
    expect(
      screen.getByRole('heading', {
        level: 1,
      })
    ).toHaveTextContent('Error! Please refresh or try again later.');
  });
});
