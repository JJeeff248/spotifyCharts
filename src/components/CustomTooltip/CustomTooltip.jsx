import PropTypes from "prop-types";

import "./CustomTooltip.css";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{label || payload[0].name}</p>
                <p className="value">
                    <strong>{payload[0].value}</strong> plays
                </p>
            </div>
        );
    }
    return null;
};

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
};

export default CustomTooltip;
