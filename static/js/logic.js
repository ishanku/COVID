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

function renderAll(c19data,countrydata,covidall){
d3.json(c19data, function(response) {
  console.log("welcome again")
  console.log(response);
  let CovidData=response.records;
  console.log(CovidData);
  let currentCountry=CovidData[0].countriesAndTerritories;
  d3.json(covidall,(data)=>{
    console.log(data);
  })
  d3.json(countrydata, function(cdata) {
    console.log(cdata);
    let GeoCoordinates=cdata;

    buildLayers(currentCountry,CovidData,GeoCoordinates);
    });

  });

}

function buildLayers(currentCountry,CovidData,GeoCoordinates){

CovidData.forEach((covidReport) => {
  // covidReport.cases=+covidReport.cases
  // covidReport.losses=+covidReport.deaths

  if (currentCountry == covidReport.countriesAndTerritories){
      cases = parseInt(cases) + parseInt(covidReport.cases);
      losses = parseInt(losses) + parseInt(covidReport.deaths);
  }
  else{
    var dateRep=covidReport.dateRep;
    var population=covidReport.popData2018;

    ccount=ccount+1
    GetCoord(currentCountry)
    if (llfound==true){
      latitude=latlong[0]
      longitude=latlong[1]
      country=currentCountry

      C19LossMarkers.push(
        L.circleMarker([latitude,longitude], {
        opacity: 0.73,
        fillOpacity: 0.50,
        color: ChooseColor(losses,population,"loss"),
        fillColor: "red",
        weight: 1,
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: getRadius(losses,population,"loss")
      }).bindPopup("<h3>" + country + "</h3><hr><p>Date:" + dateRep + "</p><hr><p>Losses: " + losses + "</p>"));
    
      C19CaseMarkers.push(
        L.circleMarker([latitude,longitude], {
        opacity: 0.73,
        fillOpacity: 0.91,
        color: "yellow",
        fillColor: ChooseColor(cases,population,"case"),
        weight: 1,
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: getRadius(cases,population,"case")
      }).bindPopup("<h3>" + country + "</h3><hr><p>Date:" + dateRep + "</p><hr><p>Cases: " + cases + "</p>"))
   
    //if (ccount<6){
    //LossesCircle(latitude,longitude,currentCountry,dateRep,losses)
    //CasesCircle(latitude,longitude,currentCountry,dateRep,cases)
    
    //}
    llfound=false;
    }
    losses=0
    cases=0;
    currentCountry = covidReport.countriesAndTerritories;
    

}
});

function GetCoord(iCountry){
  GeoCoordinates.forEach((item) => {
    if (iCountry==item.name){
      if (item.latitude != null && item.longitude != null){
        latlong=[item.latitude,item.longitude];
        //console.log(iCountry+"-"+latlong);
        llfound=true
        return latlong;
   }}
  });

  

}

buildMap(C19LossMarkers,C19CaseMarkers)
}

function buildMap(C19LossMarkers,C19CaseMarkers){

C19LossLayer = L.layerGroup(C19LossMarkers)
C19CaseLayer = L.layerGroup(C19CaseMarkers)

var  overlayMaps = {
  "Covid Losses": C19LossLayer,
  "Covid Casses": C19CaseLayer
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
