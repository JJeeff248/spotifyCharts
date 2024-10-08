import "./RangeSlider.css";
import PropTypes from "prop-types";
import { useRangeSlider } from "../../hooks/useRangeSlider";

function RangeSlider({
    min,
    max,
    initialMin,
    initialMax,
    onMinChange,
    onMaxChange,
}) {
    const {
        minValue,
        maxValue,
        handleMinChange,
        handleMaxChange,
        handleKeyDown,
        rangeRef,
        trackRef,
    } = useRangeSlider(
        min,
        max,
        initialMin,
        initialMax,
        onMinChange,
        onMaxChange
    );

    return (
        <div className="range-slider" ref={rangeRef}>
            <div className="range-input">
                <div className="range-values">
                    <span>{min}</span>
                    <span>{minValue}</span>
                    <span>{maxValue}</span>
                    <span>{max}</span>
                </div>

                <input
                    type="range"
                    id="min-slider"
                    min={min}
                    max={max}
                    value={minValue}
                    onChange={handleMinChange}
                    onKeyDown={handleKeyDown}
                    ref={trackRef}
                />
                <input
                    type="range"
                    id="max-slider"
                    min={min}
                    max={max}
                    value={maxValue}
                    onChange={handleMaxChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
}

RangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    initialMin: PropTypes.number.isRequired,
    initialMax: PropTypes.number.isRequired,
    onMinChange: PropTypes.func.isRequired,
    onMaxChange: PropTypes.func.isRequired,
};

export default RangeSlider;
