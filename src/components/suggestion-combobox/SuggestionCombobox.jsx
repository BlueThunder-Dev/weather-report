import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './SuggestionCombobox.module.css';

const SuggestionCombobox = ({ suggestions, onSelect, highlightedIndex, setHighlightedIndex }) => {
  const listRef = useRef(null);
  const handleMouseDown = (e) => e.preventDefault();

  if (suggestions.length === 0) return null;

  return (
    <ul 
      ref={listRef}
      className={styles.SuggestionCombobox}
      role="listbox"
      aria-label="City suggestions"
      onMouseDown={handleMouseDown}
    >
      {suggestions.map((loc, i) => (
        <li 
          key={`${loc.lat}-${loc.lon}-${i}`} 
          id={`suggestion-item-${i}`}
          className={`${styles.suggestionItem} ${highlightedIndex === i ? styles.active : ''}`}
          role="option"
          aria-selected={highlightedIndex === i}
          onClick={() => onSelect(loc)}
          onMouseEnter={() => setHighlightedIndex(i)}
        >
          <span className={styles.icon} aria-hidden="true">📍</span>
          <span className={styles.locationName}>{loc.displayLabel}</span>
        </li>
      ))}
    </ul>
  );
};

SuggestionCombobox.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
      displayLabel: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number,
  setHighlightedIndex: PropTypes.func.isRequired,
};

export default SuggestionCombobox;