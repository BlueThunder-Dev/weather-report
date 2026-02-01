import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import LightDarkSwitch from './LightDarkSwitch';

describe('LightDarkSwitch Component', () => {

  afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should initialize with dark theme by default', () => {
    render(<LightDarkSwitch />);
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button.className).toContain('dark');
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('should toggle theme to light on click and update document attribute', () => {
    render(<LightDarkSwitch />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(button);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(button.className).toContain('light');
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('should toggle back to dark on second click', () => {
    render(<LightDarkSwitch />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('should maintain accessibility requirements', () => {
    render(<LightDarkSwitch />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    
    const icon = screen.getByText('🌙');
    expect(button).toContainElement(icon);
  });

  it('should sync the data-theme attribute every time the state changes', () => {
    render(<LightDarkSwitch />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});