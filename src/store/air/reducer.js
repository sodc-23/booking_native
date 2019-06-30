import * as types from "./actionTypes";
import moment from 'moment'
import Global from "@utils/global";

const initialState = {
  type: types.NONE,
  status: types.NONE,
  locationResults: [],
  selectedFromLocation: null,
  selectedToLocation: null,
  operator:null,
  fromDate:moment().add(1, 'days'),
  toDate:moment().add(2, 'days'),
  result:{},
  air:null,
  error: null,
  policyData:[],
  searchData:{},
  searchPageData:{
    "request": {
      "token": ""
    },
    "flags": {}
  },
  multiways:[{
    fromLocation: null,
    toLocation:null,
    fromDate:new Date(),
  }, {
    fromLocation: null,
    toLocation:null,
    fromDate:new Date(),
  }, {
    fromLocation: null,
    toLocation:null,
    fromDate:new Date(),
  }],
  fareRules:[],
  fareBreakups:[],
  passengers:{ adults: 1, children: 0, infants: 0 },
  recentSearches:[]
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
    case types.SELECT_FROM_LOCATION:
      if(typeof action.index == 'undefined') {
        return {
          ...state,
          type: types.SELECT_FROM_LOCATION,
          status: action.status,
          selectedFromLocation: action.result,
          error: action.error,
        }
      } else {
        let {multiways} = state
        multiways[action.index].fromLocation = action.result
        return {
          ...state,
          type: types.SELECT_FROM_LOCATION,
          status: action.status,
          multiways: multiways,
          error: action.error,
        }
      }
    case types.SELECT_TO_LOCATION:
      if(typeof action.index == 'undefined') {
        return {
          ...state,
          type: types.SELECT_TO_LOCATION,
          status: action.status,
          selectedToLocation: action.result,
          error: action.error,
        }
      } else {
        let {multiways} = state
        multiways[action.index].toLocation = action.result
        return {
          ...state,
          type: types.SELECT_TO_LOCATION,
          status: action.status,
          multiways: multiways,
          error: action.error,
        }
      }
    case types.ADD_WAY:{
      let {multiways} = state
      multiways.push({
        fromLocation: null,
        toLocation:null,
        fromDate:new Date(),
      })
      return {
        ...state,
        type: types.ADD_WAY,
        status: action.status,
        multiways: multiways
      }
    }
    case types.REMOVE_WAY:{
      let {multiways} = state
      if(multiways.length == 1) return;
      multiways.pop()
      return {
        ...state,
        type: types.REMOVE_WAY,
        status: action.status,
        multiways: multiways
      }
    }
    case types.SELECT_DATE:
      if(!action.index) {
        var toDate = action.result.toDate
        if(moment(action.result.fromDate).format('YYYYMMDD') == moment(toDate).format('YYYYMMDD')) {
          toDate = moment(action.result.fromDate).add(1, 'days').toDate()
        }
        return {
          ...state,
          type: types.SELECT_DATE,
          status: action.status,
          fromDate: action.result.fromDate,
          toDate: toDate,
          error: action.error,
        }
      } else {
        let {multiways} = this.state
        multiways[index].fromDate = action.result
        if(moment(multiways[index].fromDate).format('YYYYMMDD') == moment(multiways[index].toDate).format('YYYYMMDD')) {
          multiways[index].toDate = moment(multiways[index].fromDate).add(1, 'days').toDate()
        }
        return {
          ...state,
          type: types.SELECT_DATE,
          status: action.status,
          multiways: multiways,
          error: action.error,
        }
      }
    case types.SELECT_PASSENGERS:
      return {
        ...state,
        type: types.SELECT_PASSENGERS,
        status: action.status,
        passengers: action.result,
        error: action.error,
      }
    case types.GET_OPERATOR:
      return {
        ...state,
        type: types.GET_OPERATOR,
        status: action.status,
        operator: action.result,
        error: action.error,
      }
    case types.SEARCH_AIR:
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
        type: types.SEARCH_AIR,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    case types.GET_AIR_DETAIL:
      return {
        ...state,
        type: types.GET_AIR_DETAIL,
        status: action.status,
        air: action.result,
        error: action.error,
      }
    case types.GET_AIR_FARERULE:
      return {
        ...state,
        type: types.GET_AIR_FARERULE,
        status: action.status,
        fareRules: action.result,
        error: action.error,
      }
    case types.GET_AIR_FAREBREAKUP:
      return {
        ...state,
        type: types.GET_AIR_FAREBREAKUP,
        status: action.status,
        fareBreakups: action.result,
        error: action.error,
      }
    case types.SET_SEARCH_DATA:
      return {
        ...state,
        type: types.SET_SEARCH_DATA,
        searchData: action.searchData
      }
    case types.SEARCH_AIR_PAGE:
      if(action.result) {
        state.searchPageData.request.sortIndex = action.result.appliedSortingIndex
        state.searchPageData.request.filtersIndex = action.result.appliedFiltersIndex
        state.searchPageData.request.pageInfoIndex = action.result.pageInfoIndex

        Global.currency = action.result.appliedFiltersIndex[0].item.filter(o=>o.name=='currency')[0].defaultValue 
      }
      return {
        ...state,
        type: types.SEARCH_AIR,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    case types.SEARCH_AIR_PAGE_NEXT:
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
        type: types.SEARCH_AIR,
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
