import React from 'react';
import styles from './SuggestionCombobox.module.css';

const SuggestionCombobox = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <ul className={styles.SuggestionCombobox}>
      {suggestions.map((loc, i) => (
        <li 
          key={`${loc.lat}-${loc.lon}-${i}`} 
          className={styles.suggestionItem}
          onClick={() => onSelect(loc)}
        >
          <span className={styles.locationName}>{loc.displayLabel}</span>
        </li>
      ))}
    </ul>
  );
};

export default SuggestionCombobox;