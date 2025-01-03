import "./main.css";
import AllRoutes from './AllRoutes';
import { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { userRegisteredHandlerRequest } from "./StateManagement/Redux/Reducers/userRegisteredData";
import { ProfileImageIDHandlerRequest } from "./StateManagement/Redux/Reducers/ProfileImageID";
import { TokensInfoHandlerRequest } from "./StateManagement/Redux/Reducers/TokensInfo";
import { upcomingSalesHandlerRequest } from "./StateManagement/Redux/Reducers/UpcomingSales";
import { SuccessfulSalesHandlerRequest } from "./StateManagement/Redux/Reducers/SuccessfulSales";
import { UserTokensInfoHandlerRequest } from "./StateManagement/Redux/Reducers/UserTokensInfo";
import { loginStart } from "./StateManagement/Redux/Reducers/InternetIdentityReducer";
import { initActor } from "./StateManagement/Redux/Reducers/actorBindReducer";
// import { useAgent, useBalance, useIdentity } from "@nfid/identitykit/react";
import { Principal } from "@dfinity/principal";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function App() {
  const actor = useSelector((currState) => currState.actors.actor);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const identity = useSelector(
    (currState) => currState.internet.identity
  );
const canisterID = process.env.CANISTER_ID_ICPLAUNCHPAD_BACKEND;

  const principal = useSelector((currState) => currState.internet.principal);
  const userData = useSelector((state) => state?.userData?.data);
  const dispatch = useDispatch();

  console.log("is actor", actor)

  const fetchDataSequentially = async () => {
    if (isAuthenticated  && canisterID) {
      try {
         dispatch(initActor({canisterID}));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };
             
  useEffect(() => {
    fetchDataSequentially();
  }, [isAuthenticated, dispatch]);

  const fetchBalanceData = () => {
    dispatch(userRegisteredHandlerRequest());
    dispatch(ProfileImageIDHandlerRequest());
  };
  
  useEffect(() => {
    if (actor ) {
      fetchBalanceData();
    }
  }, [actor]);
  
  return (
    <SkeletonTheme baseColor="#FFFFFF1A" highlightColor="#444">
    <div className="text-white max-w-[1700px] mx-auto container">
      <AllRoutes />
    </div>
    </SkeletonTheme>
  );
}

export default App;
