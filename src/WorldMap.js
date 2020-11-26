import React from "react";
import * as d3 from "d3";
import axios from "axios";
import "./main.scss";
import Button from "./Button";
import { transform } from "topojson-client";

const width = 900;
const height = 350;
const chartHeight = 400;
const chartPadding = 30;
// const mySvg = null;
// const path = null;

class WorldMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mySvg: null,
      circles: null,
      g: null,
      path: null,
      map: null,
      svg: this.svg,
      projection: this.projection,
      data: {
        geoData: null,
        cupData: null,
      },
      width: 0,
      height: 0,
      cupData: null,
      zoom: null,
    };
  }

  componentDidUpdate() {}

  componentDidMount() {
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
          console.log("axios loaded");
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

  createMap = (data) => {
    const self = this;

    ///
    this.mySvg = d3
      .select(this.svg)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height + "")
      .attr("width", width)
      .attr("height", height);

    this.g = this.mySvg.append("g").attr("x", 0).attr("y", 0);
    self.g = this.g;
    var zoomObject = d3.zoom().scaleExtent([1, 15]).on("zoom", this.zoomed);
    this.mySvg.call(zoomObject);

    this.projection = d3
      .geoMercator()
      .scale(100)
      .translate([width / 2, height / 2]);

    this.path = d3.geoPath().projection(this.projection);

    this.g
      .selectAll("path")
      .data(data.geoData.features)
      .enter()
      .append("path")
      .attr("data-country", (d) => d.properties.name)
      .attr("d", this.path);

    //works up to here

    this.g
      .selectAll("circle")
      .data(data.cupData)
      .enter()
      .append("circle")
      .attr("r", (d) => 0)
      .attr("gamid", (d) => d.game_id)
      .attr("year", (d) => d.year)
      .attr("team1", (d) => d.team1)
      .attr("team2", (d) => d.team2)
      .attr("goals", (d) => d.goals)
      .attr("fill", "yellow")
      .attr("class", "location-marker")
      .attr(
        "transform",
        (d) => `translate(${this.projection([d.long, d.lat])})`
      );

    this.g
      .selectAll("circle")
      .transition()
      .duration(750)
      .attr("r", (d) => (d.attendance ? 0.00004 * d.attendance : 1));
  };

  filterMarkers = (params) => {
    var initData = this.state.cupData.data;
    var filteredData, groupedData;
    var g = this.g;
    g.selectAll("circle").data(
      (filteredData = initData.filter(function (d) {
        return d.team1 == "Chile";
      }))
    );
    groupedData = d3.group(filteredData, (d) => d.team1);

    // console.log(initData, filteredData, groupedData);
    g.selectAll("circle").remove();
    g.selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("r", (d) => 0)
      .attr("fill", "red")
      .attr("class", "location-marker")
      .attr("class", "marker-filtered")
      .attr("year", (d) => d.year)
      .attr("team1", (d) => d.team1)
      .attr("team2", (d) => d.team2)
      .attr(
        "transform",
        (d) => `translate(${this.projection([d.long, d.lat])})`
      );

    g.selectAll("circle")
      .transition()
      .duration(750)
      .attr("r", (d) => 5);

    this.mySvg.call(d3.zoom().scaleExtent([1, 15]).on("zoom", this.zoomed));
  };
  zoomed = (event) => {
    const transform = event.transform;
    var g = this.g;
    g.attr("transform", transform);
    g.selectAll("circle")
      .transition()
      .duration(300)
      // .attr("r", (d) => transformRadius(transform, d.attendance));
      .attr("r", 5 / transform.k);
  };

  transformRadius = (trans, attendance) => {
    var newRadius =
      attendance && trans.k > 1.5
        ? (0.00005 * attendance) / trans.k
        : 0.00005 * attendance;
    return newRadius;
  };

  reset_zoom = () => {
    this.g.transition().duration(200).attr("transform", { k: 0, x: 0, y: 0 });
  };

  map_zoom = (props) => {
    console.log("map zoom", props.test);
    // this.map.transition().duration(750).call(d3.zoom().on("zoom", this.zoomed));

    d3.select(this.svg)
      .selectAll("circle")
      .attr("fill", "red")
      .call(d3.zoom().on("zoom", this.zoomed));
  };
  map_zoom_to = (props) => {
    this.zoomToMarkers("circle");
  };

  markers_by_value = (props) => {
    d3.selectAll(props.target)
      .filter(function (d) {
        return d.attendance > props.value;
      })
      .attr("fill", "green");
  };

  zoomToMarkers = (params) => {
    this.mySvg.call(this.zoomed);
    this.mySvg.call(
      this.zoom.transform,
      d3.zoomIdentity
        .translate(
          this.projection.translate()[0],
          this.projection.translate()[1]
        )
        .scale(this.projection.scale())
    );
  };

  render() {
    return (
      <div>
        <p>
          <Button label="Reset" onClickFunction={this.reset_zoom} />
          <Button
            label="Attendence > 50000"
            target={"circle"}
            value="50000"
            onClickFunction={this.markers_by_value}
          />
          <Button label="Filter by" onClickFunction={this.filterMarkers} />
        </p>

        <div ref={(svg) => (this.svg = svg)}></div>
        <div ref={(keyCity) => (this.keyCity = keyCity)}></div>
      </div>
    );
  }
}
export default WorldMap;
