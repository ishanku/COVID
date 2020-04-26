function buildChart(nl,nc,nr,l,c,r,cdate,customPopup){
    var width = 500;
    var height = 100;
    var margin = {left:50,right:50,top:50,bottom:50};
    var parse = d3.timeParse("%m");
    var format = d3.timeFormat("%b");
    
    var div = d3.create("div").attr("id","svg-div").attr("style","height:370px").attr("style","width:330px")
    var svg = div.append("svg")
      .attr("width", width+margin.left+margin.right)
      .attr("height", height+margin.top+margin.bottom);
    
    var g = svg.append("g").attr("transform","translate("+[margin.left,margin.top]+")");
    
    var cvdata = [nl,nc,nr,l,c,r];
    var y = d3.scaleLinear()
    .domain([0, d3.max(cvdata, function(d) { return d; }) ])
    .range([height,0]);
    
  var yAxis = d3.axisLeft()
    .ticks(6)
    .scale(y);
  g.append("g").call(yAxis);
    
  var x = d3.scaleBand()
    .domain(d3.range(7))
    .range([0,210]);
    
  var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(function(d, i) { if(i==0){return "New Loss";} if(i==1){return "New Losses";}if(i==1){return "New Cases";}if(i==2){return "New Recovery";}if(i==3){return "Losses";}if(i==4){return "Cases";}if(i==5){return "Recovered";}});
    
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("text-anchor","end")
      .attr("transform","rotate(-90)translate(-12,-15)")
    
  var rects = g.selectAll("rect")
    .data(cvdata)
    .enter()
    .append("rect")
    .attr("y",height)
    .attr("height",0)
    .attr("width",15)
    .attr("x", function(d,i) { return x(i); })
    .attr("fill","steelblue")
    .transition()
    .attr("height", function(d) { return height-y(d); })
    .attr("y", function(d) { return y(d); })
    .duration(1000);
    
  var title = svg.append("text")
    .style("font-size", "12px")
    .text("Covid Statistics - " + cdate)
    .attr("x", margin.left)
    .attr("y", 30)

    div.append("div").attr("class","popupdiv").attr("style","margin-top:200px;").html(customPopup);
    return div.node();
    
  }

  function defineFeature(feature, latlng) {
    var categoryVal = feature.properties[categoryField],
      iconVal = feature.properties[iconField];
      var myClass = 'marker category-'+categoryVal+' icon-'+iconVal;
      var myIcon = L.divIcon({
          className: myClass,
          iconSize:null
      });
      return L.marker(latlng, {icon: myIcon});
  }
  
  function defineFeaturePopup(feature, layer) {
    var props = feature.properties,
      fields = metadata.fields,
      popupContent = '';
      
    popupFields.map( function(key) {
      if (props[key]) {
        var val = props[key],
          label = fields[key].name;
        if (fields[key].lookup) {
          val = fields[key].lookup[val];
        }
        popupContent += '<span class="attribute"><span class="label">'+label+':</span> '+val+'</span>';
      }
    });
    popupContent = '<div class="map-popup">'+popupContent+'</div>';
    layer.bindPopup(popupContent,{offset: L.point(1,-2)});
  }
  
  function defineClusterIcon(cluster) {
      var children = cluster.getAllChildMarkers(),
          n = children.length, //Get number of markers in cluster
          strokeWidth = 1, //Set clusterpie stroke width
          r = rmax-2*strokeWidth-(n<10?12:n<100?8:n<1000?4:0), //Calculate clusterpie radius...
          iconDim = (r+strokeWidth)*2, //...and divIcon dimensions (leaflet really want to know the size)
          data = d3.nest() //Build a dataset for the pie chart
            .key(function(d) { return d.feature.properties[categoryField]; })
            .entries(children, d3.map),
          //bake some svg markup
          html = bakeThePie({data: data,
                              valueFunc: function(d){return d.values.length;},
                              strokeWidth: 1,
                              outerRadius: r,
                              innerRadius: r-10,
                              pieClass: 'cluster-pie',
                              pieLabel: n,
                              pieLabelClass: 'marker-cluster-pie-label',
                              pathClassFunc: function(d){return "category-"+d.data.key;},
                              pathTitleFunc: function(d){return metadata.fields[categoryField].lookup[d.data.key]+' ('+d.data.values.length+' accident'+(d.data.values.length!=1?'s':'')+')';}
                            }),
          //Create a new divIcon and assign the svg markup to the html property
          myIcon = new L.DivIcon({
              html: html,
              className: 'marker-cluster', 
              iconSize: new L.Point(iconDim, iconDim)
          });
      return myIcon;
  }
  
  /*function that generates a svg markup for the pie chart*/
  function bakeThePie(options) {
      /*data and valueFunc are required*/
      if (!options.data || !options.valueFunc) {
          return '';
      }
      var data = options.data,
          valueFunc = options.valueFunc,
          r = options.outerRadius?options.outerRadius:28, //Default outer radius = 28px
          rInner = options.innerRadius?options.innerRadius:r-10, //Default inner radius = r-10
          strokeWidth = options.strokeWidth?options.strokeWidth:1, //Default stroke is 1
          pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
          pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc:function(){return '';}, //Title for each path
          pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
          pieLabel = options.pieLabel?options.pieLabel:d3.sum(data,valueFunc), //Label for the whole pie
          pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label
          
          origo = (r+strokeWidth), //Center coordinate
          w = origo*2, //width and height of the svg element
          h = w,
          donut = d3.layout.pie(),
          arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);
          
      //Create an svg element
      var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
      //Create the pie chart
      var vis = d3.select(svg)
          .data([data])
          .attr('class', pieClass)
          .attr('width', w)
          .attr('height', h);
          
      var arcs = vis.selectAll('g.arc')
          .data(donut.value(valueFunc))
          .enter().append('svg:g')
          .attr('class', 'arc')
          .attr('transform', 'translate(' + origo + ',' + origo + ')');
      
      arcs.append('svg:path')
          .attr('class', pathClassFunc)
          .attr('stroke-width', strokeWidth)
          .attr('d', arc)
          .append('svg:title')
            .text(pathTitleFunc);
                  
      vis.append('text')
          .attr('x',origo)
          .attr('y',origo)
          .attr('class', pieLabelClass)
          .attr('text-anchor', 'middle')
          //.attr('dominant-baseline', 'central')
          /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
          .attr('dy','.3em')
          .text(pieLabel);
      //Return the svg-markup rather than the actual element
      return serializeXmlNode(svg);
  }
  
  /*Function for generating a legend with the same categories as in the clusterPie*/
  function renderLegend() {
      var data = d3.entries(metadata.fields[categoryField].lookup),
        legenddiv = d3.select('body').append('div')
          .attr('id','legend');
          
      var heading = legenddiv.append('div')
          .classed('legendheading', true)
          .text(metadata.fields[categoryField].name);
  
      var legenditems = legenddiv.selectAll('.legenditem')
          .data(data);
          
      legenditems
          .enter()
          .append('div')
          .attr('class',function(d){return 'category-'+d.key;})
          .classed({'legenditem': true})
          .text(function(d){return d.value;});
  }
  
  /*Helper function*/
  function serializeXmlNode(xmlNode) {
      if (typeof window.XMLSerializer != "undefined") {
          return (new window.XMLSerializer()).serializeToString(xmlNode);
      } else if (typeof xmlNode.xml != "undefined") {
          return xmlNode.xml;
      }
      return "";
  }
  