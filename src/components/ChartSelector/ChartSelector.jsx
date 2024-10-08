import PropTypes from "prop-types";
import "./ChartSelector.css";

const ChartSelector = ({ chartType, setChartType, types }) => {
    return (
        <div className="chart-type">
            {types.map((type) => (
                <div key={type}>
                    <input
                        type="radio"
                        id={type}
                        name="chart-type"
                        value={type}
                        checked={chartType === type}
                        onChange={(e) => setChartType(e.target.value)}
                    />
                    <label htmlFor={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                </div>
            ))}
        </div>
    );
};

ChartSelector.propTypes = {
    chartType: PropTypes.string.isRequired,
    setChartType: PropTypes.func.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChartSelector;
