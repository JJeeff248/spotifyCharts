import { useState, useEffect, useCallback } from 'react';
import { useTransition, animated } from 'react-spring';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import './RaceChart.css';

const RaceChart = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let timer;
        if (isPlaying && !isFinished) {
            timer = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    if (prevIndex < data.length - 1) {
                        return prevIndex + 1;
                    } else {
                        setIsPlaying(false);
                        setIsFinished(true);
                        return prevIndex;
                    }
                });
            }, 150);
        }
        return () => clearInterval(timer);
    }, [data, isPlaying, isFinished]);

    const currentData = data[currentIndex] || {};
    
    // Modify the sorting logic to handle ties
    const sortedData = Object.entries(currentData)
        .filter(([key]) => key !== 'date')
        .map(([artist, count]) => ({ artist, count }))
        .sort((a, b) => {
            if (b.count !== a.count) {
                return b.count - a.count;
            }
            // If counts are equal, sort alphabetically by artist name
            return a.artist.localeCompare(b.artist);
        });

    // Take the top 20
    const top20Data = sortedData.slice(0, 20);

    const maxCount = Math.max(...top20Data.map(item => item.count), 1);

    const transitions = useTransition(
        top20Data,
        {
            key: (item) => item.artist,
            from: { width: '0%', opacity: 0 },
            leave: { width: '0%', opacity: 0 },
            enter: ({ count }) => ({ width: `${(count / maxCount) * 80}%`, opacity: 1 }),
            update: ({ count }) => ({ width: `${(count / maxCount) * 80}%` }),
        }
    );

    // Use useCallback to memoize these functions
    const handlePlayPause = useCallback(() => {
        if (isFinished) {
            handlePlayAgain();
        } else {
            setIsPlaying((prevIsPlaying) => !prevIsPlaying);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFinished]);

    const handlePlayAgain = useCallback(() => {
        setCurrentIndex(0);
        setIsPlaying(true);
        setIsFinished(false);
    }, []);

    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }, []);

    let buttonIcon, buttonText;
    if (isFinished) {
        buttonIcon = faRotateRight;
        buttonText = 'Play Again';
    } else {
        buttonIcon = isPlaying ? faPause : faPlay;
        buttonText = isPlaying ? 'Pause' : 'Play';
    }

    return (
        <div style={{ height: '100%', width: '100%', overflow: 'hidden', backgroundColor: '#1e1e1e', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div>
                <button 
                    className="control-button"
                    onClick={handlePlayPause}
                >
                    <FontAwesomeIcon icon={buttonIcon} />
                    <span>{buttonText}</span>
                </button>
                <div style={{ marginTop: '10px', marginBottom: '20px' }}>{formatDate(currentData.date)}</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {transitions((style, item, _, index) => (
                    <div
                        key={`${item.artist}-${index}`}
                        style={{
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '5px',
                        }}
                    >
                        <div style={{ width: '150px', textAlign: 'right', marginRight: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.artist}
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <animated.div style={{
                                height: '100%',
                                backgroundColor: '#1ed760',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '5px',
                                minWidth: '30px',
                                ...style,
                            }}>
                                {item.count}
                            </animated.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

RaceChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
        [PropTypes.string]: PropTypes.number
    })),
};

export default RaceChart;
