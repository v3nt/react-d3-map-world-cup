import React from "react";
import * as d3 from "d3";
import axios from "axios";
import "./main.scss";
import Button from "./Button";

const margin = 75;
const width = 900 - margin;
const height = 550 - margin;

const radius = 2;
// const mySvg = null;
// const path = null;

class WorldMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mySvg: null,
      path: null,
      map: null,
      svg: this.svg,
      data: {
        geoData: null,
        cupData: null,
      },
    };
  }

  createMap = (data) => {
    console.log("createMap", data);

    const keyCity = this.keyCity;
    ///
    this.mySvg = d3
      .select(this.svg)
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

    this.path = d3.geoPath().projection(projection);

    this.map = this.mySvg
      .selectAll("path")
      .data(data.geoData.features)
      .enter()
      .append("path")
      .attr("data-country", (d) => d.properties.name)
      .attr("d", this.path);

    //works up to here

    const circles = this.mySvg
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

  zoomed = (event) => {
    const { transform } = event;
    console.log(event);

    // this.mySvg.select("g").attr("transform", transform);
    // // this.mySvg.select("g").attr("stroke-width", 1 / transform.k);
    // this.mySvg
    //   .selectAll("circle")
    //   .attr("d", this.path)
    //   .attr("r", radius / (transform.k > 0 ? transform.k * 0.9 : radius));
    // g.selectAll("path").attr("stroke-width", 1 / transform.k);
  };

  map_zoom = (test) => {
    console.log("map zoom", test);
    // this.map.transition().duration(750).call(d3.zoom().on("zoom", this.zoomed));
    // this.mySvg = d3
    //   .select(this.svg)
    //   .append("svg")
    //   .attr("viewBox", "0 0 " + width + " " + height + "")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .append("g")
    //   .attr("x", 0)
    //   .attr("y", 0);
    this.mySvg = d3
      .select(this.svg)
      .selectAll("circle")
      .attr("fill", "red")
      .call(d3.zoom().on("zoom", this.zoomed));
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
