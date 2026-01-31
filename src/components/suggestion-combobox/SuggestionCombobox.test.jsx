import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SuggestionCombobox from './SuggestionCombobox';

const mockSuggestions = [
  { lat: 41.9028, lon: 12.4964, displayLabel: 'Rome, Italy' },
  { lat: 45.4642, lon: 9.1900, displayLabel: 'Milan, Italy' },
  { lat: 40.8518, lon: 14.2681, displayLabel: 'Naples, Italy' }
];

describe('SuggestionCombobox Component', () => {
  afterEach(cleanup);
  const defaultProps = {
    suggestions: mockSuggestions,
    onSelect: vi.fn(),
    highlightedIndex: -1,
    setHighlightedIndex: vi.fn(),
  };

  it('should return null when suggestions array is empty', () => {
    const { container } = render(<SuggestionCombobox {...defaultProps} suggestions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the list with correct ARIA roles for accessibility', () => {
    render(<SuggestionCombobox {...defaultProps} />);
    
    const listbox = screen.getByRole('listbox', { name: /city suggestions/i });
    const options = screen.getAllByRole('option');

    expect(listbox).toBeInTheDocument();
    expect(options).toHaveLength(mockSuggestions.length);
  });

  it('should display the correct labels for each suggestion', () => {
    render(<SuggestionCombobox {...defaultProps} />);
    
    mockSuggestions.forEach((suggestion) => {
      expect(screen.getByText(suggestion.displayLabel)).toBeInTheDocument();
    });
  });

  it('should apply the active class and aria-selected attribute to the highlighted item', () => {
    const activeIndex = 1;
    render(<SuggestionCombobox {...defaultProps} highlightedIndex={activeIndex} />);
    
    const options = screen.getAllByRole('option');
    
    expect(options[activeIndex]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[activeIndex].className).toMatch(/active/);
  });

  it('should trigger onSelect with correct data when an item is clicked', () => {
    render(<SuggestionCombobox {...defaultProps} />);
    
    const secondOption = screen.getAllByRole('option')[1];
    fireEvent.click(secondOption);

    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockSuggestions[1]);
  });

  it('should trigger setHighlightedIndex when the mouse enters an item', () => {
    render(<SuggestionCombobox {...defaultProps} />);
    
    const thirdOption = screen.getAllByRole('option')[2];
    fireEvent.mouseEnter(thirdOption);

    expect(defaultProps.setHighlightedIndex).toHaveBeenCalledWith(2);
  });

  it('should prevent default on mousedown to maintain input focus', () => {
    render(<SuggestionCombobox {...defaultProps} />);
    
    const listbox = screen.getByRole('listbox');
    const mouseDownEvent = fireEvent.mouseDown(listbox);
    
    expect(mouseDownEvent).toBe(false);
  });

    it('should ensure icons are hidden from screen readers', () => {
        render(<SuggestionCombobox {...defaultProps} />);
        
        const icons = screen.getAllByText('📍');
        
        icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        });
    });
});