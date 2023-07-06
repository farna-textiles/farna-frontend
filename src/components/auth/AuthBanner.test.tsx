import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthBanner from './AuthBanner';

describe('AuthBanner', () => {
  it('renders the AuthBanner component', () => {
    render(<AuthBanner animate />);

    expect(screen.getByAltText('farna logo')).toBeInTheDocument();
    expect(screen.getByText('WE ARE FARNA TEXTILES')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Farna is not a name, it’s a vision, encapsulating excellence and brilliance in the Textiles Industry of Pakistan.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Dealing with high-end tech fibers since 2006')
    ).toBeInTheDocument();
  });
});
