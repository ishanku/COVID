var body = d3.select('body')
var maindiv=body.append('div').attr('class','container-fluid')
function buildCovidNumbers(covid19){
d3.json(covid19,function(data){ 
  data.forEach((element) => {
    var country=element['Country_text'];
    var activecases=element['Active Cases_text']
    var totallosses=element['Total Deaths_text']
    var newcases=element['New Cases_text']
    var newlosses=element['New Deaths_text']
    var totalcases=element['Total Cases_text'];
    var recoveredcases=element['Total Recovered_text']


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

     });
});
}
