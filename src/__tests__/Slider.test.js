import React from "react";
import ReactDOM from "react-dom";
import Slider from "./../Slider";

const div = document.createElement("div");

describe("React Range Slider", () => {
    it("renders without crashing", () => {
        ReactDOM.render(<Slider range={[100, 200]} />, div);
    });
    it("throw error when 'range' prop array length < 2", () => {
        expect(ReactDOM.render(<Slider range={[100, 200]} />, div)).toThrow();
    });
    it("throw error when all values of 'range' prop array are not numbers", () => {
        expect(ReactDOM.render(<Slider range={[50, "100"]} />, div)).toThrow();
    });
    it("throw error when all values of 'range' prop array are not ascending", () => {
        expect(ReactDOM.render(<Slider range={[100, 50, 200]} />, div)).toThrow();
    });
});