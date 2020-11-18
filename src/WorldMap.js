import React from "react";
import * as d3 from "d3";
import axios from "axios";
import "./main.scss";
import Button from "./Button";

const margin = 75;
const width = 900 - margin;
const height = 550 - margin;

class WorldMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        geoData: null,
        cupData: null,
      },
    };
  }

  createMap = (data) => {
    console.log("createMap", data);
    const svg = this.svg;
    const keyCity = this.keyCity;
    ///
    const mySvg = d3
      .select(svg)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height + "")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("x", 0)
      .attr("y", 0);

    const projection = d3
      .geoMercator()
      .scale(100)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const map = mySvg
      .selectAll("path")
      .data(data.geoData.features)
      .enter()
      .append("path")
      .attr("data-country", (d) => d.properties.name)
      .attr("d", path);

    //works up to here

    const circles = mySvg
      .selectAll("circle")
      .data(data.cupData)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.attendance ? 0.00005 * d.attendance : 1))
      .attr("fill", "yellow")
      .attr("class", "location-marker")
      .attr("transform", (d) => `translate(${projection([d.long, d.lat])})`);

    // const circlesB = mySvg
    //   .append("g")
    //   .selectAll("circle")
    //   .data(data.cupData)
    //   .enter()
    //   .append("circle")
    //   .attr("r", (d) => (d.attendance ? 0.00002 * d.attendance : 1))
    //   .attr("fill", "red")
    //   .attr("class", "location-marker")
    //   .attr("transform", (d) => `translate(${projection([d.long, d.lat])})`);
  };

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  componentDidMount() {
    console.log("componentDidMount");

    let one =
      "https://raw.githubusercontent.com/ahebwa49/geo_mapping/master/src/world_countries.json";
    let two =
      "https://raw.githubusercontent.com/ahebwa49/geo_mapping/master/src/world_cup_geo.json";

    const requestOne = axios.get(one);
    const requestTwo = axios.get(two);
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          this.setState({
            geoData: responseOne,
            cupData: responseTwo,
          });

          this.createMap({
            geoData: responseOne.data,
            cupData: responseTwo.data,
          });
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  }

  map_zoom = (test) => {
    console.log("map zoom", test);
  };

  render() {
    return (
      <div>
        <div ref={(svg) => (this.svg = svg)}>
          <Button label="Fit map" onClickFunction={this.map_zoom} />
          <Button label="Fit markers" onClickFunction={this.map_zoom} />
          <Button label="Fit USA" onClickFunction={this.map_zoom} />
        </div>
        <div ref={(keyCity) => (this.keyCity = keyCity)}></div>
      </div>
    );
  }
}
export default WorldMap;
