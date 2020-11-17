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

    // const nested = d3
    //   .group()
    //   .key((d) => d.year)
    //   .rollup((leaves) => {
    //     const total = d3.sum(leaves, (d) => d.attendance);
    //     const coords = leaves.map((d) => projection([+d.long, +d.lat]));
    //     const center_x = d3.mean(coords, (d) => d[0]);
    //     const center_y = d3.mean(coords, (d) => d[1]);
    //     return {
    //       attendance: total,
    //       x: center_x,
    //       y: center_y,
    //     };
    //   })
    //   .entries(data.cupData);

    const circles = mySvg
      .selectAll("circle")
      .data(data.cupData)
      .enter()
      .append("circle")
      .attr("r", (d) => 0.00005 * d.attendance)
      .attr("fill", "yellow")
      .attr("class", "location-marker")
      .attr("transform", (d) => `translate(${projection([d.long, d.lat])})`);

    const circlesB = mySvg
      .append("g")
      .selectAll("circle")
      .data(data.cupData)
      .enter()
      .append("circle")
      .attr("r", (d) => 0.00002 * d.attendance)
      .attr("fill", "red")
      .attr("class", "location-marker")
      .attr("transform", (d) => `translate(${projection([d.long, d.lat])})`);

    // const attendance_extent = d3.extent(nested, (d) => d.value["attendance"]);
    // const rScale = d3.scaleSqrt().domain(attendance_extent).range([0, 8]);
    // svg
    //   .append("g")
    //   .attr("class", "bubble")
    //   .selectAll("circle")
    //   .data(
    //     nested.sort(function (a, b) {
    //       return b.value["attendance"] - a.value["attendance"];
    //     })
    //   )
    //   .enter()
    //   .append("circle")
    //   .attr("fill", "rgb(247, 148, 42)")
    //   .attr("cx", (d) => d.value["x"])
    //   .attr("cy", (d) => d.value["y"])
    //   .attr("r", (d) => rScale(d.value["attendance"]))
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 0.7)
    //   .attr("opacity", 0.7);
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
    return (
      <div>
        <p> "test comp here"</p>
        <div ref={(svg) => (this.svg = svg)}></div>
      </div>
    );
    // const { data } = this.props;
    // const styles = {
    //   container: {
    //     display: "grid",
    //     justifyItems: "center",
    //   },
    // };
    // return (
    //   <div ref="chart" style={styles.container}>
    //     <p style={{ textAlign: "center" }}>
    //       Historical FIFA world cup geo map with React and D3.
    //     </p>
    //   </div>
    // );
  }
}
export default WorldMap;
