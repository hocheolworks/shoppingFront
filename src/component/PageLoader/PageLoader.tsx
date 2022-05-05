import React, { FC } from 'react';

import Spinner from '../Spinner/Spinner';
import styles from './PageLoader.module.css';

const PageLoader: FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <Spinner />
      </div>
    </div>
  );
};

export default PageLoader;
