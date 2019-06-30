import { combineReducers } from 'redux'

import common from './common'
import auth from './auth'
import user from './user'
import cotraveller from './cotraveller'
import hotel from './hotel'
import activity from './activity'
import cart from './cart'
import language from './language'
import transfers from './transfer'
import vehicle from './vehicle'
import air from './air'
import bus from './bus'
import packages from './packages'
import hotDeal from './hotDeal'

export default combineReducers({
  common,
  auth,
  user,
  cotraveller,
  hotel,
  cart,
  activity,
  language,
  transfers,
  vehicle,
  air,
  bus,
  packages,
  hotDeal,
})
