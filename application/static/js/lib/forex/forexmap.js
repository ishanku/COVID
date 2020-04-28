
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
  
function renderForex(covid19,forexdata){
d3.json(forexdata, function(response) {
  
    //console.log(response)
    let ForexData=response;
d3.json(covid19,(response)=>{
    let CovidData=response;
    
    //console.log(response)
    buildLayers(CovidData,ForexData);
   
})

 });
}
     
  
  function buildLayers(CovidData,ForexData){

  var country,latitude,longitude;
   console.log(ForexData)
   //console.log(CovidData)
  
  var i=0;
  ForexData.forEach((data) => {
    if (i==0){
    CCountry=data.country
    console.log(data)
    i++
  }
    //console.log(data)
    if (CCountry == data.country){
    
      country=data.country;
      latitude=data.latitude;
      longitude=data.longitude;

      

    }
    else{
   
    if(country){

      CovidData.forEach((element) => {
        
        var CovidCountry=element['Country_text'];
        if (country==CovidCountry){

        var activecases=element['Active Cases_text']
        var totallosses=element['Total Deaths_text']
        var newcases=element['New Cases_text']
        var newlosses=element['New Deaths_text']
        var totalcases=element['Total Cases_text'];
        var recoveredcases=element['Total Recovered_text']
      
        var customPopup = "<h3>" + country + "</h3><hr><div class='row'>"
        customPopup=customPopup+ "<div class='cols losses'>New Losses: <br>+" + newlosses + "</div><div class='cols losses'>Total Losses: <br>"  + totallosses + "</div></div>"; 
        customPopup=customPopup + "<div class='row'><div class='cols activecases'>New Cases: <br>+"+ newcases + "</div><div class='cols activecases'>Total Cases: <br>";
        customPopup=customPopup + totalcases + "</div></div><div class='row'><div class='cols activecases'>Active Cases: <br>+"+ activecases + "</div><div class='cols recovered'>Total Recovery: <br>";
        customPopup=customPopup + recoveredcases + "</div></div>"; 
      

    C19CaseMarkers.push(
      L.circleMarker([latitude,longitude], {
      opacity: 0.73,
      fillOpacity: 0.91,
      color: "blue",
      fillColor: "red",
      //fillColor: ChooseColor(cases,population,"case"),
      weight: 1,
      radius: 5
    })
    .bindPopup(customPopup));
    //.bindPopup(buildChart(country,customPopup,ForexData)));
  }
  });
  }

    CCountry=data.country;  
    
  }
  
});
buildMap(C19CaseMarkers);
}

  function buildMap(C19CaseMarkers){
  
  C19CaseLayer = L.layerGroup(C19CaseMarkers)
    
  var  overlayMaps = {
    "Covid Casses": C19CaseLayer,
  };
  
   //Create map object and set default layers
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [dark, C19CaseLayer]
  });
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);
  
  }
  