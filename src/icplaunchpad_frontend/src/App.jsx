import "./main.css";
import AllRoutes from './AllRoutes';
import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { userRegisteredHandlerRequest } from "./StateManagement/Redux/Reducers/userRegisteredData";
// import { ProfileImageIDHandlerRequest } from "./StateManagement/Redux/Reducers/ProfileImageID";
// import { TokensInfoHandlerRequest } from "./StateManagement/Redux/Reducers/TokensInfo";
// import { upcomingSalesHandlerRequest } from "./StateManagement/Redux/Reducers/UpcomingSales";
// import { SuccessfulSalesHandlerRequest } from "./StateManagement/Redux/Reducers/SuccessfulSales";
// import { UserTokensInfoHandlerRequest } from "./StateManagement/Redux/Reducers/UserTokensInfo";
// import { AuthProvider } from "./StateManagement/useContext/useAuth";
import { loginStart } from "./StateManagement/Redux/Reducers/InternetIdentityReducer";
import { handleActorRequest } from "./StateManagement/Redux/Reducers/actorBindReducer";
import {  useAuth } from "./StateManagement/useContext/useClient";
import { useIdentityKit } from "@nfid/identitykit/react";

import { Principal } from "@dfinity/candid/lib/cjs/idl";
function App() {
  // const {
  //   isAuthenticated,
  //   identity,
  //   createCustomActor
  // } = useAuth();
 
  // const dispatch = useDispatch();

 


  // useEffect(() => {
  //   const fetchDataSequentially = () => {
  //     try {
  //       if (isAuthenticated && identity ) {
  //         dispatch(userRegisteredHandlerRequest());
  //          dispatch(ProfileImageIDHandlerRequest());
  //          dispatch(TokensInfoHandlerRequest());
  //          dispatch(UserTokensInfoHandlerRequest());
  //          dispatch(handleActorRequest());
  //         dispatch(loginStart());
  //          dispatch(upcomingSalesHandlerRequest());
  //          dispatch(SuccessfulSalesHandlerRequest());
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchDataSequentially();
  // }, [isAuthenticated, identity, dispatch]);



  return (
   
    <div className="text-white max-w-[1700px] mx-auto container">
      <AllRoutes />
    </div>

  );
}

export default App;
