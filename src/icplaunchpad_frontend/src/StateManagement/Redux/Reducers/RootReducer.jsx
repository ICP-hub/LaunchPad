import { combineReducers } from '@reduxjs/toolkit';
import actorReducer from './actorBindReducer';
import internetIdentityReducer from './InternetIdentityReducer';
import userReducer from './userRegisteredData';


const rootReducer = combineReducers({
  actors: actorReducer,
  internet: internetIdentityReducer,
  userData: userReducer,
  
});

export default rootReducer;
