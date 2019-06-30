import * as types from './actionTypes';
import Global from '@utils/global'

export function setLang(lang){
  return dispatch=>{
    Global.setLanguage(lang)
    dispatch({type:types.SET_LANGUAGE, lang})
  }
}
