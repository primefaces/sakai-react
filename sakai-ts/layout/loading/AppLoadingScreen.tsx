import React from 'react';
import styles from './AppLoadingScreen.module.scss';

const LoadingScreen = () => {
    return (
        <div className={styles['preloader-container']}>
        <div className={styles['preloader-content']}>
            <span></span>
        </div>
    </div>
    );
};

export default LoadingScreen;
