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
    .range([chartHeight - 25, 0]);

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

  this.svgChart.append("g").attr("transform", "translate(50, 0)").call(y_axis);

  var xAxisTranslate = chartHeight - 25;

  this.svgChart
    .append("g")
    .attr("transform", "translate(50, " + xAxisTranslate + ")")
    .call(x_axis);

  if (!data.groupBy) {
    this.svgChart
      .append("g")
      .attr("transform", "translate(50, 25)")
      .selectAll("rect")
      .data(cupDataSorted)
      .enter()
      .append("rect")
      .style("fill", "red")
      .attr("x", (d, i) => (d.year ? xscale(d.year) * 1 : 0))
      .attr("y", (d, i) => (d.attendance ? yscale(d.attendance) - 25 : 0))
      .attr("width", 2)
      .attr("height", (d, i) =>
        d.attendance ? chartHeight - 25 - yscale(d.attendance) : 0
      )
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
      .attr("transform", "translate(50, 0)")
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
      .attr("x", (d, i) => xscale(d.year))
      .attr("y", function (d, i) {
        return yscale(d.attendance);
      })
      .attr("height", function (d, i) {
        return yscale(d.attendance);
      })
      .attr("width", 10)
      .attr("stroke", "grey");
  }
};
