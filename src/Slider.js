import React, { PureComponent} from "react";
import PropTypes from "prop-types";

class App extends PureComponent {

    static propTypes = {
        range: PropTypes.array.isRequired,
        onChange: PropTypes.func
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: this.props.range[0],
            limit: 0,
            grab: 0,
            coordinates: {
                fill: 0,
                handle: -3
            }
        };
        this.windowWidth = window.innerWidth;
    }

    componentWillMount() {
        if (!this.props.range) {
            throw new Error("'range' prop required");
        }
        if (this.props.range.length < 2) {
            throw new Error("You need to add 2 or more numbers in 'range' prop");
        }
        if (!PropTypes.arrayOf(PropTypes.numbers)) {
            throw new Error("All values in 'range' prop need to be numbers");
        }
        this.props.range.reduce((acc, value) => {
            if (value < acc) {
                throw new Error("All values in 'range' prop need to be ascending");
            }
            return value;
        });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleUpdate);
        this.handleUpdate();
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleUpdate);
    };

    handleUpdate = () => {
        let sliderPos = this.slider.offsetWidth;
        let handlePos = this.handle.offsetWidth / 2;

        let new_coordinates = null;
        if (this.windowWidth !== window.innerWidth) {
            let windowWidthDiffPercentage = window.innerWidth / this.windowWidth * 100;
            new_coordinates = {
                fill: this.state.coordinates.fill/100 * windowWidthDiffPercentage,
                handle: this.state.coordinates.handle/100 * windowWidthDiffPercentage
            };
            this.windowWidth = window.innerWidth;
        }

        let new_state = {
            limit: sliderPos - handlePos,
            grab: handlePos
        };
        if (new_coordinates) {
            new_state.coordinates = new_coordinates;
        }
        this.setState(new_state);
    };

    handleStart = () => {
        document.addEventListener("mousemove", this.handleDrag);
        document.addEventListener("mouseup", this.handleEnd);
    };

    handleDrag = (e) => {
        e.stopPropagation();
        e.preventDefault();

        let position = this.position(e);
        let value = this.getValueFromPosition(position);
        const coordinates = this.coordinates(position);
        this.setState({
            value,
            coordinates
        });

        this.props.onChange && this.props.onChange(value, e);
    };

    handleEnd = (e) => {
        document.removeEventListener("mousemove", this.handleDrag);
        document.removeEventListener("mouseup", this.handleEnd);
    };

    position = (e) => {
        const {grab} = this.state;

        const node = this.slider;
        const coordinate = !e.touches ? e.clientX : e.touches[0].clientX;
        const direction = node.getBoundingClientRect().left;
        return coordinate - direction - grab;
    };

    coordinates = (pos) => {
        const {grab, limit} = this.state;

        if (pos >= limit) pos = limit;
        if (pos <= 0) pos = 0;

        return {
            fill: pos + grab,
            handle: pos - 5
        };
    };

    getValueFromPosition = (pos) => {
        const {limit} = this.state;
        let min = this.props.range[0];
        let max = this.props.range.slice(-1)[0];
        const step = 1;

        const percentage = (Math.min(Math.max(pos, 0), limit) / (limit || 1));

        const sectionCount = this.props.range.length - 1;
        const sectionWidthPercentage = 1 / (sectionCount);
        const sectionNumber = Math.ceil(percentage / sectionWidthPercentage);
        let sectionPercentage = (percentage * sectionCount) % (sectionNumber - 1 || 1);
        if (pos > 1 && sectionPercentage === 0) {
            sectionPercentage = this.props.range.slice(-1)[0];
        }
        const sectionMax = this.props.range[sectionNumber];
        const sectionMin = sectionNumber > 0 ? this.props.range[sectionNumber - 1] : 1;
        const baseVal = step * Math.round(sectionPercentage * (sectionMax - sectionMin) / step);

        let value = baseVal + sectionMin;

        if (value >= max) value = max;
        if (value <= min) value = min;

        return value;
    };

    render() {
        const fillStyle = {width: `${this.state.coordinates.fill}px`};
        const handleStyle = {transform: `translateX(${this.state.coordinates.handle}px)`};

        return (
            <div className="react-range-slider">
                <div className="react-range-slider__section-title">
                    { this.props.range[0] }
                </div>
                <div ref={(s) => { this.slider = s; }}
                     onMouseDown={this.handleDrag}
                     onMouseUp={this.handleEnd}
                     onTouchStart={this.handleDrag}
                     onTouchEnd={this.handleEnd}
                     className="react-range-slider__wrapper">
                    <div ref={(sh) => { this.handle = sh; }}
                         className="react-range-slider__handle"
                         onMouseDown={this.handleStart}
                         onTouchMove={this.handleDrag}
                         onTouchEnd={this.handleEnd}
                         style={handleStyle}>
                        <div className="react-range-slider__tooltip">
                            {this.state.value}
                        </div>
                    </div>
                    <div className="react-range-slider__fill"
                         style={fillStyle} />
                    {
                        this.props.range.map((value, index, array) => {
                            return index !== 0 ? (
                                <div key={"section-" + value}
                                     style={{width: 100 / (array.length - 1) + "%"}}
                                     className="react-range-slider__section">
                                    {
                                        index !== array.length - 1
                                            ? <span className="react-range-slider__section-value">{value}</span> : null
                                    }
                                    <span className="react-range-slider__section-text">Section {index}</span>
                                </div>
                            ) : null;
                        })
                    }
                </div>
                <div className="react-range-slider__section-title">
                    { this.props.range[this.props.range.length - 1] }
                </div>
            </div>
        );
    }
}

export default App;