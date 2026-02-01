import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './WeatherCard.module.css';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const WeatherCard = ({ data, history = [], onReSearch, onDeleteHistory, isLoading, error }) => {
  const { main, weather, name, sys, dt } = data || {};
  const dateStr = useMemo(() => {
    if (!dt) return "--/--/---- --:--";
    try {
      return new Date(dt * 1000).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).replace(/\//g, '-').replace(',', '');
    } catch {
      return "--/--/---- --:--";
    }
  }, [dt]);

  const renderMainStats = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer} role="status">
          <LoadingSpinner size="100px" />
          <p>Fetching weather data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer} role="alert">
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorText}>{error}</p>
        </div>
      );
    }

    return (
      <div className={styles.mainStats}>
        <p className={styles.todayLabel}>Today's Weather</p>
        <h1 className={styles.temp}>{main?.temp ? `${Math.round(main.temp)}°` : "--°"}</h1>
        <p className={styles.highLow}>
          H: {main?.temp_max ? `${Math.round(main.temp_max)}°` : "--°"} 
          L: {main?.temp_min ? `${Math.round(main.temp_min)}°` : "--°"}
        </p>
        
        <footer className={styles.locationRow}>
          <span className={styles.cityLabel}>{name ? `${name}, ${sys?.country}` : "Search for a city"}</span>
          <div className={styles.extraInfoContainer}>
            <time className={styles.extraInfo} dateTime={dt ? new Date(dt * 1000).toISOString() : undefined}>
              {dateStr}
            </time>
            <span className={styles.extraInfo}>Humidity: {main?.humidity ?? "--"}%</span>
            <span className={styles.extraInfo}>{weather?.[0]?.main ?? "---"}</span>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <article className={styles.dashboard}>
      <header className={styles.floatingIcon} aria-hidden="true">
        {!error && !isLoading && weather?.[0] && (
          <img src={`http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`} alt="" />
        )}
      </header>

      <section className={styles.topContent}>
        {renderMainStats()}
      </section>

     
        <nav className={styles.historyContainer} aria-label="Search history">
          <p className={styles.searcHistory}>Search History</p>
           {history.length > 0 ?
            (<ul className={styles.historyList} style={{ listStyle: 'none', padding: 0 }}>
              {history.map((item) => (
                <li key={item.id} className={styles.historyRow}>
                  <div className={styles.historyInfo}>
                    <span className={styles.historyLoc}>{item.name}, {item.country}</span>
                    <span className={styles.historyDate}>{item.date}</span>
                  </div>
                  
                  <div className={styles.historyActions}>
                    <button 
                      className={styles.circleBtn} 
                      onClick={() => onReSearch(item)} 
                      aria-label={`Search again for ${item.name}`}
                    >
                      🔍
                    </button>
                    <button 
                      className={styles.circleBtn} 
                      onClick={() => onDeleteHistory(item.id)} 
                      aria-label={`Delete ${item.name} from history`}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>)
           : (<div className={styles.emptyHistory}>
                <p className={styles.emptyText}>No search history yet</p>
            </div>)}
        </nav> 
     
    </article>
  );
};

WeatherCard.propTypes = {
  data: PropTypes.object,
  history: PropTypes.array,
  onReSearch: PropTypes.func.isRequired,
  onDeleteHistory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default WeatherCard;