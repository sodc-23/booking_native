import * as types from "./actionTypes";
import Global from "@utils/global";



const initialState = {
  lang: 'en',
  T1: Global.Translate.T1,
  T2: Global.Translate.T2,
  T3: Global.Translate.T3,
  T4: Global.Translate.T4,
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_LANGUAGE:
      if ( action.lang == state.lang ) return state
      return {
        ...state,
        lang: action.lang,
        T1: Global.Translate.T1,
        T2: Global.Translate.T2,
        T3: Global.Translate.T3,
        T4: Global.Translate.T4
      }
    default:
      return state;
  }
}
