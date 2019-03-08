import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Nav.module.scss';

const Nav = () => (
    <nav className={classes.nav}>
        <div className={classes.nav__logo}>
            <h3>Logo</h3>
        </div>
        <div className={classes.nav__box}>
            <h3>My World Population Page</h3>
        </div>
        <div className={classes.nav__box}>
            <Link className={classes.nav__box__link} to='/'>Report Page</Link>
            <Link className={classes.nav__box__link} to='/dashboard'>Dashboard Page</Link>
        </div>
    </nav>
)

export default Nav;