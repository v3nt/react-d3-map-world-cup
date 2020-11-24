// import React from "react";
// import * as d3 from "d3";

// function createChart = (data) => {
//   const self = this;
//   const cupData = data.cupData;
//   var cupDataSorted = cupData.sort(
//     (a, b) => parseFloat(a.year) - parseFloat(b.year)
//   );

//   this.svgChart = d3
//     .select(this.svg)
//     .append("svg")
//     .attr("viewBox", "0 0 " + width + " " + chartHeight + "")
//     .attr("width", width)
//     .attr("height", chartHeight);

//   console.log("createChart");

//   this.gChart = this.svgChart.append("g").attr("x", 0).attr("y", 0);
//   self.gChart = this.gChart;

//   var yMax = d3.max(cupDataSorted, function (d) {
//     return +d.attendance;
//   });

//   //

//   var xMax = d3.max(cupDataSorted, function (d) {
//     return +d.year;
//   });
//   var xMin = d3.min(cupDataSorted, function (d) {
//     return +d.year;
//   });

//   var xscale = d3
//     .scaleLinear()
//     .domain([
//       1926,
//       d3.max(cupDataSorted, function (d) {
//         return d.year;
//       }),
//     ])
//     .range([0, width - 100]);

//   var yscale = d3
//     .scaleLinear()
//     .domain([0, yMax])
//     .range([chartHeight - 25, 0]);

//   var x_axis = d3
//     .axisBottom()
//     .scale(xscale)
//     .tickFormat(function (d, i) {
//       return i % 4 === 0 ? d : null;
//     })
//     .ticks((xMax - xMin) * 1);

//   var y_axis = d3
//     .axisLeft()
//     .scale(yscale)
//     .tickFormat(function (d, i) {
//       return i % 2 === 0 ? d : null;
//     });

//   this.svgChart.append("g").attr("transform", "translate(50, 0)").call(y_axis);

//   var xAxisTranslate = chartHeight - 25;

//   this.svgChart
//     .append("g")
//     .attr("transform", "translate(50, " + xAxisTranslate + ")")
//     .call(x_axis);

//   this.svgChart
//     .append("g")
//     .attr("transform", "translate(50, 25)")
//     .selectAll("rect")
//     .data(cupDataSorted)
//     .enter()
//     .append("rect")
//     .style("fill", "red")
//     .attr("x", (d, i) => (d.year ? xscale(d.year) * 1 : 0))
//     .attr("y", (d, i) => (d.attendance ? yscale(d.attendance) - 25 : 0))
//     .attr("width", 2)
//     .attr("height", (d, i) =>
//       d.attendance ? chartHeight - 25 - yscale(d.attendance) : 0
//     )
//     .attr("gamid", (d) => d.game_id)
//     .attr("attendance", (d) => d.attendance)
//     .attr("year", (d) => d.year)
//     .attr("team1", (d) => d.team1)
//     .attr("team2", (d) => d.team2)
//     .attr("home", (d) => d.home)
//     .attr("goals", (d) => d.goals);
// };

// export default d3Chart;
