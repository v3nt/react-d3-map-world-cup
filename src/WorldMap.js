import React from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

const margin = 75;
const width = 1200 - margin;
const height = 650 - margin;

class WorldMap extends React.Component {
  createMap = (data) => {
    console.log("createMap", data);
    const svg = this.svg;
    const mySvg = d3
      .select(svg)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
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

    const circlesB = mySvg
      .append("g")
      .selectAll("circle")
      .data(data.cupData)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.attendance ? 0.00002 * d.attendance : 1))
      .attr("fill", "red")
      .attr("class", "location-marker")
      .attr("transform", (d) => `translate(${projection([d.long, d.lat])})`);
  };

  componentDidUpdate() {
    const { data } = this.props;
    console.log("componentDidUpdate", data);
    this.createMap(data);
  }

  componentDidMount() {
    const { data } = this.props;
    console.log("componentDidMount", data);
  }

  render() {
    return <div ref={(svg) => (this.svg = svg)}></div>;
  }
}
export default WorldMap;
