// BarChart.js
import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

function BarChart({ width, chartHeight, chartPadding, data, datas }) {
  const ref = useRef();
  const gref = useRef();
  const yAxisRef = useRef();

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", chartHeight);

    // check whole datas for max value
    // d3.max(datas.map(d => d3.max(d.map(n => n.data1))))
  }, []);

  useEffect(() => {
    // ran when data is loaded or changed
    draw();
  }, [data]);

  const draw = () => {
    const svg = d3.select(ref.current);
    const yAxis = d3.select(yAxisRef.current);
    const g = d3
      .select(gref.current)
      .attr("transform", `translate(${chartPadding}, ${0 - chartPadding})`)
      .selectAll("rect")
      .data(data);
    var selection = svg;
    var gBars;

    // this gets one row of data but should check all from datas to get max value
    //  to avoid the axis changing scale making it hard to compare data
    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(datas, function (d) {
          return d3.max(d);
        }),
      ])
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
