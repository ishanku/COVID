//Creating myMap object
var map = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 1
});
var style;
// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});


function renderRegion(region){
  var url="/regional/"+region
  console.log(url)

  d3.json(url, function(data) {
   
    buildGeoMap(data);

  });
}

function buildGeoMap(data){

  var info = L.control();

  info.onAdd = function(map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  info.update = function(props) {
    this._div.innerHTML =
      "<h5>Covid Statistics</h5>" +
      (props
        ? "<div class='rows lightbg'><div class='cols headcol'>Population: <br>" +
          props.pop_est +
          "</div></div><div class='rows darkbg'><div class='cols losses'>Deaths<br>" +
          props.deaths +
          "</div><div class='cols activecases'>Active cases<br>" +
          props.active +
          "</div><div class='rows lightbg'><div class='cols recovered'>Recovery<br> " +
          props.recovered +
          "</div><div class='cols activecases'>Total Cases<br>" +
          props.confirmed +
          "</div></div>"
        : "Hover For Statistics");
  };

  info.addTo(map);

  // get color depending on population density value
  function getColor(d) {
    return d > 10000
      ? "#800026"
      : d > 5000
        ? "#BD0026"
        : d > 2000
          ? "#E31A1C"
          : d > 1000
            ? "#FC4E2A"
            : d > 500
              ? "#FD8D3C"
              : d > 200 ? "#FEB24C" : d > 100 ? "#FED976" : "#FFEDA0";
  }

  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.deaths)
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  map.attributionControl.addAttribution(
    'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
  );

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 100, 200, 500, 1000, 2000, 5000, 10000],
      labels = [],
      from,
      to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<i style="background:' +
          getColor(from + 1) +
          '"></i> ' +
          from +
          (to ? "&ndash;" + to : "+")
      );
    }

    div.innerHTML = labels.join("<br>");
    return div;
  };

  legend.addTo(map);

}
