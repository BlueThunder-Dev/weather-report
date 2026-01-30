import React, { useState } from 'react';
import styles from './SearchInput.module.css'; 

const SearchInput = ({label,placeholder,validators}) => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const validate = () => {
  for (const validator of validators) {
    if (!validator.execute(query)) {
      setError(validator.getMessage());
      return false; 
    }
  }
  return true; 
};

 const handleInputChange = (e) => {
    setError('');
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    //TODO HANDLE SEARCH
    //TODO WEATHER OUTPUT
  }

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
  return (<form className={styles.searchWrapper} onSubmit={handleSearch}>
        <div className={`${styles.inputCard} ${error ? styles.inputCardError : ''}`}>
          <div className={styles.labelRow}>
            <label for={label} className={styles.labelText}>{label}</label>
          </div>
          <input
            id={label}
            type="text"
            className={styles.customInput}
            value={query}
            onChange={(e) => {handleInputChange(e)}}
            placeholder={placeholder}
          />
        </div>

        <button type="submit" className={styles.searchBtn} aria-label="Search">
          <svg className={styles.searchIcon} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>)
}


  return (
    <div className={styles.container}>
      {renderForm()}
      {handleErrorRendering(error)}
    </div>
  );
};

export default SearchInput;