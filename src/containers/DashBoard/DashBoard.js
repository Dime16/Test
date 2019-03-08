import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTopTen, setPromises, setRatioCountry, setCountriesInit } from '../../store/actions';

import Spinner from '../../components/Spinner/Spinner';
import { Bar, Pie } from 'react-chartjs-2';

import classes from './DashBoard.module.scss';

class DashBoard extends Component {

    componentDidMount() {
        // STARTING THE SPINNER
        this.props.setCountriesInit()
        // CALLING THE API
        axios.get('http://api.population.io:80/1.0/countries')
            .then(res => {
                let males = [];
                let females = []
                let promises = [];
                let countries = [];
                let obj = [];

                // NOW I FILTER THE COUNTRIES TO REMOVE THE REGIONS AND CONTINENTS

                res.data.countries.filter(country => {
                    if (country === "Australia/New Zealand") {
                        return false;
                    } else if([
                       "Less developed regions",
                       "Less developed regions, excluding China",
                       "Eastern Asia",
                       "Eastern Africa",
                       "Eastern Europe",
                       "Central America",
                       ].includes(country)) {
                           return false;
                       } 
                       else if( country === country.toUpperCase()){
                           return country;
                       } 
                    countries.push(country)
                    return (
                        promises.push(axios.get(`http://api.population.io:80/1.0/population/${country}/today-and-tomorrow/`)),
                        males.push(axios.get(`http://api.population.io:80/1.0/wp-rank/1920-01-01/male/${country}/today/`)),
                        females.push(axios.get(`http://api.population.io:80/1.0/wp-rank/1920-01-01/female/${country}/today/`))
                    )
                })
                // I MAKE CALLS TO GET WOMAN AND MALE POPULATION 
                axios.all(promises)
                    .then(res => {
                        res.map((val, index) => {
                            return obj.push({
                                name: countries[index],
                                population: val.data.total_population
                            })
                        })
                        const topTen = obj.sort((a, b) => {
                                if (a.population && b.population) {
                                    return b.population[0].population - a.population[0].population
                                }
                            })
                            .slice(0, 10)
                            // SETTING THE TOP 10 COUNTRIES AND THE DATA TO GET THE COUNTRY
                            // THAT HAS THE HIGHEST FEMALE TO MALE RATIO ON BUTTON CLICK TO OPTIMISE 
                            // PREFORMANCE TO REDUX
                        return (this.props.setTopTen(topTen),
                            this.props.setPromises(males, females)
                        )
                    })
                    .catch(e => {
                        console.log(e)
                    })
                
            })
    }

    // THIS IS THE HANDLER TO GET FEMALE TO MALE RATIO AND SORT IT.
    onRatioHandler = () => {
        let obj = [];
        let arr = [];
        axios.all(this.props.promises.males)
            .then(res => {
                arr = res.map(val => val.data.rank)
                return axios.all(this.props.promises.females)
                .then(res => {
                    res.map((val, index) => {
                        obj.push({
                            country: val.data.country,
                            male: arr[index],
                            female: val.data.rank
                        })
                    })
                    const top = obj.map(val => {
                        const malePercent = (val.male / (val.male + val.female)) * 100;
                        const femalePercent = (val.female / (val.male + val.female)) * 100
                        return({percent: (malePercent - femalePercent), male: val.male, female: val.female, name: val.country})
                    })
                    .sort((a,b) =>  b.percent - a.percent)
                    // SENDING THE DATA TO REDUX
                    this.props.setRatioCountry(top[0]);
                })
            })
    }

    render () {
        // GETTING THE DATA FROM REDUX NEEDED FOR THE CHARTS
        let names = null;
        let population = null;
        if(this.props.topTen) {
            names = this.props.topTen.map(val => val.name);
            population = this.props.topTen.map(val => val.population[0].population);
        }
        const options = {
            legend: {
                display: true,
                labels: {
                    fontColor: 'white',
                    fontSize: 18
                }
            }
        }
        const data= {
            labels: names,
            datasets: [{
            label: 'Top 10 countries with highest population',
            scaleFontColor: "#fff",
            borderWidth: 3,
            borderColor: '#123c69',
            backgroundColor: '#5da2d5',
            data: population,
            }]
        }


        let pie = null;
        if(this.props.ratioCountry) {
            const pieOptions = {
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'white',
                        fontSize: 16,
                        maintainAspectRatio: false
                    }
                }
            }
    
            const pieData= {
                labels: ['Male', 'Female'],
                datasets: [{
                label: this.props.ratioCountry.name,
                scaleFontColor: "#fff",
                backgroundColor: ['blue', 'rgb(255, 99, 132)'],
                borderColor: '#c5cbe3',
                data: [this.props.ratioCountry.male, this.props.ratioCountry.female],
                }]
            }
            pie = (
                <React.Fragment>
                <h3>{this.props.ratioCountry.name}</h3>
                <Pie
                data={pieData}
                options={pieOptions}
                />
                </React.Fragment>
            )
        }
        //  SETTING THE SPINNER OR CONTENT WITH CORELATION IF THE DATA IS SET IN REDUX
        let content = <Spinner />
        if(!this.props.loading) {
            content = (
                <div className={classes.container}>
                <div className={classes.container__bar}>
                    <Bar data={data} options={options} />
                </div>
                <div className={classes.container__bot}>
                    <button
                        className={classes.container__bot__btn}
                        onClick={this.onRatioHandler}
                    >See Which country has the highest female to male ratio</button>
                    {pie}
                </div>
            </div>
            )
        }
        return content;
    }
}

const mapStateToProps = state => {
    return {
        topTen: state.topTen,
        promises: state.promises,
        ratioCountry: state.ratioCountry,
        loading: state.loading
    }
}

export default connect(mapStateToProps, { setTopTen, setPromises, setRatioCountry, setCountriesInit })(DashBoard);