//renderAll(c19data,countrydata,covidall);

function getRadius(radius,population,key){
    var rradius=5;
    if (key=="loss")
     {
       if (radius>10000){
         rradius=10;
       }
       else if (radius>1000){
         rradius=5;
       }
       else
       {
         radius=2;
       }
      }
    if (key=="case")
    {
      if (radius>100000){
        rradius=14;
      }
      else if (radius>50000){
        rradius=10;
      }
      else if (radius>1000)
      {
        radius=5;
      }
      else 
      {
        radius=2;
      }
    }
    return rradius;
  }
  
  function ChooseColor(value,population,key){
    var color="white";
    if (key=="loss"){
      if (value>1000)
      {
        color="black"
      }
      else{
        color="red"
      }
    }
    if (key=="case")
    {
      if (value>100000)
      {
        color="orange";
      }
      else if (value>50000)
      {
        color="yellow";
      }
      else if (value>1000){
        color="blue";
      }
      else{
        color="lightblue";
      }
  
    }
    return color;
  }
  
  function renderWorld(covidall){
  d3.json(covidall, function(response) {
    // console.log("welcome again")
    // console.log(response);
    let CovidData=response.data;
    //console.log(CovidData);
    // let currentCountry=CovidData[0].countriesAndTerritories;
    // d3.json(covid19,(data)=>{
    //   console.log(data);
    // })
    // d3.json(countrydata, function(cdata) {
    //   //console.log(cdata);
    //   let GeoCoordinates=cdata;
  
      buildLayers(CovidData);
      });
  
   // });
  
  }
  
  function buildLayers(CovidData){
  console.log(CovidData);
  CovidData.forEach((covidReport) => {
    var region=covidReport.region
    var province=region.province;
    var allcities=covidReport.region.cities;    
    cases =  parseInt(covidReport.confirmed);
    losses = parseInt(covidReport.deaths);
    var newcases= parseInt(covidReport.confirmed_diff);
    var newlosses=parseInt(covidReport.deaths_diff);
    var newrecovery=parseInt(covidReport.recovered_diff);
    var recovered=parseInt(covidReport.recovered);
    var fatality=parseInt(covidReport.fatality_rate);
    var ISO = region.iso
    var country=region.name;
    var latitude=region.lat;
    var longitude= region.long;
    var cdate=covidReport.date;
    var population=0;
  
    var customPopup = "<h3>" + country + "</h3><h5>" + province + "</h5><hr><p>Date:" + cdate + "</p><hr><p>New Losses: +" + newlosses + "</p><p>Total Losses: +"  + losses + "</p><p>New Cases: "+ newcases + "</p><p>Total Cases: +"+ cases + "</p>";
    function buildChart(nl,nc,nr,l,c,r){
      var width = 500;
      var height = 100;
      var margin = {left:50,right:50,top:50,bottom:50};
      var parse = d3.timeParse("%m");
      var format = d3.timeFormat("%b");
      
      var div = d3.create("div").attr("id","svg-div").attr("style","height:330px").attr("style","width:330px")
      var svg = div.append("svg")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom);
      
      var g = svg.append("g").attr("transform","translate("+[margin.left,margin.top]+")");
      
      var cvdata = [nl,nc,nr,l,c,r];
      var y = d3.scaleLinear()
      .domain([0, d3.max(cvdata, function(d) { return d; }) ])
      .range([height,0]);
      
    var yAxis = d3.axisLeft()
      .ticks(4)
      .scale(y);
    g.append("g").call(yAxis);
      
    var x = d3.scaleBand()
      .domain(d3.range(12))
      .range([0,width]);
      
    var xAxis = d3.axisBottom()
      .scale(x)
      .tickFormat(function(d) { return format(parse(d+1)); });
      
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("text-anchor","end")
        .attr("transform","rotate(-90)translate(-12,-15)")
      
    var rects = g.selectAll("rect")
      .data(cvdata)
      .enter()
      .append("rect")
      .attr("y",height)
      .attr("height",0)
      .attr("width", x.bandwidth()-2 )
      .attr("x", function(d,i) { return x(i); })
      .attr("fill","steelblue")
      .transition()
      .attr("height", function(d) { return height-y(d); })
      .attr("y", function(d) { return y(d); })
      .duration(1000);
      
    // var title = svg.append("text")
    //   .style("font-size", "20px")
    //   .text(function(d, i) { if(i==0){return "New Loss";} if(i==1){return "New Losses";}if(i==1){return "New Cases";}if(i==2){return "New Recovery";}if(i==3){return "Losses";}if(i==4){return "Cases";}if(i==5){return "Recovered";} })
    //   .attr("x", width/2 + margin.left)
    //   .attr("y", 30)
  
      div.append("div").attr("class","popupdiv").attr("style","margin-top:200px;").html(customPopup);
      return div.node();
      
    }
    // specify popup options 
    var customOptions =
        {
        'maxWidth': '500',
        'className' : 'custom'
        }
  
    C19NRecoveryMarkers.push(
      L.circleMarker([latitude,longitude], {
      opacity: 0.73,
      fillOpacity: 0.75,
      color: "green",
      fillColor: "lightgreen",
      weight: 1,
      radius: getRadius(newrecovery,population,"recovery")
      }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate)));
      
    C19RecoveryMarkers.push(
        L.circleMarker([latitude,longitude], {
        opacity: 0.73,
        fillOpacity: 0.75,
        color: "green",
        fillColor: "lightgreen",
        weight: 1,
        radius: getRadius(recovered,population,"recovery")
        }).bindPopup(customPopup,customOptions));
  
    C19FatalityRateMarkers.push(
      L.circleMarker([latitude,longitude], {
      opacity: 0.73,
      fillOpacity: 0.75,
      color: "black",
      fillColor: "red",
      weight: 1,
      radius: getRadius(fatality,population,"fatality")
      }).bindPopup(customPopup,customOptions));
    
     C19NLossMarkers.push(
      L.circleMarker([latitude,longitude], {
      opacity: 0.73,
      fillOpacity: 0.75,
      color: ChooseColor(newlosses,population,"loss"),
      fillColor: "red",
      weight: 1,
      radius: getRadius(newlosses,population,"loss")
      }).bindPopup(customPopup,customOptions));
      //}).bindPopup("<h3>" + country + "</h3><h5>" + province + "</h5><hr><p>Date:" + cdate + "</p><hr><p>Losses: +" + newlosses + "</p>"));
  
    C19LossMarkers.push(
          L.circleMarker([latitude,longitude], {
          opacity: 0.73,
          fillOpacity: 0.50,
          color: ChooseColor(losses,population,"loss"),
          fillColor: "red",
          weight: 1,
          radius: getRadius(losses,population,"loss")
        }).bindPopup(customPopup,customOptions));
      
      C19NCaseMarkers.push(
        L.circleMarker([latitude,longitude], {
        opacity: 0.73,
        fillOpacity: 0.91,
        color: "yellow",
        fillColor: ChooseColor(newcases,population,"case"),
        weight: 1,
        radius: getRadius(newcases,population,"case")
      }).bindPopup(customPopup,customOptions));
  
        C19CaseMarkers.push(
          L.circleMarker([latitude,longitude], {
          opacity: 0.73,
          fillOpacity: 0.91,
          color: "yellow",
          fillColor: ChooseColor(cases,population,"case"),
          weight: 1,
          radius: getRadius(cases,population,"case")
       }).bindPopup(customPopup,customOptions));
  
      });
  buildMap(C19LossMarkers,C19CaseMarkers,C19NCaseMarkers,C19NLossMarkers)
  }
  
  function buildMap(C19LossMarkers,C19CaseMarkers,C19NCaseMarkers,C19NLossMarkers){
  
  C19LossLayer = L.layerGroup(C19LossMarkers)
  C19CaseLayer = L.layerGroup(C19CaseMarkers)
  C19NLossLayer = L.layerGroup(C19NLossMarkers)
  C19NCaseLayer = L.layerGroup(C19NCaseMarkers)
  C19NRecoveryLayers = L.layerGroup(C19NRecoveryMarkers)
  C19RecoveryLayers = L.layerGroup(C19RecoveryMarkers)
  C19FatalityRateLayers = L.layerGroup(C19FatalityRateMarkers)
  
  var  overlayMaps = {
    "Covid New Losses": C19NLossLayer,
    "Covid New Casses": C19NCaseLayer,
    "Covid New Recovery" : C19NRecoveryLayers,
    "Covid Losses": C19LossLayer,
    "Covid Casses": C19CaseLayer,
    "Covid Recovery" : C19RecoveryLayers,
    "Fatatily Rate" : C19FatalityRateLayers
  };
  
  
   //Create map object and set default layers
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
	maxZoom: 5,
	minZoom: 5,
	zoomControl: false,
	dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,	
	layers: [dark, C19LossLayer]
  });
  
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
    }).addTo(myMap);
  
  }
  