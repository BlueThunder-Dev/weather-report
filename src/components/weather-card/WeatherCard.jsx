import React from 'react';
import styles from './WeatherCard.module.css';

const WeatherCard = ({ data, history = [],onReSearch, onDeleteHistory,theme }) => {
  if (!data) return null;

  const { main, weather, name, sys, dt } = data;
  
  const dateStr = new Date(dt * 1000).toLocaleString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  }).replace(/\//g, '-').replace(',', '');

  return (
    <div className={styles.dashboard}>
      <div className={styles.floatingIcon}>
        <img 
          src={`http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`} 
          alt="weather" 
        />
      </div>
      <div className={styles.topContent}>
        <div className={styles.mainStats}>
          <p className={styles.todayLabel}>Today's Weather</p>
          <h1 className={styles.temp}>{Math.round(main.temp)}°</h1>
          <p className={styles.highLow}>H: {Math.round(main.temp_max)}° L: {Math.round(main.temp_min)}°</p>
          
          <div className={styles.locationRow}>
            <span className={styles.cityLabel}>{name}, {sys.country}</span>
            <span className={styles.extraInfo}>{dateStr}</span>
            <span className={styles.extraInfo}>Humidity: {main.humidity}%</span>
            <span className={styles.extraInfo}>{weather[0].main}</span>
          </div>
        </div>
      </div>

        {Array.isArray(history) && history.length > 0 ? (
          <div className={styles.historyContainer}>
            <p className={styles.searcHistory}>Search History</p>
            {history.map((item) => (
            <div key={item.id} className={styles.historyRow}>
              <span className={styles.historyLoc}>{item.name}, {item.country}</span>
              <div className={styles.historyRight}>
                <span className={styles.historyDate}>{item.date}</span>
                <div className={styles.historyActions}>
                  <button className={styles.circleBtn} onClick={() => onReSearch(item)}>🔍</button>
                  <button className={styles.circleBtn} onClick={() => onDeleteHistory(item.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
          </div> 
        ) : (
          <p className={styles.emptyHistory}>No history available</p>
        )}
    </div>
  );
};

export default WeatherCard;