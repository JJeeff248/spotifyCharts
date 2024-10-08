import { useEffect, useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
} from "recharts";
import RangeSlider from "../components/RangeSlider/RangeSlider";
import CustomTooltip from "../components/CustomTooltip/CustomTooltip";
import ChartSelector from "../components/ChartSelector/ChartSelector";
import RaceChart from "./RaceChart";

import PropTypes from "prop-types";

const ArtistPlays = ({ data }) => {
    const [counts, setCounts] = useState();
    const [filteredCounts, setFilteredCounts] = useState();
    const [raceData, setRaceData] = useState([]);

    const [selectedMin, setSelectedMin] = useState();
    const [selectedMax, setSelectedMax] = useState();

    const [chartType, setChartType] = useState("bar");

    const sortedCounts = useMemo(() => {
        if (!data) return [];

        const artistCounts = data.reduce((acc, d) => {
            acc[d.artistName] = (acc[d.artistName] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(artistCounts)
            .map(([artistName, count]) => ({ label: artistName, value: count }))
            .sort((a, b) => b.value - a.value);
    }, [data]);

    const processRaceData = useMemo(() => {
        if (!data) return [];

        const artistCounts = {};
        const dateSet = new Set();

        data.forEach((d) => {
            const date = d.endTime.split(" ")[0];
            dateSet.add(date);
            if (!artistCounts[date]) {
                artistCounts[date] = {};
            }
            artistCounts[date][d.artistName] =
                (artistCounts[date][d.artistName] || 0) + 1;
        });

        const sortedDates = Array.from(dateSet).sort(
            (a, b) => new Date(a) - new Date(b)
        );
        const raceData = [];

        let cumulativeCounts = {};

        sortedDates.forEach((date) => {
            Object.entries(artistCounts[date]).forEach(([artist, count]) => {
                cumulativeCounts[artist] =
                    (cumulativeCounts[artist] || 0) + count;
            });

            const dateData = { ...cumulativeCounts, date };
            raceData.push(dateData);
        });

        return raceData;
    }, [data]);

    const minPlays = useMemo(() => {
        return sortedCounts.length
            ? sortedCounts[sortedCounts.length - 1].value
            : 0;
    }, [sortedCounts]);

    const maxPlays = useMemo(() => {
        return sortedCounts.length ? sortedCounts[0].value : 0;
    }, [sortedCounts]);

    useEffect(() => {
        if (sortedCounts.length) {
            if (sortedCounts.length > 100) {
                setSelectedMin(20);
            } else {
                setSelectedMin(minPlays);
            }

            setSelectedMax(maxPlays);
            setCounts(sortedCounts);
        }
    }, [sortedCounts, minPlays, maxPlays]);

    useEffect(() => {
        if (selectedMin && selectedMax && counts) {
            setFilteredCounts(
                counts.filter(
                    (c) => c.value >= selectedMin && c.value <= selectedMax
                )
            );
        }
    }, [selectedMin, selectedMax, counts]);

    useEffect(() => {
        if (data) {
            setRaceData(processRaceData);
        }
    }, [data, processRaceData]);

    const renderChart = () => {
        switch (chartType) {
            case "pie":
                return (
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={filteredCounts}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            fill="#1ed760"
                            label={({ name }) =>
                                filteredCounts?.length < 25
                                    ? `${name}`
                                    : null
                            }
                            labelLine={filteredCounts?.length < 30}
                        />
                    </PieChart>
                );
            case "race":
                return <RaceChart data={raceData} />;
            default:
                // Bar chart is now the default
                return (
                    <BarChart data={filteredCounts}>
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#1ed760" />
                        <XAxis
                            height={130}
                            dataKey="label"
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis
                            label={{
                                value: "Plays",
                                angle: -90,
                                position: "insideleft",
                            }}
                            width={120}
                        />
                    </BarChart>
                );
        }
    };

    return (
        <>
            {counts && (
                <>
                    <ChartSelector
                        chartType={chartType}
                        setChartType={setChartType}
                        types={["bar", "pie", "race"]}
                    />
                    {chartType !== "race" && (
                        <RangeSlider
                            min={minPlays}
                            max={maxPlays}
                            initialMin={selectedMin}
                            initialMax={selectedMax}
                            onMinChange={setSelectedMin}
                            onMaxChange={setSelectedMax}
                        />
                    )}
                    <div id="chart" style={{ height: chartType === "race" ? "min-content" : "50vh" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </>
    );
};

ArtistPlays.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            artistName: PropTypes.string,
            endTime: PropTypes.string,
        })
    ),
};

export default ArtistPlays;