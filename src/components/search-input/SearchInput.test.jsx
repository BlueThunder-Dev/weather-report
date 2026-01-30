import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from './SearchInput';

describe('SearchInput Component', () => {
  const failingValidator = {
    execute: vi.fn(() => false),
    getMessage: vi.fn(() => 'Error Message')
  };


  it('renders correctly with label and placeholder', () => {
    render(<SearchInput label="City" placeholder="Enter city" validators={[]} />);
    
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter city')).toBeInTheDocument();
  });

  it('shows error message when validation fails on submit', () => {
    render(<SearchInput label="City" validators={[failingValidator]} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    expect(screen.getByText('Error Message')).toBeInTheDocument();
  });

  it('clears error when typing in the input', () => {
    render(<SearchInput label="City" validators={[failingValidator]} />);
    
    const input = screen.getByLabelText('City');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.click(button);
    expect(screen.getByText('Error Message')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Rome' } });

    expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
  });
});