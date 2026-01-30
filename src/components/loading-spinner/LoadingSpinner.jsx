import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = '20px', color = '#a855f7' }) => {
  return (
        <div style={{
          position: 'absolute',
          right: '55px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}>
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
        </div>
      )
};

export default LoadingSpinner;