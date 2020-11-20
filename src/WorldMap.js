import React from "react";
import * as d3 from "d3";
import axios from "axios";
import "./main.scss";
import Button from "./Button";
import { transform } from "topojson-client";

const margin = 75;
const width = 900 - margin;
const height = 550 - margin;
const chartHeight = 300;

const radius = 2;
// const mySvg = null;
// const path = null;

class WorldMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mySvg: null,
      myChart: null,
      g: null,
      gChart: null,
      path: null,
      map: null,
      svg: this.svg,
      projection: this.projection,
      data: {
        geoData: null,
        cupData: null,
      },
      yAxisAttribute: "skill",
      xAxisAttribute: "attendence",
      width: 0,
      height: 0,
    };

    this.chartRef = React.createRef();
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

          this.setState({
            geoData: responseOne,
            cupData: responseTwo,
          });

          this.createMap({
            geoData: responseOne.data,
            cupData: responseTwo.data,
          });
          this.createChart({
            cupData: responseTwo.data,
          });
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  }

  createChart = (data) => {
    const self = this;

    console.log("createChart");

    ///
    this.svgChart = d3
      .select(this.svg)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + chartHeight + "")
      .attr("width", width)
      .attr("height", chartHeight);

    this.gChart = this.svgChart.append("g").attr("x", 0).attr("y", 0);
    self.gChart = this.gChart;

    // AND IF YOU WANT THE min/max of the KEYS:
    console.log(
      d3.min(data.cupData, function (d) {
        return d.attendance;
      })
    );
    console.log(
      d3.max(data.cupData, function (d) {
        return d.attendance;
      })
    );
    console.log(
      d3.max(data.cupData, function (d) {
        return d.year;
      })
    );

    // var attendanceScale = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(data.cupData, function (d) {
    //       return d.attendance;
    //     }),
    //     d3.max(data.cupData, function (d) {
    //       return d.attendance;
    //     }),
    //   ])
    //   .range([10, 960]);
    // console.log(attendanceScale);

    // var yearsScale = d3
    //   .scaleLinear()
    //   .domain([
    //     d3.min(data.cupData, (d) => {
    //       return d.year;
    //     }),
    //     d3.max(data.cupData, (d) => {
    //       return d.year;
    //     }),
    //   ])
    //   .range([0, 960]);
    // console.log(yearsScale);

    const x = d3.scaleLinear().rangeRound([0, width]);

    const y = d3.scaleLinear().rangeRound([chartHeight, 0]);

    data.cupData.map((d, index) => {
      console.log("import", index, d.year);
    });

    var cupDataSorted = data.cupData.sort(
      (a, b) => parseFloat(a.year) - parseFloat(b.year)
    );

    cupDataSorted.map((d, index) => {
      console.log("Ordered?", index, d.year);
    });

    this.svgChart
      .selectAll("rect")
      .data(data.cupData)
      .enter()
      .append("rect")
      .style("fill", "red")
      .attr("x", (d, i) => i * 1)
      .attr("y", (d, i) => 300 - d.attendance * 0.003)
      .attr("width", 0.5)
      .attr("height", (d, i) => d.attendance * 0.003)
      .attr("attendance", (d) => {
        return d.attendance;
      })
      .attr("year", (d) => {
        return d.year;
      });
  };

  createMap = (data) => {
    const self = this;

    const keyCity = this.keyCity;
    ///
    this.mySvg = d3
      .select(this.svg)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height + "")
      .attr("width", width)
      .attr("height", height);

    this.g = this.mySvg.append("g").attr("x", 0).attr("y", 0);
    self.g = this.g;

    this.mySvg.call(
      d3
        .zoom()
        .scaleExtent([1, 15])
        .on("zoom", function (event) {
          const { transform } = event;
          self.g.attr("transform", transform);
          self.g
            .selectAll("circle")
            .transition()
            .duration(750)
            .attr("r", (d) => transformRadius(transform, d.attendance));
          // .attr("r", radius / (transform.k > 0 ? transform.k * 0.9 : radius));
        })
    );

    const transformRadius = (trans, attendance) => {
      var newRadius =
        attendance && trans.k > 1.5
          ? (0.00005 * attendance) / trans.k
          : 0.00005 * attendance;
      return newRadius;
    };

    this.projection = d3
      .geoMercator()
      .scale(100)
      .translate([width / 2, height / 2]);

    this.path = d3.geoPath().projection(this.projection);

    this.map = this.g
      .selectAll("path")
      .data(data.geoData.features)
      .enter()
      .append("path")
      .attr("data-country", (d) => d.properties.name)
      .attr("d", this.path);

    //works up to here

    const circles = this.g
      .selectAll("circle")
      .data(data.cupData)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.attendance ? 0.00005 * d.attendance : 3))
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
        <Button label="Reset" onClickFunction={this.reset_zoom} />
        <Button label="Fit map" onClickFunction={this.map_zoom} />
        <Button label="Fit markers" onClickFunction={this.map_zoom} />
        <Button label="Fit USA" onClickFunction={this.map_zoom} />
        <Button
          label="zoomed"
          selection="circles"
          onClickFunction={this.zoomed}
        />
        <Button
          label="Attendence > 50000"
          target={"circle"}
          value="50000"
          onClickFunction={this.markers_by_value}
        />

        <div ref={(svg) => (this.svg = svg)}></div>
        <div ref={(keyCity) => (this.keyCity = keyCity)}></div>
      </div>
    );
  }
}
export default WorldMap;
