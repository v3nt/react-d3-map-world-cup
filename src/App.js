import React, { useState, useEffect } from "react";
import axios from "axios";
//
import WorldMap from "./WorldMap";
import D3Chart from "./D3Chart";

const CUP_DATA =
  "https://raw.githubusercontent.com/ahebwa49/geo_mapping/master/src/world_cup_geo.json";

const docMargins = 30;

function App() {
  // const [data, setData] = useState([5, 10, 15, 30]);
  const [dataD3, setDataD3] = useState([]);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
    widthUsed: window.innerWidth - docMargins * 2,
  });

  useEffect(() => {
    const fatchData = async () => {
      try {
        setDataD3({ dataSet: dataD3.dataSet, isFetching: true });
        const response = await axios.get(CUP_DATA);

        var cupDataSorted = response.data.sort(
          (a, b) => parseFloat(a.year) - parseFloat(b.year)
        );

        setDataD3({ dataSet: cupDataSorted, isFetching: false });
      } catch (e) {
        setDataD3({ dataSet: dataD3.dataSet, isFetching: false });
      }
    };
    fatchData();

    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
        widthUsed: window.innerWidth - docMargins * 2,
      });
    }

    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <h1>D3 data experiments</h1>
      <p>World cup data 1930 — 2014</p>
      <WorldMap width={dimensions.widthUsed} />

      <h2>Various charts from the same data</h2>
      <h3>`Attendance` grouped by `year`</h3>
      <D3Chart
        width={900}
        chartHeight={400}
        chartPadding={55}
        dataD3={dataD3}
        dataGroup="year"
        yData="attendance"
      />
      <h3>Attendance for every game</h3>
      <D3Chart
        width={900}
        chartHeight={400}
        chartPadding={55}
        dataD3={dataD3}
      />
    </div>
  );
}

export default App;
