import React, { useState, useEffect } from "react";
import axios from "axios";
//
import WorldMap from "./WorldMap";
import BarChart from "./D3BarChart";
import D3Chart from "./D3Chart";

const datas = [
  [10, 30, 40, 20],
  [10, 40, 30, 20, 50, 10],
  [60, 30, 40, 20, 30],
];
var i = 0;

const CUP_DATA =
  "https://raw.githubusercontent.com/ahebwa49/geo_mapping/master/src/world_cup_geo.json";

function App() {
  const [data, setData] = useState([5, 10, 15, 30]);
  const [dataD3, setDataD3] = useState([]);

  useEffect(() => {
    changeData();

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
  }, []);

  const changeData = () => {
    setData(datas[i++]);

    if (i === datas.length) i = 0;
  };

  return (
    <div>
      <h2>Graphs with React</h2>

      <D3Chart
        width={900}
        chartHeight={400}
        chartPadding={45}
        dataD3={dataD3}
      />
      <button onClick={changeData}>Change Data</button>
      {/* <BarChart
        width={600}
        chartHeight={400}
        chartPadding={40}
        data={data}
        datas={datas}
      /> */}

      <WorldMap />
    </div>
  );
}

export default App;
