import React, { Component } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

import classes from './SelectedCountry.module.scss';

// PRESENT ONLY DETAIL FOR ONE COUNTRY

class SelectedCountry extends Component {
     // REDUX CAN BE USED BUT THIS IS ONLY STATE FOR THIS COMPONENT SO WE REALY DONT NEED IT
    state = {
        maleData: null,
        femaleData: null,
        malePercent: null,
        femalePercent: null
    }
    componentDidMount () {
        // GETTING THE COUNTRY NAME FROM PARAMS AND MAKING API CALLS
        const id = this.props.match.params.id;
        axios.all([
            axios.get(`http://api.population.io:80/1.0/wp-rank/1920-01-01/male/${id}/today/`),
            axios.get(`http://api.population.io:80/1.0/wp-rank/1920-01-01/female/${id}/today/`)
        ]).then(res => {
            const maleData = res[0].data.rank  
            const femaleData =  res[1].data.rank 
            const malePercent = (maleData / (maleData + femaleData) * 100).toFixed(2)
            const femalePercent = (femaleData / (maleData + femaleData) * 100).toFixed(2)
            this.setState({
                maleData,
                femaleData,
                malePercent,
                femalePercent,
            })
        })
    }
// SETTING THE PIE CHART
    render () {
        const options = {
            legend: {
                display: true,
                labels: {
                    fontColor: 'white',
                    fontSize: 16,
                    maintainAspectRatio: false
                }
            }
        }
        const data= {
            labels: ['Male', 'Female'],
            datasets: [{
            scaleFontColor: "#fff",
            backgroundColor: ['blue', 'rgb(255, 99, 132)'],
            borderColor: '#c5cbe3',
            data: [this.state.malePercent, this.state.femalePercent],
            }]
        }
        return (
            <div className={classes.container} >
                <div className={classes.container__pie} >
                    <h3 >Male to Female ratio in {this.props.match.params.id}</h3>
                    <Pie
                        data={data}
                        options={options}
                    />
                </div>
            </div>
        )
    }
}

export default SelectedCountry;