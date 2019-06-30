import * as types from "./actionTypes";
import moment from 'moment'
import Global from "@utils/global";

const initialState = {
  type: types.NONE,
  status: types.NONE,
  locationResults: [],
  selectedLocation: null/*{
    "id": "SA5",
    "commonCode": "",
    "cultureIrrelevantName": "Makkah",
    "name": "Makkah, Saudi Arabia",
    "countryID": "SA",
    "type": "Location",
    "latitude": 0,
    "longitude": 0,
    "priority": 9999
  }*/,
  fromDate:moment().add(1, 'days'),
  toDate:moment().add(2, 'days'),
  result:{},
  packageData:null,
  error: null,
  policyData:[],
  searchData:{},
  searchPageData:{
    "request": {
      "token": ""
    },
    "flags": {}
  },
  rooms:[{ adults: 2, children: [], infants: 0 }],
  recentSearches:[],
  passengers:1,
  promotedLocations:[],
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_LOCATIONS:
      return {
        ...state,
        type: types.GET_LOCATIONS,
        status: action.status,
        locationResults: action.result,
        error: action.error,
      }
    case types.SELECT_LOCATION:
      return {
        ...state,
        type: types.SELECT_FROM_LOCATION,
        status: action.status,
        selectedLocation: action.result,
        error: action.error,
      }
    case types.GET_PROMOTED_LOCATIONS:
      return {
        ...state,
        type: types.GET_PROMOTED_LOCATIONS,
        status: action.status,
        promotedLocations: action.result,
        error: action.error,
      }
    case types.SELECT_DATE:
      return {
        ...state,
        type: types.SELECT_DATE,
        status: action.status,
        fromDate: action.result.fromDate,
        toDate: action.result.toDate,
        error: action.error,
      }
    case types.SELECT_ROOM:
      return {
        ...state,
        type: types.SELECT_ROOM,
        status: action.status,
        rooms: action.result,
        error: action.error,
      }
    case types.SELECT_PASSENGERS:
      return {
        ...state,
        type: types.SELECT_PASSENGERS,
        status: action.status,
        passengers: action.result,
        ages: action.ages,
        error: action.error,
      }
    case types.SEARCH_PACKAGE:
      if(action.token) {
        state.searchPageData.request.token = action.token
      }
      if(action.result) {
        state.searchPageData.request.sortIndex = action.result.appliedSortingIndex
        state.searchPageData.request.filtersIndex = action.result.appliedFiltersIndex
        state.searchPageData.request.pageInfoIndex = action.result.pageInfoIndex

        Global.currency = action.result.appliedFiltersIndex[0].item.filter(o=>o.name=='currency')[0].defaultValue 
      }
      return {
        ...state,
        type: types.SEARCH_PACKAGE,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    case types.GET_PACKAGE_DETAIL:
      return {
        ...state,
        type: types.GET_PACKAGE_DETAIL,
        status: action.status,
        packageData: action.result,
        error: action.error,
      }
    case types.SET_SEARCH_DATA:
      return {
        ...state,
        type: types.SET_SEARCH_DATA,
        searchData: action.searchData
      }
    case types.SEARCH_PACKAGE_PAGE:
      if(action.result) {
        state.searchPageData.request.sortIndex = action.result.appliedSortingIndex
        state.searchPageData.request.filtersIndex = action.result.appliedFiltersIndex
        state.searchPageData.request.pageInfoIndex = action.result.pageInfoIndex

        Global.currency = action.result.appliedFiltersIndex[0].item.filter(o=>o.name=='currency')[0].defaultValue 
      }
      return {
        ...state,
        type: types.SEARCH_PACKAGE,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    case types.SEARCH_PACKAGE_PAGE_NEXT:
      if(action.result) {
        state.searchPageData.request.sortIndex = action.result.appliedSortingIndex
        state.searchPageData.request.filtersIndex = action.result.appliedFiltersIndex
        state.searchPageData.request.pageInfoIndex = action.result.pageInfoIndex
        if(state.result.data && state.result.data[0].item) {
          if(action.result.data && action.result.data[0].item) {
            state.result.data[0].item = state.result.data[0].item.concat(action.result.data[0].item)
          }
        }
      }
      return {
        ...state,
        type: types.SEARCH_PACKAGE,
        status: action.status,
        result: state.result,
        error: action.error,
      }
    case types.GET_POLICY:
      return {
        ...state,
        type: types.GET_POLICY,
        status: action.status,
        policyData: action.result,
        error: action.error,
      }
    case types.RECENT_SEARCH:
      return {
        ...state,
        type: types.RECENT_SEARCH,
        status: action.status,
        recentSearches: action.result,
        error: action.error,
      }
    default:
      return state;
  }
}
