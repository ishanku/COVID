// Chart Params
var url=servername + "/static/data/final_oil_cases.csv"
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

function transition(path) {
  path.transition()
      .duration(5000)
      .attrTween("stroke-dasharray", tweenDash);
}
function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function (t) { return i(t); };
}

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
chartGroup.append("text")
  .attr("x", width/4)
  .attr("font-family", "sans-serif")
  .attr("font-weight", 700)
  .attr("text-align", "center")  
  .style("font-size", "16px") 
  .style("text-decoration", "underline")
  .classed("white", true)
  .text("Trend of Crude Oil and Natural Gas prices during COVID Pandemic");

  // gridlines in x axis function
function make_x_gridlines() {   
  return d3.axisBottom(x)
      .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {   
  return d3.axisLeft(y)
      .ticks(5)
}
// Import data from an external CSV file
d3.csv(url).then(function(oildata) {
  //console.log(oildata);
  var parseTime = d3.timeParse("%m/%d/%y");
  // Format the data
  oildata.forEach(function(data) {
    data.Date = parseTime(data.Date);
    //console.log(data.Date)
    data.Crude = +data.Crude;
    data.NaturalGas = +data.NaturalGas;
    data.Cases = +data.Cases;
    data.Month = +data.Month;
  });

  // Create scaling functions
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(oildata, d => d.Date))
    .range([0, width]);
  
  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(oildata, d => d.Crude)])
    .range([height, 0]);
  
  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(oildata, d => d.NaturalGas)])
    .range([height, 0]);

  
  // Bubble Size
  var x = d3.scaleTime()
    .domain(d3.extent(oildata, d => d.Date))
    .range([0, width -1 ]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(oildata, d => d.Crude)])
    .range([height, 0]);

  var z = d3.scaleLinear()
    .domain([0, 2433048])
    .range([2, 8]);
  
  
  var myColor = d3.scaleOrdinal()
    .domain(["11/01/19", "12/01/19", "01/01/20", "02/01/20", "03/01/20", "04/01/20"])
    .range(d3.schemeSet1);

  // var myColor = d3.scaleOrdinal()
  // .domain(["November", "December", "January", "February", "March", "April" ])
  // .range(["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"])
  // svg.selectAll(".secondrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 150).attr("r", 19).attr("fill", function(d){return myColor(d) })
  
  // Create axis functions
  var bottomAxis = d3.axisBottom(xTimeScale)
    .tickFormat(d3.timeFormat("%m/%d/%y"));
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);
  // var topAxis = d3.axisTop(x)


  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .classed("lightblue", true)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Add y2-axis to the right side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("blue", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);



  // Line generators for each line
  var line1 = d3.line()
    .x(d => xTimeScale(d.Date))
    .y(d => yLinearScale1(d.Crude));

  var line2 = d3.line()
    .x(d => xTimeScale(d.Date))
    .y(d => yLinearScale2(d.NaturalGas));

  // Append a path for line1
  chartGroup.append("path")
    .data([oildata])
    .attr("d", line1)
    .classed("line green", true)
    .call(transition);


  // Append a path for line2
  chartGroup.append("path")
    .data([oildata])
    .attr("d", line2)
    .classed("line blue", true)
    .call(transition);

  // Append axes titles
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("crude-text text", true)
    .text("Crude Oil Prices (USD)");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("naturalgas-text text", true)
    .text("Natural Gas Prices (USD)");

  
  chartGroup.selectAll(".dot")
   .data(oildata)
   .enter()
   .append("circle")
     .attr("class", function(d) { return "bubbles " + d.Month })
     .attr("cx", function (d) { return x(d.Date); } )
     .attr("cy", function (d,i) { return y(35); } )
     .attr("r", function (d) { return z(d.Cases); } )
     .call(transition)
     .style("fill", "red" )
     //.style("fill", function (d) { return myColor(); } )
     .style("stroke",  "pink" )
     .style("opacity", function (d,i) { return (0.2 * (i/2)); });
     

  chartGroup.append("g")
     .attr("class","grid")
     .attr("transform","translate(0," + height + ")")
     .style("stroke-dasharray",("3,3"))
     .call(make_x_gridlines()
           .tickSize(-height)
           .tickFormat("")
        )
  chartGroup.append("g")
     .attr("class","grid")
     .style("stroke-dasharray",("3,3"))
     .call(make_y_gridlines()
           .tickSize(-width)
           .tickFormat("")
        )

}).catch(function(error) {
  console.log(error);
});