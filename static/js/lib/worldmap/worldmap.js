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

  let CovidData=response.data;
    
  buildLayers(CovidData);


 });

}
   

function buildLayers(CovidData){
 // Create a new marker cluster group
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
  var recovered=cases - losses;
  var fatality=parseInt(covidReport.fatality_rate);
  var ISO = region.iso
  var country=region.name;
  var latitude=region.lat;
  var longitude= region.long;
  var cdate=covidReport.date;
  var population=0;

  if (allcities){
    var clatitude=allcities.lat;
    var clongitude=allcities.long;
    var cname=allcities.name;
    var closdes =parseInt(covidReport.deaths);
    var ccases = parseInt(covidReport.confirmed);

  // CitiMarkers.addLayer(L.marker([clatitude, clongitude])
  //       .bindPopup(cname));
  // }
  var citicustomPopup = "<h3>" + country + "</h3><h5>" + province + "</h5><hr><div class='row'>"
  customPopup=customPopup+ "<div class='cols losses'>New Losses: <br>+" + newlosses + "</div><div class='cols losses'>Total Losses: <br>"  + losses + "</div></div>"; 
  customPopup=customPopup + "<div class='row'><div class='cols activecases'>New Cases: <br>+"+ newcases + "</div><div class='cols activecases'>Total Cases: <br>";
  customPopup=customPopup + cases + "</div></div><div class='row'><div class='cols recovered'>New Recovery: <br>+"+ newrecovery + "</div><div class='cols recovered'>Total Recovery: <br>";
  customPopup=customPopup + recovered + "</div></div>"; 

  CitiMarkers.push(
    L.marker([clatitude, clongitude]));
  }
  var customPopup = "<h3>" + country + "</h3><h5>" + province + "</h5><hr><div class='row'>"
  customPopup=customPopup+ "<div class='cols losses'>New Losses: <br>+" + newlosses + "</div><div class='cols losses'>Total Losses: <br>"  + losses + "</div></div>"; 
  customPopup=customPopup + "<div class='row'><div class='cols activecases'>New Cases: <br>+"+ newcases + "</div><div class='cols activecases'>Total Cases: <br>";
  customPopup=customPopup + cases + "</div></div><div class='row'><div class='cols recovered'>New Recovery: <br>+"+ newrecovery + "</div><div class='cols recovered'>Total Recovery: <br>";
  customPopup=customPopup + recovered + "</div></div>"; 

  C19NRecoveryMarkers.push(
    L.circleMarker([latitude,longitude], {
    opacity: 0.73,
    fillOpacity: 0.75,
    color: "green",
    fillColor: "lightgreen",
    weight: 1,
    radius: getRadius(newrecovery,population,"recovery")
    }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));

  C19RecoveryMarkers.push(
      L.circleMarker([latitude,longitude], {
      opacity: 0.73,
      fillOpacity: 0.75,
      color: "green",
      fillColor: "lightgreen",
      weight: 1,
      radius: getRadius(recovered,population,"recovery")
      }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));

  C19FatalityRateMarkers.push(
    L.circleMarker([latitude,longitude], {
    opacity: 0.73,
    fillOpacity: 0.75,
    color: "black",
    fillColor: "red",
    weight: 1,
    radius: getRadius(fatality,population,"fatality")
    }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));
  
   C19NLossMarkers.push(
    L.circleMarker([latitude,longitude], {
    opacity: 0.73,
    fillOpacity: 0.75,
    color: ChooseColor(newlosses,population,"loss"),
    fillColor: "red",
    weight: 1,
    radius: getRadius(newlosses,population,"loss")
    }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));
    //}).bindPopup("<h3>" + country + "</h3><h5>" + province + "</h5><hr><p>Date:" + cdate + "</p><hr><p>Losses: +" + newlosses + "</p>"));

  C19LossMarkers.push(
        L.circleMarker([latitude,longitude], {
        opacity: 0.73,
        fillOpacity: 0.50,
        color: ChooseColor(losses,population,"loss"),
        fillColor: "red",
        weight: 1,
        radius: getRadius(losses,population,"loss")
      }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));
    
    C19NCaseMarkers.push(
      L.circleMarker([latitude,longitude], {
      opacity: 0.73,
      fillOpacity: 0.91,
      color: "yellow",
      fillColor: ChooseColor(newcases,population,"case"),
      weight: 1,
      radius: getRadius(newcases,population,"case")
    }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));

      C19CaseMarkers.push(
        L.circleMarker([latitude,longitude], {
        opacity: 0.73,
        fillOpacity: 0.91,
        color: "yellow",
        fillColor: ChooseColor(cases,population,"case"),
        weight: 1,
        radius: getRadius(cases,population,"case")
     }).bindPopup(buildChart(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));

    });
buildMap(C19LossMarkers,C19CaseMarkers,C19NCaseMarkers,C19NLossMarkers)
}

function buildMap(C19LossMarkers,C19CaseMarkers,C19NCaseMarkers,C19NLossMarkers){

C19LossLayer = L.layerGroup(C19LossMarkers)
C19CaseLayer = L.layerGroup(C19CaseMarkers)
C19NLossLayer = L.layerGroup(C19NLossMarkers)
C19NCaseLayer = L.layerGroup(C19NCaseMarkers)
//C19NRecoveryLayers = L.layerGroup(C19NRecoveryMarkers)
//C19RecoveryLayers = L.layerGroup(C19RecoveryMarkers)
C19FatalityRateLayers = L.layerGroup(C19FatalityRateMarkers)

var  overlayMaps = {
  "Covid New Losses": C19NLossLayer,
  "Covid New Casses": C19NCaseLayer,
  //"Covid New Recovery" : C19NRecoveryLayers,
  "Covid Losses": C19LossLayer,
  "Covid Casses": C19CaseLayer,
  //"Covid Recovery" : C19RecoveryLayers,
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
