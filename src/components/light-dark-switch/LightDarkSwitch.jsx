import React, { useState, useEffect } from 'react';
import styles from './LightDarkSwitch.module.css';

const LightDarkSwitch = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [isDark]);

  return (
    <div className={styles.switchContainer}>
      <button 
        className={`${styles.switchBase} ${isDark ? styles.dark : styles.light}`}
        onClick={() => setIsDark(!isDark)}
        aria-label="Toggle theme"
      >
        <div className={styles.circle}>
          {isDark ? (
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