
import { Provider } from "react-redux";
import AllRoutes from "./AllRoutes";
import { myStore } from "./Redux-Config/ReduxStore";
import { useSelector,useDispatch } from "react-redux";
import "./main.css";
import { useEffect } from "react";
import { userRegisteredHandlerRequest } from "./StateManagement/Redux/Reducers/userRegisteredData";
import { useAuth } from "./StateManagement/useContext/useAuth";
function App() {
    const userFullData = useSelector((currState) => currState.userData);
    const {actor,reloadLogin,authClient } = useAuth();
  const dispatch = useDispatch();
    console.log("user full data in app.js",userFullData)
   

  return (
    <Provider store={myStore}>
    <div id="root" className="text-white max-w-[1700px] mx-auto ">
      <AllRoutes />
      
    </div>
    </Provider>
  );
}
export default App;
