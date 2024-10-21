import { combineReducers } from '@reduxjs/toolkit';
import actorReducer from './actorBindReducer';
import internetIdentityReducer from './InternetIdentityReducer';
import userReducer from './userRegisteredData';
import upcomingSalesReducer from './UpcomingSales'
import TokensInfoReducer from './TokensInfo'

const rootReducer = combineReducers({
  actors: actorReducer,
  internet: internetIdentityReducer,
  userData: userReducer,
  upcomingSales:upcomingSalesReducer,
  TokensInfoReducer:TokensInfoReducer
  
  
});

export default rootReducer;
