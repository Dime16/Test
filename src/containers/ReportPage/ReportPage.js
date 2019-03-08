import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Spinner from '../../components/Spinner/Spinner';
import Country from '../../components/Country/Country';

import { setCountries, searchedCountries, resetSearch, setCountriesInit } from '../../store/actions';

import classes from './ReportPage.module.scss';

class ReportPage extends Component {
    // SERCH TERM AND COUNTRY ARE STORED IN STATE
    state = {
        searchTerm: '',
        searchedCountry: ''
    }

    componentDidMount() {
        // INIT THE SPINNER
        this.props.setCountriesInit()
        // START OF API CALL
        axios.get('http://api.population.io:80/1.0/countries')
            .then(res => {
                let promises = [];
                let countries = [];
                let obj = [];
                res.data.countries.map(country => {
                    if (country === "Australia/New Zealand") {
                        return 'undefined';
                    }

                    // PUSHING THE DATA FOR MAKING AN ARRAY TO CALL WITH AXIOS
                    countries.push(country)
                    return promises.push(axios.get(`http://api.population.io:80/1.0/population/${country}/today-and-tomorrow/`))
                })
                return axios.all(promises)
                    .then(res => {

                        // FILTERING THE DATA TO GET ONLY THE COUNTRIES
                        res.map((val, index) => {
                            return obj.push({
                                name: countries[index],
                                population: val.data.total_population
                            })
                        })
                        const filtered = obj.filter(val => {
                         if([
                        "Less developed regions",
                        "Less developed regions, excluding China",
                        "Eastern Asia",
                        "Eastern Africa",
                        "Eastern Europe",
                        "Central America",
                        ].includes(val.name)) {
                            return false;
                        } else if( val.name !== val.name.toUpperCase()){
                            return val;
                        }   
                     })
                            .sort((a, b) => {
                                if (a.population && b.population) {
                                    return b.population[0].population - a.population[0].population
                                }
                            })
                        return this.props.setCountries(filtered)
                    })
                    .catch(e => {
                        console.log(e)
                    })
            })
    }
    // THIS IS THE SEARCH HANDLER
    onChangeHandler = (e) => {
        if (e.target.value === '') {
            this.props.resetSearch()
        }
        this.setState({
            searchTerm: e.target.value
        })
    }

    // SUBMIT HANDLER SEARCHING THE DATA WE HAVE, NOT MAKING API CALLS
    onSubmit = (e) => {
        e.preventDefault()
        const seached = this.props.countries.filter(val => {
            return val.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
        })
        if (seached.length > 0) {
            this.props.searchedCountries(seached)
        }
    }
// SORTING HANDLERS
    sortAlphabeticallyHandler = () => {
        const alphabetically = this.props.countries.sort((a, b) => a.name.localeCompare(b.name))
        this.props.setCountries(alphabetically)
    }

    sortNumericalHandler = () => {
        this.props.countries.sort((a, b) => {
            if (a.population && b.population) {
                return b.population[0].population - a.population[0].population
            }
        })
    }

    render() {
        // SETING THE COUNTRIES DEPENDING ON SORTING FILTERS
        let ct = null
        if (this.props.countries && !this.props.searched) {
            ct = this.props.countries.map(val => {
                return (
                    <Country
                        key={val.name}
                        name={val.name}
                        populationToday={val.population ? val.population[0].population.toLocaleString() : "No data for this region."}
                        populationTomorrow={val.population ? val.population[1].population.toLocaleString() : "No data for this region."}
                    />
                )
            })
        } else if (this.props.searched) {
            ct = this.props.searched.map(val => {
                return (
                    <Country
                        key={val.name}
                        name={val.name}
                        populationToday={val.population ? val.population[0].population.toLocaleString() : "No data for this region."}
                        populationTomorrow={val.population ? val.population[1].population.toLocaleString() : "No data for this region."}
                    />
                )
            })
        }
// SETTING THE SPINNER
        let content = <Spinner />
        if(!this.props.loading) {
            content = (
                <div className={classes.container}>
                <form className={classes.container__form} onSubmit={this.onSubmit}>
                    <input
                        className={classes.container__form__input}
                        onChange={this.onChangeHandler}
                        type='text'
                        placeholder='search for a country'
                    />
                    <button className={classes.container__form__btn} type="submit">Search</button>
                    <button className={classes.container__form__btn} onClick={this.sortAlphabeticallyHandler}>Sort Alphabetically</button>
                    <button className={classes.container__form__btn} onClick={this.sortNumericalHandler}>Sort by Population</button>
                </form>
                <div>
                    <table style={{ width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th className={classes.container__header}>
                                    Countries
                                </th>
                                <th className={classes.container__header}>
                                    Today estimated population
                                </th>
                                <th className={classes.container__header}>
                                    Tomorrow estimated population
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ct}
                        </tbody>
                    </table>
                </div>
            </div>
            )
        }

        return content;
    }
}

const mapStateToProps = state => {
    return {
        countries: state.countries,
        searched: state.searchedCountries,
        loading: state.loading
    }
}


export default connect(mapStateToProps, { setCountries, searchedCountries, resetSearch, setCountriesInit })(ReportPage);