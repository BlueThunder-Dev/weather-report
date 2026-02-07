import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('should render with default accessibility roles', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');

    expect(spinner).toBeInTheDocument();
  });

  it('should have aria-live="polite" to notify screen readers without interrupting', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');

    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('should apply the provided color to the borderTopColor', () => {
    const customColor = 'rgb(255, 0, 0)';
    render(<LoadingSpinner color={customColor} />);
    const spinner = screen.getByRole('status');

    expect(spinner.style.borderTopColor).toBe(customColor);
  });

  it('should contain an sr-only span for accessibility', () => {
    render(<LoadingSpinner />);
    const srOnlyText = screen.getByText(/loading\.\.\./i);
    
    expect(srOnlyText).toHaveClass(/srOnly/);
  });
});