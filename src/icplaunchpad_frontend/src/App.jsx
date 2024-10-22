import "./main.css";
import AllRoutes from './AllRoutes';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userRegisteredHandlerRequest } from "./StateManagement/Redux/Reducers/userRegisteredData";

function App() {
  const actor = useSelector((currState) => currState.actors.actor);
  const identity = useSelector((currState) => currState.internet.identity);
  const principal = useSelector((currState) => currState.internet.principal);

  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );

  console.log('actor in app.js', actor);
  console.log('identity in app.js', identity);
  console.log('isAuthenticated in app.js', isAuthenticated);


  const dispatch = useDispatch();

  useEffect(() => {
    if ( isAuthenticated && principal && identity ) {
      // Dispatch the user registration request when the user is authenticated
      dispatch(userRegisteredHandlerRequest());
    }
  }, [ actor, dispatch,isAuthenticated,principal ,identity]); // Add dependencies

  return (
    <div id="root" className="text-white max-w-[1700px] mx-auto container">
      <AllRoutes />
    </div>
  );
}

export default App;
