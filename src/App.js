import React, { useState, useEffect } from "react";
import WorldMap from "./WorldMap";

function App() {
  // const [data, setData] = useState({});

  // const getData = () => {
  //   Promise.all([
  //     fetch(
  //       "https://raw.githubusercontent.com/ahebwa49/geo_mapping/master/src/world_countries.json"
  //     ),
  //     fetch(
  //       "https://raw.githubusercontent.com/ahebwa49/geo_mapping/master/src/world_cup_geo.json"
  //     ),
  //   ])
  //     .then((responses) => Promise.all(responses.map((resp) => resp.json())))
  //     .then(function ([geoData, cupData]) {
  //       // console.log([geoData, cupData]);
  //       setData({
  //         geoData: geoData,
  //         cupData: cupData,
  //       });
  //     });
  // };
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div>
      <WorldMap />
    </div>
  );
}

export default App;
