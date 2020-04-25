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
        var dateRep=covidReport.dateRep;
        ccount=ccount+1
          d3.json(countrydata,function(dbdata){
            var data=dbdata;
                data.forEach((item) => {
                  if (icountry=item.name){
                    if (item.latitude != null && item.longitude != null){
                      //latlong=[item.latitude,item.longitude];
                      c19Markers.push(L.circleMarker([item.latitude,item.longitude], {
                            stroke: false, fillOpacity: 0.75,
                            color: "red",fillColor: "red",radius: losses}
                      ));
                  }}
                });
        });
        // MOVE ON TO THE NEXT COUNTRY
        console.log(c19Markers.length);
        currentCountry = covidReport.countriesAndTerritories;
        cases=0;
        losses=0;
      }

      cLayer = L.layerGroup(c19Markers);
      overlayMaps = {
        "C19data": cLayer };
      });
      var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [light, cLayer]
      });
      L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
      }).addTo(myMap);
      console.log("***********Total Countries-***********"+ccount);
});
