import React from 'react';
import styles from './WeatherCard.module.css';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const WeatherCard = ({ data, history = [], onReSearch, onDeleteHistory, isLoading, error }) => {
  const { main, weather, name, sys, dt } = data || {};
  
  const dateStr = dt 
    ? new Date(dt * 1000).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).replace(/\//g, '-').replace(',', '')
    : "--/--/---- --:--";

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="100px" />
          <p>Fetching weather data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorTitle}>Something went wrong</p>
          <p className={styles.errorText}>{error}</p>
        </div>
      );
    }

    return (
      <div className={styles.mainStats}>
        <p className={styles.todayLabel}>Today's Weather</p>
        <h1 className={styles.temp}>{main ? `${Math.round(main.temp)}°` : "--°"}</h1>
        <p className={styles.highLow}>
          H: {main ? `${Math.round(main.temp_max)}°` : "--°"} 
          L: {main ? `${Math.round(main.temp_min)}°` : "--°"}
        </p>
        
        <div className={styles.locationRow}>
          <span className={styles.cityLabel}>{name ? `${name}, ${sys?.country}` : "Search for a city"}</span>
          <div className={styles.extraInfoContainer}>
              <span className={styles.extraInfo}>{dateStr}</span>
              <span className={styles.extraInfo}>Humidity: {main ? `${main.humidity}%` : "--%"}</span>
              <span className={styles.extraInfo}>{weather ? weather[0].main : "---"}</span>
          </div>
       
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.floatingIcon}>
       { !error && weather ? (
          <img src={`http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`} alt="weather" />
        ) : null}
      </div>

      <div className={styles.topContent}>
        {renderMainContent()}
      </div>

      {Array.isArray(history) && history.length > 0 && (
        <div className={styles.historyContainer}>
          <p className={styles.searcHistory}>Search History</p>
          {history.map((item) => (
            <div key={item.id} className={styles.historyRow}>
              <div className={styles.historyInfo}> {/* <-- Nuovo wrapper */}
                <span className={styles.historyLoc}>{item.name}, {item.country}</span>
                <span className={styles.historyDate}>{item.date}</span>
              </div>
              
              <div className={styles.historyActions}>
                <button className={styles.circleBtn} onClick={() => onReSearch(item)} title="Search again">🔍</button>
                <button className={styles.circleBtn} onClick={() => onDeleteHistory(item.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div> 
      )}
    </div>
  );
};

export default WeatherCard;