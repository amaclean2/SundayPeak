import Map from "./Mapping/Map";

import './App.css';
import './variables.css';
import ButtonBar from "./ButtonBar";
import ReactMap from "./Mapping/ReactMap";

const App = () => {

  return (
    <div className="app-container">
      {/* <Map /> */}
      <ReactMap />
      <ButtonBar />
    </div>
  );
};

export default App;