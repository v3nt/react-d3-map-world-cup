// BarChart.js
import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

function BarChart({ width, chartHeight, chartPadding, data }) {
  const ref = useRef();
  const gref = useRef();
  const yAxisRef = useRef();

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", chartHeight)
      .style("border", "1px solid black");
  }, []);

  useEffect(() => {
    draw();
  }, [data]);

  const draw = () => {
    const svg = d3.select(ref.current);
    const yAxis = d3.select(yAxisRef.current);
    const g = d3.select(gref.current).selectAll("rect").data(data);
    var selection = svg;
    var gBars;

    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, chartHeight - chartPadding]);

    var y_axis = d3
      .axisLeft()
      .scale(yScale)
      .tickFormat(function (d, i) {
        return i % 2 === 0 ? d : null;
      });

    yAxis.attr("transform", "translate(" + chartPadding + " , 0)").call(y_axis);

    g.transition()
      .duration(300)
      .attr("height", (d) => yScale(d))
      .attr("y", (d) => chartHeight - yScale(d));

    g.enter()
      .append("rect")
      .attr("x", (d, i) => i * 45)
      .attr("y", (d) => chartHeight)
      .attr("width", 40)
      .attr("height", 0)
      .attr("fill", "orange")
      .transition()
      .duration(300)
      .attr("height", (d) => yScale(d))
      .attr("y", (d) => chartHeight - yScale(d));

    g.exit()
      .transition()
      .duration(300)
      .attr("y", (d) => chartHeight)
      .attr("height", 0)
      .remove();
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

export default BarChart;
