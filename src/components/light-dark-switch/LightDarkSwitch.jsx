import React from 'react';
import styles from './LightDarkSwitch.module.css';

const LightDarkSwitch = ({theme, onToggle}) => {
  return (
    <div className={styles.switchContainer}>
      <button 
        className={`${styles.switchBase} ${theme === 'dark' ? styles.dark : styles.light}`}
        onClick={onToggle}
        aria-label="Toggle theme"
      >
        <div className={styles.circle}>
          {theme === 'dark' ? (
            <span className={styles.icon}>🌙</span>
          ) : (
            <span className={styles.icon}>☀️</span>
          )}
        </div>
      </button>
    </div>
  );
};

export default LightDarkSwitch;