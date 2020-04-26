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

  var svg=d3.select("#mypie").append('circle').attr("cx",50).attr("cy",0).attr("r",20).attr("fill","red");
  var csvg='<svg height="20" width="20" viewBox="0 0 20 20"><circle r="10" cx="10" cy="10" fill="white" /><circle r="10" cx="10" cy="10" fill="bisque" /></svg>'
  //var customPopup = "<div id='mypie'></div><h3>" + country + "</h3><h5>" + province + "</h5><hr><p>Date:" + cdate + "</p><hr><p>New Losses: +" + newlosses + "</p><p>Total Losses: +"  + losses + "</p><p>New Cases: "+ newcases + "</p><p>Total Cases: +"+ cases + "</p>";
  var customPopup = "<h3>" + country + "</h3><h5>" + province + "</h5><hr><p>Date:" + cdate + "</p><hr><p>New Losses: +" + newlosses + "</p><p>Total Losses: +"  + losses + "</p><p>New Cases: "+ newcases + "</p><p>Total Cases: +"+ cases + "</p>";
  function buildChart(nl,nc,nr,l,c,r){
    var width = 500;
    var height = 100;
    var margin = {left:50,right:50,top:50,bottom:50};
    var parse = d3.timeParse("%m");
    var format = d3.timeFormat("%b");
    
    var div = d3.create("div").attr("id","svg-div").attr("style","height:300px").attr("style","width:330px")
    var svg = div.append("svg")
      .attr("width", width+margin.left+margin.right)
      .attr("height", height+margin.top+margin.bottom);
    //var g = svg.append("g").attr("transform","translate("+[margin.left,margin.top]+")");
    
    var cvdata = [nl,nc,nr,l,c,r];
    //var cvdata = [2,5,7,1,10,10];
    var pie = d3.pie
    var radius = 75;
    var g = svg.append("g").attr("transform", "translate(" + (margin.left+margin.right) + "," + (margin.top+margin.bottom) + ")")
              // .append("text")
              // .text("Covid Statistics - "+ cdate)
              // .attr("class", "title");

    var color = d3.scaleOrdinal(['black','lightblue','lightgreen','red','blue','green']);

// Generate the pie
    var pie = d3.pie();
// Generate the arcs
    var arc = d3.arc()
            .innerRadius(50)
            .outerRadius(radius);
//Generate groups
  var arcs = g.selectAll("arc")
            .data(pie(cvdata))
            .enter()
            .append("g")
            .attr("class", "arc")
//Draw arc paths
   arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc);

  var label = d3.arc().outerRadius(radius).innerRadius(radius - 10);

  arcs.append("text")
    .attr("transform", function(d) {
    return "translate(" + label.centroid(d) + ")"; 
                       })
                      .text(function(d, i) { if(i==0){return "New Loss";} if(i==1){return "New Losses";}if(i==1){return "New Cases";}if(i==2){return "New Recovery";}if(i==3){return "Losses";}if(i==4){return "Cases";}if(i==5){return "Recovered";} });
    div.append("div").attr("class","popupdiv").attr("style","margin-top:150px;").html(customPopup);
    // var scripttext="size(200, 200);\nbackground(100);\nsmooth();\nnoStroke();\nint diameter = 150;\nint[] angs = {30, 10, 45, 35, 60, 38, 75, 67};\nfloat lastAng = 0;\n";
    // scripttext=scripttext+ "for (int i=0; i<angs.length; i++){\nfill(angs[i] * 3.0);\narc(width/2, height/2, diameter, diameter, lastAng, lastAng+radians(angs[i]));\nlastAng += radians(angs[i]);\n}\n"
    // var script=div.append("script").attr("type","application/processing").text(scripttext);
    // div.append("canvas").attr("width",200).attr("height",200).attr("id","__processing0").attr("style","image-rendering: optimizeQuality !important;")
    //canvas width="200" height="200" tabindex="0" id="__processing0" style="image-rendering: optimizeQuality !important;"></canvas>
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
  zoom: 3,
  layers: [dark, C19LossLayer]
});

L.control.layers(baseMaps, overlayMaps, {
  collapsed: true
  }).addTo(myMap);

}
