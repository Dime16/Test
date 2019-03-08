import * as actionTypes from '../actions/actionTypes';
const INITIAL_STATE = {
    loading: false,
    countries: null,
    topTen: null,
    searchedCountries: null,
    promises: null,
    ratioCountry: null
};
const reducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case actionTypes.SET_COUNTRIES_INIT:
        return {
            ...state,
            loading: true
        }
        case actionTypes.SET_COUNTRIES:
            return {
                ...state,
                countries: action.payload,
                loading: false
            }
        case actionTypes.SET_TOP_TEN:
            return {
                ...state,
                topTen: action.payload,
                loading: false
            }
        case actionTypes.SEARCHED_COUNTRIES:
            return {
                ...state,
                searchedCountries: action.payload
            }
        case actionTypes.RESET_SEARCHED:
            return {
                ...state,
                searchedCountries: null
            }
        case actionTypes.SET_PROMISES:
            return {
                ...state,
                promises: action.payload
            }
        case actionTypes.SET_RATIO_COUNTRY:
            return {
                ...state,
                ratioCountry: action.payload
            }
        default: 
            return state;
    }
}

export default reducer;