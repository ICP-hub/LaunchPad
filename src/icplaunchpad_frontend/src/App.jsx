
import { Provider } from "react-redux";
import AllRoutes from "./AllRoutes";
import { myStore } from "./Redux-Config/ReduxStore";

import { useSelector } from "react-redux";
import "./main.css";
function App() {
    const userFullData = useSelector((currState) => currState.userData);
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
