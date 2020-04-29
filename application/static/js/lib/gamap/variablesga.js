var C19NRecoveryMarkers=[]
var C19RecoveryMarkers=[]
var C19FatalityRateMarkers=[]
var C19LossMarkers=[]
var C19CaseMarkers=[]
var C19NLossMarkers=[]
var C19NCaseMarkers=[]
var C19NRecoveryLayers=[]
var C19RecoveryLayers=[]
var C19FatalityRateLayers=[]
var C19LossLayer=[]
var C19CaseLayer=[]
var C19NLossLayer=[]
var C19NCaseLayer=[]
var cases=+0;
var losses=+0
var ccount=+0
//Adding tile layer to the map




var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Adding tile layer to the map
var street=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Only one base layer can be shown at a time
var baseMaps = {
  "Light": light,
  "Dark": dark,
  "Street" : street
};
