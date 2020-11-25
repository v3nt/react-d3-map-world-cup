import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";
import BarChart from "./D3BarChart";

const datas = [
  [10, 30, 40, 20],
  [10, 40, 30, 20, 50, 10],
  [60, 30, 40, 20, 30],
];
var i = 0;

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    changeData();
  }, []);

  const changeData = () => {
    setData(datas[i++]);
    if (i === datas.length) i = 0;
  };

  return (
    <div>
      <h2>Graphs with React</h2>
      <button onClick={changeData}>Change Data</button>
      <BarChart
        width={600}
        chartHeight={400}
        chartPadding={30}
        data={data}
        datas={datas}
      />

      {/* <WorldMap /> */}
    </div>
  );
}

export default App;
