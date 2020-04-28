function buildChart(country,customPopup,ForexData){
    var width = 500;
    var height = 100;
    var margin = {left:50,right:50,top:50,bottom:50};
    var parse = d3.timeParse("%m");
    var format = d3.timeFormat("%b");
    
    var div = d3.create("div").attr("id","svg-div").attr("style","height:370px").attr("style","width:330px")
    var svg = div.append("svg")
      .attr("width", width+margin.left+margin.right)
      .attr("height", height+margin.top+margin.bottom);
    
    var g = svg.append("g").attr("transform","translate("+[margin.left,margin.top]+")");
    var cvdata,cdate;
    var i=0;
    ForexData.forEach(element => {
      if (i==0){
      cvdata=element.rate
      cdate=element.date
      }
      else
      {
        cvdata=cvdata+","+element.rate
        cdate=cdata+","+element.date
      }
      i++
  
    
    });
    
   
  // var xTimeScale = d3.scaleTime()
  //   .domain(d3.extent(smurfData, d => d.date))
  //   .range([0, width]);

  
    //var cvdata = [nl,nc,nr,l,c,r];
    var x = d3.scaleLinear()
    .domain([0, d3.max(cdate, function(d) { return d; }) ])
    .range([height,0]);

    var y = d3.scaleLinear()
      .domain([0, d3.max(cvdata, function(d) { return d; }) ])
      .range([height,0]);
      
    // var yAxis = d3.axisLeft()
    //   .ticks(6)
    //   .scale(y);
    // g.append("g").call(yAxis);
    
    // var x = d3.scaleBand()
    // .domain(d3.range(i))
    // .range([0,210]);
    
    var bottomAxis = d3.axisBottom(x)
    //.tickFormat(d3.timeFormat("%d-%m-%Y-%H:%M:%S"));
  var leftAxis = d3.axisLeft(y);
  
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
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
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale1(d.dow_index));

    
  // var xAxis = d3.axisBottom()
  //   .scale(x)
  //   .tickFormat(function(d, i) { if(i==0){return "New Loss";} if(i==1){return "New Losses";}if(i==1){return "New Cases";}if(i==2){return "New Recovery";}if(i==3){return "Losses";}if(i==4){return "Cases";}if(i==5){return "Recovered";}});
    
  // g.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis)
  //     .selectAll("text")
  //     .attr("text-anchor","end")
  //     .attr("transform","rotate(-90)translate(-12,-15)")
    
  // var line = g.selectAll("line")
  //   .data(cvdata)
  //   .enter()
  //   .append("line")
  //   .attr("y",height)
  //   .attr("height",0)
  //   .attr("width",15)
  //   .attr("x", function(d,i) { return x(i); })
  //   .attr("fill","steelblue")
  //   .transition()
  //   .attr("height", function(d) { return height-y(d); })
  //   .attr("y", function(d) { return y(d); })
  //   .duration(1000);
    
  var title = svg.append("text")
    .style("font-size", "12px")
    .text("Forex Statistics - " + country)
    .attr("x", margin.left)
    .attr("y", 30)

    div.append("div").attr("class","popupdiv").attr("style","margin-top:200px;").html(customPopup);
    return div.node();
    
  }