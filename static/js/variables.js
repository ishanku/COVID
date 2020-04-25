var servername="http://localhost:5000/"
var c19data=servername + "data_c19"
//var c19data="https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
//var countrydata=servername + "data_country"
// var c19data="static/data/covid.json"
var countrydata="static/data/country.json"
var fullc19data=servername + "data_fullC19"
var covidall =servername + "covidall"


var C19LossMarkers=[]
var C19CaseMarkers=[]
var C19LossLayer=[]
var C19CaseLayer=[]
var latlong=[];
var llfound=false;
var key;
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
