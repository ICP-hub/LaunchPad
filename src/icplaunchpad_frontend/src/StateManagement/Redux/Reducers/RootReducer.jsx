import { combineReducers } from '@reduxjs/toolkit';
import actorReducer from './actorBindReducer';
import internetIdentityReducer from './InternetIdentityReducer';
import userReducer from './userRegisteredData';
import TokensInfoReducer from './TokensInfo'
import SaleParamsReducer from './SaleParams'
import upcomingSalesReducer from './UpcomingSales'
import SuccessfulSalesReducer from './SuccessfulSales'
import ProfileImageIDReducer from './ProfileImageID'
import TokenImageIDReducer from './TokenImageID'
import TokenImageIDsReducer from './TokenImageIDs'
import LedgerIdReducer from './LedgerId'

const rootReducer = combineReducers({
  actors: actorReducer,
  internet: internetIdentityReducer,
  userData: userReducer,
  TokensInfo:TokensInfoReducer,
  SaleParams:SaleParamsReducer,
  upcomingSales:upcomingSalesReducer,
  SuccessfulSales:SuccessfulSalesReducer,
  ProfileImageID:ProfileImageIDReducer,
  TokenImageID:TokenImageIDReducer,
  TokenImageIDs:TokenImageIDsReducer,
  LedgerId:LedgerIdReducer,
  
  
  
});

export default rootReducer;
