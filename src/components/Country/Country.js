import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Country.module.scss';

//  PRESENTATIONAL COMPONENT USED FOR LISTING ALL COUNTRIES IN THE TABLE ON HOME PAGE

const Country = props => (
    <tr className={classes.container}>
        <th className={classes.container__header}>
            <Link className={classes.link} to={`/country/${props.name}`}>
                {props.name}
            </Link>
        </th>
        <th className={classes.container__text}>{props.populationToday}</th>
        <th className={classes.container__text}>{props.populationTomorrow}</th>
    </tr>
)

export default Country;