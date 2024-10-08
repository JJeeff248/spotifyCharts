import "./App.css";
import { useEffect, useState } from "react";

import ArtistPlays from "./charts/ArtistPlays";

function App() {
    const [dataFiles, setDataFiles] = useState([]);
    const [data, setData] = useState();
    const [showCounts, setShowCounts] = useState(false);

    useEffect(() => {
        dataFiles.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");
            fileReader.onload = (e) => {
                setData(JSON.parse(e.target.result));
            };
        });
    }, [dataFiles]);

    return (
        // greet user
        <div className="App">
            <h1>Hello!</h1>

            <input
                type="file"
                accept=".json"
                multiple
                onChange={(e) => {
                    setDataFiles([...Array.from(e.target.files)]);
                }}
            />

            <button onClick={() => setShowCounts(!showCounts)}>
                {showCounts ? "Hide counts" : "Show counts"}
            </button>

            {/* plot data */}
            {showCounts && <ArtistPlays data={data} />}
        </div>
    );
}

export default App;
