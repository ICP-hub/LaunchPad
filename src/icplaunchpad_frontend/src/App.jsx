
import { Provider } from "react-redux";
import AllRoutes from "./AllRoutes";
import { myStore } from "./Redux-Config/ReduxStore";

function App() {
  return (
    <Provider store={myStore}>
    <div id="root" className="text-white max-w-[1700px] mx-auto ">
      <AllRoutes />
    </div>
    </Provider>
  );
}
export default App;
