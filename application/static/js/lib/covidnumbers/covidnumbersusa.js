var body = d3.select('body')
var maindiv=body.append('div').attr('class','container-fluid')


function renderUSA(covidall, covid19){
  buildCovidNumbers(covid19);
  d3.json(covidall, function(response) {

    let CovidData=response.data;

      buildLayers(CovidData);
      });

   }

function buildLayers(CovidData){

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

  if(ISO == 'USA'){
	  var rowdiv=maindiv.append("div")
    .attr("class","wrapper mrow")

    var crowdiv=rowdiv.append("div")
                .attr("class","row")

    crowdiv.append("div")
    .attr("class","cols country")
    .html(province)

    var arowdiv=rowdiv.append("div")
                .attr("class","row")

    arowdiv.append("div")
    .attr("class","cols activecases")
    .html("Active Cases<br>"+cases)

    arowdiv.append("div")
    .attr("class","cols activecases")
    .html("New Cases<br>"+"+"+newcases)

    var lrowdiv=rowdiv.append("div")
    .attr("class","row")

    lrowdiv.append("div")
    .attr("class","cols losses")
    .html("Total Losses <br>"+losses)

    lrowdiv.append("div")
    .attr("class","cols losses")
    .html("New Losses<br>"+"+"+newlosses)


    var trowdiv=rowdiv.append("div")
          .attr("class","row")

    trowdiv.append("div")
    .attr("class","cols activecases")
    .html("Total Cases <br>"+cases)

    trowdiv.append("div")
    .attr("class","cols recovered")
    .html("Recovered Cases<br>"+recovered)
  }
});
}


function buildCovidNumbers(covid19){
  console.log("Calling Function"+covid19)
d3.json(covid19,function(data){
  console.log(data);


  data.forEach((element) => {
    var country=element['Country_text'];
    var activecases=element['Active Cases_text']
    var totallosses=element['Total Deaths_text']
    var newcases=element['New Cases_text']
    var newlosses=element['New Deaths_text']
    var totalcases=element['Total Cases_text'];
    var recoveredcases=element['Total Recovered_text']

    if(country == 'USA'){
    var rowdiv=maindiv.append("div")
    .attr("class","wrapper mrow")

    var crowdiv=rowdiv.append("div")
                .attr("class","row")

    crowdiv.append("div")
    .attr("class","cols country")
    .html(country)

    var arowdiv=rowdiv.append("div")
                .attr("class","row")

    arowdiv.append("div")
    .attr("class","cols activecases")
    .html("Active Cases<br>"+activecases)

    arowdiv.append("div")
    .attr("class","cols activecases")
    .html("New Cases<br>"+newcases)

    var lrowdiv=rowdiv.append("div")
    .attr("class","row")

    lrowdiv.append("div")
    .attr("class","cols losses")
    .html("Total Losses <br>"+totallosses)

    lrowdiv.append("div")
    .attr("class","cols losses")
    .html("New Losses<br>"+newlosses)


    var trowdiv=rowdiv.append("div")
          .attr("class","row")

    trowdiv.append("div")
    .attr("class","cols activecases")
    .html("Total Cases <br>"+ totalcases)

    trowdiv.append("div")
    .attr("class","cols recovered")
    .html("Recovered Cases<br>"+recoveredcases)
	}
     });

});
}
