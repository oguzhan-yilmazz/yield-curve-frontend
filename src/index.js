// import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import YieldCurveHightchart from "./components/YieldCurveHightchart";
import "./index.css";
/* Fonksiyon ile component oluşturma */
// function App() {
//   return <h1> Hello World </h1>;
// };

/* classNameName ile component oluşturma */

const App = (props) => {
  console.log(props.childrens);
  return (
    <div className="container">
      <div className="App">
        <YieldCurveHightchart />
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
