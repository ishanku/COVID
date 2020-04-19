// var myMap = L.map("map", {
//   center: [
//       37.09, -95.71
//     ],
//   zoom: 3
// });


var cLayer = L.layerGroup(c19Markers);
var overlayMaps = {
  "C19data": cLayer };


d3.json(c19data,function(data){

var records=data.records;
var currentCountry=records[0].countriesAndTerritories;
records.forEach((covidReport) =>{
  covidReport.cases=+covidReport.cases
  covidReport.losses=+covidReport.losses
  if (currentCountry == covidReport.countriesAndTerritories){
      cases = cases + covidReport.cases;
      losses = losses + covidReport.losses;
  }
  else{
        // console.log(currentCountry+"-"+cases+"-"+losses);
        var dateRep=covidReport.dateRep;
        ccount=ccount+1
        getLatLon(currentCountry)


        function buildMaps(c19Markers){

          var cLayer = L.layerGroup(c19Markers);
          var overlayMaps = {
            "C19data": cLayer };
        }
        function drawCircle(latitude,longitude,country,dateRep,losses){//console.log(latitude+","+longitude+","+country+","+losses+","+dateRep);

          // c19Markers.push(
          //   //L.marker(cities[i].location).bindPopup("<h1>" + cities[i].name + "</h1>"
          //      L.circleMarker([latitude,longitude], {
          //         fillOpacity: 0.5,
          //         color: "red",
          //         fillColor: "red",
          //         radius: losses
          //       }).bindPopup("<h3>" + country + "</h3><hr><p>" + new Date(dateRep) + "</p><hr><p>Deaths: " + losses+ "</p>"));
          //     }
          c19Markers.push(
              L.circleMarker([latitude,longitude], {
                stroke: false,
                fillOpacity: 0.75,
                color: "red",
                fillColor: "red",
                radius: losses
              })
            );
        currentCountry = covidReport.countriesAndTerritories;
        cases=0;
        losses=0;
}}

});

 //console.log(c19Markers);
 //Create map object and set default layers
 var myMap = L.map("map", {
   center: [37.09, -95.71],
   zoom: 3,
   layers: [light, cLayer]
 });

 // Pass our map layers into our layer control
 // Add the layer control to the map
 L.control.layers(baseMaps, overlayMaps, {
 collapsed: false
 }).addTo(myMap);
 console.log("***********Total Countries-***********"+ccount);
});
