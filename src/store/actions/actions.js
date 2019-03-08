import * as actions from './actionTypes';


export const setCountriesInit = () => {
    return {
        type: actions.SET_COUNTRIES_INIT,
    }
}
export const setCountries = (countries) => {
    return {
        type: actions.SET_COUNTRIES,
        payload: countries
    }
}

export const setTopTen = (countries) => {
    return {
        type: actions.SET_TOP_TEN,
        payload: countries
    }

}
export const searchedCountries = (countries) => {
    return {
        type: actions.SEARCHED_COUNTRIES,
        payload: countries
    }
}

export const resetSearch = () => {
    return {
        type: actions.RESET_SEARCHED
    }
}

export const setPromises = (males, females) => {
    return {
        type: actions.SET_PROMISES,
        payload: {
            males,
            females
        }
    }
}

export const setRatioCountry = (country) => {
    return {
        type: actions.SET_RATIO_COUNTRY,
        payload: country
    }
}