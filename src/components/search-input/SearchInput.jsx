import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchInput.module.css'; 
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import { normalizeLocation } from '../../utils/normalizer/normalizeLocation';
import SuggestionCombobox from '../suggestion-combobox/SuggestionCombobox';
import { apiKey } from '../../utils/constants';

const SearchInput = ({ label, placeholder, validators = [], onSearchSuccess, onSearchError, backupLocation, setIsSearchLoading }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState({});
  const [locationSelected, setLocationSelected] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const abortControllerRef = useRef(null);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setIsInputLoading(true);
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${apiKey}`,
        { signal: abortControllerRef.current.signal }
      );
      
      const data = await response.json();
      const normalized = normalizeLocation(data);
      setSuggestions(normalized);
      
      if(normalized.length === 0) {
        setError('No suggestions found');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to retrieve suggestions');
      }
    } finally {
      setIsInputLoading(false);
    }
  }, []);

    const setLocationValue = useCallback((loc) => {
    setQuery(loc.displayLabel);
    setLocation(loc);
    setLocationSelected(true);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setError('');
  }, []);

  useEffect(() => {
    if (query.length >= 2 && !locationSelected) {
      const timer = setTimeout(() => fetchSuggestions(query), 400);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query, locationSelected, fetchSuggestions]);

 useEffect(() => {
    if (backupLocation?.city) {
      setLocationValue(backupLocation);
    }
  }, [backupLocation, setLocationValue]);

  const handleSelect = useCallback((loc) => {
    setLocationValue(loc)
  }, []);

  const validate = () => {
    setError('')
    for (const validator of validators) {
      if (!validator.execute(query)) {
        setError(validator.getMessage());
        return false;
      }
    }
    if (!locationSelected) {
      setQuery('');
      setSuggestions([]);
      setError('Please select a valid location from the list');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    console.log("In inpu change")
    const value = e.target.value;
    setQuery(value);
    setLocationSelected(false);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          if (highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setSuggestions([]);
          setHighlightedIndex(-1);
          break;
        default:
          break;
      }
    }
    
    if (["Backspace", "Delete"].includes(e.key) && query.length <= 1) {
      setLocation({});
      setLocationSelected(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (onSearchError) onSearchError(null);
      if(setIsSearchLoading)setIsSearchLoading(true)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location.city},${location.country.toLowerCase()}&units=metric&APPID=${apiKey}`
      );
      const data = await response.json();
      
      if (data.cod !== 200) throw new Error(data.message);
      if (onSearchSuccess) onSearchSuccess(data);
    } catch (err) {
      if (onSearchError) onSearchError('Unable to retrieve weather data. Please try again.');
    }finally {
      setIsSearchLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.searchWrapper} onSubmit={handleSearch} noValidate>
        <div className={`${styles.inputCard} ${error ? styles.inputCardError : ''}`}>
          <div className={styles.labelRow}>
            <label htmlFor="weather-search" className={styles.labelText}>{label}</label>
          </div>
            <input
              id="weather-search"
              type="text"
              className={styles.customInput}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoComplete="off"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
            />
            {isInputLoading && (
              <div className={styles.spinnerWrapper}>
                <LoadingSpinner size="24px" />
              </div>
            )}
          

          {suggestions.length > 0 && (
            <SuggestionCombobox 
              suggestions={suggestions} 
              onSelect={handleSelect}
              highlightedIndex={highlightedIndex}
              setHighlightedIndex={setHighlightedIndex}
            />
          )}
        </div>

        <button type="submit" className={styles.searchBtn} aria-label="Perform search">
         🔍
        </button>
      </form>
      
      {error && (
        <div className={styles.errorMsg} role="alert">
          <span className={styles.warningIcon}>⚠️</span>
          {error}
        </div>
      )}
    </section>
  );
};

SearchInput.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  validators: PropTypes.array,
  onSearchSuccess: PropTypes.func,
  onSearchError: PropTypes.func,
  backupLocation: PropTypes.object
};

export default SearchInput;