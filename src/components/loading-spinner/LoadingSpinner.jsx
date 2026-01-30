import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size, color = '#a855f7' }) => {
  return (
        
           <div 
            className={styles.spinner} 
            style={{ 
                width: size, 
                height: size, 
                borderTopColor: color 
            }}
            role="status"
            >
            <span className={styles.srOnly}>Loading...</span>
            </div>
      )
};

export default LoadingSpinner;