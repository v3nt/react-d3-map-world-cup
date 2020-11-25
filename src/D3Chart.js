// D3Chart.js
import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

function D3Chart({
  width,
  chartHeight,
  chartPadding,
  dataD3,
  dataGroup,
  yData,
}) {
  const ref = useRef();
  const gref = useRef();
  const yAxisRef = useRef();
  const xAxisRef = useRef();
  var svg = d3
    .select(ref.current)
    .attr("width", width)
    .attr("height", chartHeight);

  useEffect(() => {
    // draw();
  }, []);

  useEffect(() => {
    // ran when data is loaded or changed
    if (dataD3.dataSet) draw();
  }, [dataD3]);

  const draw = () => {
    svg = d3.select(ref.current);
    const yAxis = d3.select(yAxisRef.current);
    const xAxis = d3.select(xAxisRef.current);

    const g = d3
      .select(gref.current)
      .attr("transform", `translate(${chartPadding}, 0)`)
      .selectAll("rect");
    var yMax, xMin, xMax;

    if (dataGroup) {
      var groups = d3.group(dataD3.dataSet, (d) => d.year);
      yMax = d3.max(groups, function (d) {
        var games = d[1]; // group title is first aray item, then array of grouped items
        const sum = games
          .map((v) => {
            // console.log("yData", `v.${yData}`, v.attendance, v[`${yData}`]);
            return parseInt(v[`${yData}`]);
          })
          .reduce((sum, current) => sum + current, 0);

        // console.log(d[0], sum);

        return isNaN(sum) ? null : sum;
      });

      xMax = d3.max(dataD3.dataSet, function (d) {
        return +d.year;
      });
      xMin = d3.min(dataD3.dataSet, function (d) {
        return +d.year;
      });
    } else {
      xMax = d3.max(dataD3.dataSet, function (d) {
        return +d.year;
      });
      xMin = d3.min(dataD3.dataSet, function (d) {
        return +d.year;
      });

      yMax = d3.max(dataD3.dataSet, function (d) {
        return +d.attendance;
      });
    }
    console.log("yMax", yMax);

    var yScale = d3.scaleLinear().domain([0, yMax]).range([chartHeight, 0]);
    var xScale = d3
      .scaleLinear()
      .domain([1926, xMax + 10])
      .range([0, width - chartPadding]);

    var y_axis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat(function (d, i) {
        return i % 2 === 0 ? d : null;
      });

    var x_axis = d3
      .axisBottom()
      .scale(xScale)
      .tickFormat(function (d, i) {
        return i % 2 === 0 ? d : null;
      });

    yAxis.attr("transform", "translate(" + chartPadding + " , 0)").call(y_axis);
    xAxis.attr("transform", "translate(" + chartPadding + " , 0)").call(x_axis);

    // g.transition()
    //   .duration(300)
    //   .attr("height", (d) => 1)
    //   .attr("y", (d) => 1);
    if (dataGroup) {
      //remove  first
      g.selectAll("g").remove();
      g.data(groups)
        .enter()
        .append("g")
        .attr("data-year", (d) => d[0])
        .attr("data-total-attendance", (d, nodes) => {
          return d[1]
            .map((v) => parseInt(v.attendance))
            .reduce((sum, current) => sum + current, 0);
        })
        .selectAll("rect")
        .data(function (d) {
          return d[1];
        })
        .enter()
        .append("rect")
        .attr("x", (dg, i) => {
          return xScale(dg.year) * 1; // i've spaced these jsut so i can see and incpect them.
        })
        .attr("width", 20)
        .attr("height", function (dg) {
          return Math.ceil(chartHeight - yScale(dg.attendance));
        })
        .attr("y", (dg, i, nodes) => {
          var prevGames = nodes.slice(0, i + 1);

          var sum = prevGames
            .map((v) => parseInt(v.__data__.attendance))
            .reduce((sum, current) => sum + current, 0);

          console.log(sum, yScale(sum));

          return yScale(sum);
        })
        .style("fill", "red");
    } else {
      g.data(dataD3.dataSet)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 3)
        .attr("y", (d) => chartHeight)
        .attr("width", 2)
        .attr("height", 10)
        .attr("data-year", (d) => d.year)
        .attr("data-atten", (d) => d.attendance)
        .attr("fill", "orange")
        .transition()
        .duration(500)
        .attr("height", (d) => {
          return chartHeight - yScale(d.attendance);
        })
        .attr("y", (d) => yScale(d.attendance));
    }

    // g.exit()
    //   .transition()
    //   .duration(300)
    //   .attr("y", (d) => chartHeight)
    //   .attr("height", 0)
    //   .remove();
  };

  return (
    <div className="chart">
      <svg ref={ref}>
        <g ref={gref}></g>
        <g ref={yAxisRef}></g>
        <g ref={xAxisRef}></g>
      </svg>
    </div>
  );
}

export default D3Chart;
