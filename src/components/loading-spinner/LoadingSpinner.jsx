import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = '40px', color }) => {
  const thickness = `calc(${size} / 10)`;

  return (
    <div 
      className={styles.spinner} 
      style={{ 
        width: size, 
        height: size, 
        borderWidth: thickness,
        borderTopColor: color || 'currentColor' 
      }}
      role="status"
      aria-live="polite"
    >
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string
};

export default LoadingSpinner;