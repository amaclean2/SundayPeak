import './App.css';
import './variables.css';
import ButtonBar from "./ButtonBar";
import ReactMap from "./Mapping/ReactMap";

const App = () => {

  return (
    <div className="app-container">
      <ReactMap />
      <ButtonBar />
    </div>
  );
};

export default App;