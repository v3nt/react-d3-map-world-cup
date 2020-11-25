// D3Chart.js
import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

function D3Chart({ width, chartHeight, chartPadding, dataD3 }) {
  const ref = useRef();
  const gref = useRef();
  const yAxisRef = useRef();
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
    const g = d3
      .select(gref.current)
      .attr("transform", `translate(${chartPadding}, 0)`)
      .selectAll("rect")
      .data(dataD3.dataSet);

    // this gets one row of data but should check all from datas to get max value
    //  to avoid the axis changing scale making it hard to compare data
    var yMax = d3.max(dataD3.dataSet, function (d) {
      return +d.attendance;
    });

    // console.log("yMax", yMax);

    var yScale = d3.scaleLinear().domain([0, yMax]).range([chartHeight, 0]);

    var y_axis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat(function (d, i) {
        return i % 2 === 0 ? d : null;
      });

    yAxis.attr("transform", "translate(" + chartPadding + " , 0)").call(y_axis);

    g.transition()
      .duration(300)
      .attr("height", (d) => 1)
      .attr("y", (d) => 1);

    g.enter()
      .append("rect")
      .attr("x", (d, i) => i * 3)
      .attr("y", (d) => chartHeight)
      .attr("width", 2)
      .attr("height", 10)
      .attr("data-year", (d) => d.year)
      .attr("data-atten", (d) => d.attendance)
      .attr("fill", "orange")
      .transition()
      .duration(1000)
      .attr("height", (d) => {
        // console.log(yScale(d.attendance), d.year);
        return chartHeight - yScale(d.attendance);
      })
      .attr("y", (d) => yScale(d.attendance));

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
      </svg>
    </div>
  );
}

export default D3Chart;
