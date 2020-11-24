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
          console.log("axios loaded");
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
            groupBy: "year",
          });
        })
      )
      .catch((errors) => {
        // react on errors.
      });
  }

  createChart = (data) => {
    const self = this;
    const cupData = data.cupData;
    var cupDataSorted = cupData.sort(
      (a, b) => parseFloat(a.year) - parseFloat(b.year)
    );

    this.svgChart = d3
      .select(this.svg)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + chartHeight + "")
      .attr("width", width)
      .attr("height", chartHeight);

    console.log("createChart");

    this.gChart = this.svgChart.append("g").attr("x", 0).attr("y", 0);
    self.gChart = this.gChart;

    //grouping start
    if (data.groupBy) {
      console.log("data.groupBy", data.groupBy);
      var groups = d3.group(cupDataSorted, (d) => d.year);

      var yMax = d3.max(groups, function (d) {
        // console.log(d);
        var games = d[1]; // group title is first aray item, then array of grouped items
        const sum = games
          .map((v) => parseInt(v.attendance))
          .reduce((sum, current) => sum + current, 0);

        // console.log(d[0], sum);

        return isNaN(sum) ? null : sum;
      });

      console.log("yMax", yMax);

      var y = d3.scaleLinear().domain([0, yMax]).range([chartHeight, 0]);
    } else {
      var yMax = d3.max(cupDataSorted, function (d) {
        return +d.attendance;
      });
    }

    //

    var xMax = d3.max(cupDataSorted, function (d) {
      return +d.year;
    });
    var xMin = d3.min(cupDataSorted, function (d) {
      return +d.year;
    });

    var xscale = d3
      .scaleLinear()
      .domain([
        1926,
        d3.max(cupDataSorted, function (d) {
          return d.year;
        }),
      ])
      .range([0, width - 100]);

    var yscale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([chartHeight - chartPadding, 0]);

    var x_axis = d3
      .axisBottom()
      .scale(xscale)
      .tickFormat(function (d, i) {
        return i % 4 === 0 ? d : null;
      })
      .ticks((xMax - xMin) * 1);

    var y_axis = d3
      .axisLeft()
      .scale(yscale)
      .tickFormat(function (d, i) {
        return i % 2 === 0 ? d : null;
      });

    this.svgChart
      .append("g")
      .attr("transform", "translate(50, 0)")
      .call(y_axis);

    var xAxisTranslate = chartHeight - chartPadding;

    this.svgChart
      .append("g")
      .attr("transform", "translate(50, " + xAxisTranslate + ")")
      .call(x_axis);

    if (!data.groupBy) {
      this.svgChart
        .append("g")
        .attr("transform", "translate(50, 0)")
        .selectAll("rect")
        .data(cupDataSorted)
        .enter()
        .append("rect")
        .style("fill", "red")
        .attr("x", (d, i) => (d.year ? xscale(d.year) * 1 : 0))
        .attr("y", (d, i) => (d.attendance ? yscale(d.attendance) : 0))
        .attr("width", 2)
        .attr("height", (d, i) => (d.attendance ? yscale(d.attendance) : 0))
        .attr("gamid", (d) => d.game_id)
        .attr("attendance", (d) => d.attendance)
        .attr("year", (d) => d.year)
        .attr("team1", (d) => d.team1)
        .attr("team2", (d) => d.team2)
        .attr("home", (d) => d.home)
        .attr("goals", (d) => d.goals);
    } else {
      // grouped stacked bars
      // set y value
      this.svgChart
        .append("g")
        .attr("transform", "translate(50, -25)")
        .selectAll("g")
        .data(groups)
        .enter()
        .append("g")
        .attr("data-year", (d) => d[0])
        .attr("fill", "orange")
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) {
          return d[1];
        })
        .enter()
        .append("rect")
        .attr("x", (dg, i) => {
          return xscale(dg.year) + i * 2;
        })
        .attr("y", (dg, i, nodes) => {
          var prevY,
            prevH,
            newY,
            currY = chartHeight - yscale(dg.attendance),
            currH = yscale(dg.attendance),
            prevSibData = i > 0 ? nodes[i - 1].__data__ : 0;

          prevY = i > 0 ? yscale(prevSibData.attendance) : 0;
          prevH = i > 0 ? chartHeight - yscale(prevSibData.attendance) : 0;

          newY = currH - prevH;

          console.log(i, currH, prevH, newY);

          return newY;
        })
        .attr("height", function (dg) {
          return chartHeight - yscale(dg.attendance);
        })
        .attr("width", 3);
    }
  };

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
