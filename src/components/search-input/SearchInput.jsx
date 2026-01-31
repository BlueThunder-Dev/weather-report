import React, { useCallback, useEffect, useState } from 'react';
import styles from './SearchInput.module.css'; 
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
import { normalizeLocation } from '../../utils/normalizer/normalizeLocation';
import SuggestionCombobox from '../suggestion-combobox/SuggestionCombobox';
import { apiKey } from '../../utils/constants';


const SearchInput = ({label,placeholder,validators,onSearchSuccess ,onSearchError,theme ,backupLocation}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState({})
  const [locationSelected, setLocationSelected] = useState(false)

  const handleSuggestionsRetrieval = useCallback(async (query) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
  ); 
  const data = await response.json();    
  setSuggestions(normalizeLocation(data));
  }, []); 

  useEffect(() => {
  if (backupLocation && backupLocation.city) {
    setLocationValue(backupLocation);
  }
}, [backupLocation]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2 && !locationSelected) {
        try {
          setIsInputLoading(true);
          await handleSuggestionsRetrieval(query);
        } catch (err) {
          setError(err);
        } finally {
          setIsInputLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 400); 

    return () => clearTimeout(timer);
  }, [query, locationSelected, handleSuggestionsRetrieval]);

  const resetLocationsSuggestions = ()=>{
    setError('')
    setSuggestions([]);
  }

  const setLocationValue = (loc) =>{
    setQuery(loc.displayLabel);
    setLocation(loc)
    setLocationSelected(true)
  }

  const handleSelect = (loc) => {
    setLocationValue(loc)
    resetLocationsSuggestions()
  };

  const validate = () => {

  for (const validator of validators) {
    if (!validator.execute(query)) {
      setError(validator.getMessage());
      return false; 
    }
  }
  if(!locationSelected){
    setError('Before searching, find a place from the list');
    setQuery('')
    return false; 
  }
  return true; 
};

 const handleInputChange = (e) => {
    setError('');
    setSuggestions([]);
    setQuery(e.target.value);
  };

  const handleKeyup = (e) =>{
    if(["backspace","delete"].includes(e.key.toLowerCase())){
      setQuery('')
    };
    setLocationSelected(false);
    setLocation({});
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSuggestions([]);

    if (!validate()) return;

    try {
   
      if (onSearchError) onSearchError(null);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location.city},${location.country.toLowerCase()}&units=metric&APPID=${apiKey}`
      );      
      const data = await response.json();
        if (data.cod !== 200) {
          throw new Error();
        }else{
          if (onSearchSuccess) onSearchSuccess(data);
        }
    } catch {
      if (onSearchError) onSearchError('Impossible to retrieve weather data');
    }
  };
  
 const handleErrorRendering = (errorText) => {
  if (!errorText) return null;

  return (
    <div className={styles.errorMsg}>
      <svg 
        className={styles.warningIcon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg> 
      {errorText}
    </div>
  );
};

const renderForm = () =>{
  return (<><form className={styles.searchWrapper} onSubmit={handleSearch}>
        <div className={`${styles.inputCard} ${error ? styles.inputCardError : ''}`}>
          <div className={styles.labelRow}>
            <label htmlFor={label} className={styles.labelText}>{label}</label>
          </div>
          <input
            id={label}
            type="text"
            className={styles.customInput}
            value={query}
            onChange={handleInputChange}
            onKeyUp={handleKeyup}
            placeholder={placeholder}
            autoComplete="off"
          />
          {isInputLoading && (
            <div style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center'
                    }}><LoadingSpinner size="35px" /></div>
          )}
          {suggestions.length > 0 && <SuggestionCombobox 
            suggestions={suggestions} 
            onSelect={handleSelect} 
            theme={theme}
          />}
        </div>

        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
       </>
      )
}


  return (
    <div className={styles.container}>
      {renderForm()}
      {handleErrorRendering(error)}
    </div>
  );
};

export default SearchInput;
