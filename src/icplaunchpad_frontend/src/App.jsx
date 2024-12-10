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
import { loginStart } from "./StateManagement/Redux/Reducers/InternetIdentityReducer";
import { handleActorRequest } from "./StateManagement/Redux/Reducers/actorBindReducer";
import { useAgent, useBalance, useIdentity } from "@nfid/identitykit/react";
import { Principal } from "@dfinity/principal";

function App() {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const principal = useSelector((currState) => currState.internet.principal);
  const userData = useSelector((state) => state?.userData?.data[0]);
//  console.log("is authentication", isAuthenticated)
//   console.log("is actor", actor)
//   console.log("is principal", principal)
//   console.log("is userData", userData)
  const dispatch = useDispatch();
  const identity = useIdentity()

  const { balance,  fetchBalance } = useBalance()

  const fetchDataSequentially = async () => {
    if (isAuthenticated && identity) {
      try {
         dispatch(handleActorRequest({ identity }));
        await Promise.all([
          dispatch(userRegisteredHandlerRequest()),
        dispatch(ProfileImageIDHandlerRequest()),
        dispatch(TokensInfoHandlerRequest()),
        dispatch(UserTokensInfoHandlerRequest()),
        dispatch(upcomingSalesHandlerRequest()),
        dispatch(SuccessfulSalesHandlerRequest()),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchDataSequentially();
  }, [isAuthenticated, identity, dispatch]);

  const fetchBalanceData = async () => {
    if (isAuthenticated && identity) {
    try {
      const balance = await fetchBalance();
      // console.log('fetchUserIcpBalance', balance);
    } catch (error) {
      console.error('Error fetching ICP balance:', error);
    }}
  };


  useEffect(() => {
    fetchBalanceData();
  }, [isAuthenticated, identity]);
  return (
   
    <div className="text-white max-w-[1700px] mx-auto container">
      <AllRoutes />
    </div>

  );
}

export default App;
