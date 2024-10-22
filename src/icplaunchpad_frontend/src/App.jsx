import "./main.css";
import AllRoutes from './AllRoutes';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userRegisteredHandlerRequest } from "./StateManagement/Redux/Reducers/userRegisteredData";

function App() {
  const actor = useSelector((currState) => currState.actors.actor);
  const identity = useSelector((currState) => currState.internet.identity);
  const isAuthenticated = useSelector(
    (currState) => currState.internet.isAuthenticated
  );
  const state = useSelector((currState) => currState);

  console.log('actor in app.js', actor);
  console.log('identity in app.js', identity);
  console.log('isAuthenticated in app.js', isAuthenticated);
  console.log('state in app.js', state);

  const dispatch = useDispatch();

  useEffect(() => {
    if ( actor) {
      // Dispatch the user registration request when the user is authenticated
      dispatch(userRegisteredHandlerRequest());
    }
  }, [ actor, dispatch]); // Add dependencies

  return (
    <div id="root" className="text-white max-w-[1700px] mx-auto container">
      <AllRoutes />
    </div>
  );
}

export default App;
