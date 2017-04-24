import React from "react";
import ReactDOM from "react-dom";
import Slider from "./Slider";

ReactDOM.render(
    <Slider
        range={[0, 50, 200, 400, 800]}
        onChange={(value) => {
        }}/>,
  document.getElementById('root')
);
