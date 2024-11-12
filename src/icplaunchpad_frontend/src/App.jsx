import "./main.css";
import AllRoutes from './AllRoutes';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userRegisteredHandlerRequest } from "./StateManagement/Redux/Reducers/userRegisteredData";
import { ProfileImageIDHandlerRequest } from "./StateManagement/Redux/Reducers/ProfileImageID";
import { TokensInfoHandlerRequest } from "./StateManagement/Redux/Reducers/TokensInfo";
import { upcomingSalesHandlerRequest } from "./StateManagement/Redux/Reducers/UpcomingSales";
import { SuccessfulSalesHandlerRequest } from "./StateManagement/Redux/Reducers/SuccessfulSales";
import { UserTokensInfoHandlerRequest } from "./StateManagement/Redux/Reducers/UserTokensInfo";
// import { AuthProvider } from "./StateManagement/useContext/useAuth";
import {  useAuth } from "./StateManagement/useContext/useClient";
import { useIdentityKit } from "@nfid/identitykit/react";
function App() {
  const {
    createCustomActor,
    isAuthenticated
  } = useAuth();
 
  
  const actor = useSelector((currState) => currState.actors.actor);
  const identity = useSelector((currState) => currState.internet.identity);
  const principal = useSelector((currState) => currState.internet.principal);
  const userData = useSelector((state) => state?.userData?.data[0]);

  console.log('userData', userData), 

  console.log('actor in app.js', actor);
  console.log('isAuthenticated in app.js', isAuthenticated);
  console.log('principal in app.js', principal);
  const dispatch = useDispatch();

  useEffect(() => {
    if ( isAuthenticated && principal && actor  ) {
      dispatch(userRegisteredHandlerRequest());
      dispatch(ProfileImageIDHandlerRequest());
      dispatch(TokensInfoHandlerRequest());
      dispatch(UserTokensInfoHandlerRequest());
    }
    if(actor){
      console.log("appjs actor-", actor)
    dispatch(upcomingSalesHandlerRequest());
    dispatch(SuccessfulSalesHandlerRequest());
    }

  }, [actor, dispatch,isAuthenticated,principal]); 

  return (
   
    <div className="text-white max-w-[1700px] mx-auto container">
      <AllRoutes />
    </div>

  );
}

export default App;
