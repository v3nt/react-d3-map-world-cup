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
    console.log("draw", dataD3);
    svg = d3.select(ref.current);
    const yAxis = d3.select(yAxisRef.current);
    const g = d3
      .select(gref.current)
      .attr("transform", `translate(${chartPadding}, ${0 - chartPadding})`)
      .selectAll("rect")
      .data(dataD3.dataSet);

    // this gets one row of data but should check all from datas to get max value
    //  to avoid the axis changing scale making it hard to compare data
    var yScale = d3
      .scaleLinear()
      .domain([100000, 500])
      .range([0, chartHeight - chartPadding - chartPadding]);

    var y_axis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat(function (d, i) {
        return i % 2 === 0 ? d : null;
      });

    yAxis
      .attr(
        "transform",
        "translate(" + chartPadding + " , " + chartPadding + ")"
      )
      .call(y_axis);

    g.transition()
      .duration(300)
      .attr("height", (d) => yScale(d.attendance))
      .attr("y", (d) => chartHeight - yScale(d.attendance));

    g.enter()
      .append("rect")
      .attr("x", (d, i) => i * 4)
      .attr("y", (d) => chartHeight)
      .attr("width", 3)
      .attr("height", 10)
      .attr("fill", "orange")
      .transition()
      .duration(300)
      .attr("height", (d) => yScale(d.attendance))
      .attr("y", (d) => chartHeight - yScale(d.attendance));

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
