import React from "react";
import ReactDOM from "react-dom";
import Slider from "./../src/Slider";
import "./../src/Slider.less";

ReactDOM.render(
    <Slider
        range={[50, 100, 200, 400, 800]}
        onChange={value => {
            console.log('value', value)
        }}/>,
    document.getElementById('root')
);
