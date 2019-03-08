import React from 'react';
import classes from './Spinner.module.scss';

const Spinner = () => (
    <div className={classes.box}>
        <div className={classes.loader}></div>
    </div>
)

export default Spinner;