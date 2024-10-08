import { useState, useCallback, useEffect, useRef } from "react";

export const useRangeSlider = (
    min,
    max,
    initialMin,
    initialMax,
    onMinChange,
    onMaxChange
) => {
    const [minValue, setMinValue] = useState(initialMin);
    const [maxValue, setMaxValue] = useState(initialMax);
    const rangeRef = useRef(null);
    const trackRef = useRef(null);

    const handleMinChange = useCallback(
        (e) => {
            const value = Math.min(Number(e.target.value), maxValue - 1);
            setMinValue(value);
            onMinChange(value);
        },
        [maxValue, onMinChange]
    );

    const handleMaxChange = useCallback(
        (e) => {
            const value = Math.max(Number(e.target.value), minValue + 1);
            setMaxValue(value);
            onMaxChange(value);
        },
        [minValue, onMaxChange]
    );

    const handleKeyDown = useCallback(
        (e) => {
            const step = 1;
            switch (e.key) {
                case "ArrowLeft":
                case "ArrowDown":
                    e.preventDefault();
                    if (e.target.id === "min-slider") {
                        const newValue = Math.max(minValue - step, min);
                        setMinValue(newValue);
                        onMinChange(newValue);
                    } else {
                        const newValue = Math.max(
                            maxValue - step,
                            minValue + 1
                        );
                        setMaxValue(newValue);
                        onMaxChange(newValue);
                    }
                    break;
                case "ArrowRight":
                case "ArrowUp":
                    e.preventDefault();
                    if (e.target.id === "min-slider") {
                        const newValue = Math.min(
                            minValue + step,
                            maxValue - 1
                        );
                        setMinValue(newValue);
                        onMinChange(newValue);
                    } else {
                        const newValue = Math.min(maxValue + step, max);
                        setMaxValue(newValue);
                        onMaxChange(newValue);
                    }
                    break;
                case "Home":
                    e.preventDefault();
                    if (e.target.id === "min-slider") {
                        setMinValue(min);
                        onMinChange(min);
                    } else {
                        setMaxValue(minValue + 1);
                        onMaxChange(minValue + 1);
                    }
                    break;
                case "End":
                    e.preventDefault();
                    if (e.target.id === "min-slider") {
                        setMinValue(maxValue - 1);
                        onMinChange(maxValue - 1);
                    } else {
                        setMaxValue(max);
                        onMaxChange(max);
                    }
                    break;
                default:
                    break;
            }
        },
        [min, max, minValue, maxValue, onMinChange, onMaxChange]
    );

    useEffect(() => {
        const slider = trackRef.current;
        if (slider && minValue && maxValue) {
            const min = slider.min;
            const max = slider.max;
            const range = max - min;
            const minP = ((minValue - min) / range) * 100;
            const maxP = ((maxValue - min) / range) * 100;

            slider.style.background = `linear-gradient(90deg, #353535 ${minP}%, #1ed760 ${minP}%, #1ed760 ${maxP}%, #353535 ${maxP}%) 100% 100% / 100% 100%`;
        }
    }, [minValue, maxValue]);

    return {
        minValue,
        maxValue,
        handleMinChange,
        handleMaxChange,
        handleKeyDown,
        rangeRef,
        trackRef,
    };
};
