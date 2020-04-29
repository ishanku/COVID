# 


# Team -  R-Pythons

Khushboo Shah, Roopa Reddy, Siva Thangaraj, Victor Ime, Julie John



## Project - Covid-in-a-Flask App



## Project Description

The scope of our project is to create an app for visualizing Covid data at global, national and regional level. The project further looks into the correlation between forex rates and covid cases globally. We attempted to study the unique impact of social distancing on various energy resources.

[https://ourcovidhelper.herokuapp.com](https://ourcovidhelper.herokuapp.com/)



## Datasets Used

Eupopean CDC: https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
Oil Price Dataset: https://datahub.io/core/oil-prices#data
Natural Price Dataset: https://datahub.io/core/natural-gas
Forex Dataset: https://fixer.io

## High Level Architecture

<img src="C:\Users\jules\Downloads\Architecture-PNG.png" alt="Architecture-PNG" style="zoom: 50%;" />

## Tools Used

- ±**DB : PostgreSQL  Instance (Google Cloud)** 
- ±**Hosted: Heroku**
- ±**Code Repository: GitHub** - 
- ±**Deployment : Continuous Integration**
- ±**Python Libraries**
  - °**Flask**
  - °**Pandas**
  - °**Sqlalchecmy**
  - °**Psychopy** **(****postgresql** **driver)**
  - °**Gunicorn** **(****vsgi** **http server)**

- ±**Visualization Libraries:**
  - °**D3**
  - °**Leaflet**
  - °**Pym.js** **(NPR** **ResponsiveI** **frames)**

- ±**Pipenv**



## Versions

 certifi==2020.4.5.1
 chardet==3.0.4
 click==7.1.1
 Flask==1.1.2
 Flask-WTF==0.14.3
 idna==2.9
 itsdangerous==1.1.0
 Jinja2==2.11.2
 MarkupSafe==1.1.1
 numpy==1.18.3
 pandas==1.0.3
 psycopg2-binary==2.8.5
 python-dateutil==2.8.1
 python-dotenv==0.13.0
 pytz==2019.3
 requests==2.23.0
 scipy==1.4.1
 six==1.14.0
 SQLAlchemy==1.3.16
 urllib3==1.25.8
 Werkzeug==1.0.1
 WTForms==2.3.1



## Heroku Deployment:

1. Created a GitHub repo 'COVID' for the application
2. Prepared the application with additional configuration files (`Pip`, `Runfile` , `Procfile`, `requirements.txt`)
3. Created the Heroku application - 'Our Little Covid Helper'



## Code snippet:

```
Creating dynamic routes:

@*app.route*('/sroute/<route1>/<route2>')`

`def *mastersubroute*(route1,route2):`

  `html_render="index.html"`

  `leftbar="/covidnumbers"`

  `child1="/"+route1`

  `child2=route2`

  `*if* (route1 == 'usamap'):`

    `leftbar="/covidnumbersusa"` 

  `*return* render_template(html_render,child1=child1,child2=child2,leftbar=leftbar)`


```

```
 Creating iframes using pym.js:
 
 {%*if* child1 %}

  {%*if* child2 %}

    <script>

    var pymParent = new pym*.*Parent('middlebar', '{{child1}}/{{child2}}', {});

    var another = new pym*.*Parent('numberbar', '{{leftbar}}', {});

  </script>

 {%*else*%}

    <script>

   var pymParent = new pym*.*Parent('middlebar', '{{child1}}', {});

   var another = new pym*.*Parent('numberbar', '{{leftbar}}', {});

  </script>

  {%*endif*%}

 {% *else* %}  

  <script>

  var content="worldmap"

  var pymParent = new pym*.*Parent('middlebar', content, {});

  var another = new pym*.*Parent('numberbar', 'covidnumbers', {});

</script>

 {% *endif* %}

 {% *include* "includes/myfooter.html" %}
```

```
 Creating markers on the leaflet:
 
 `*C19NRecoveryMarkers**.*push(`

  `L*.**circleMarker*([latitude,longitude], {`

  `opacity: 0.73,`

  `fillOpacity: 0.75,`

  `color: "green",`

  `fillColor: "lightgreen",`

  `weight: 1,`

  `radius: *getRadius*(newrecovery,population,"recovery")`

  `})*.**bindPopup*(*buildChart*(newlosses,newcases,newrecovery,losses,cases,recovered,cdate,customPopup)));
```

```
Database connectivity:

user = os.environ['pgdbuser']

password=os.environ['pgdbpass']

host=os.environ['pgdbhost']

port="5432"

database="covid"

connection_string = f"{user}:{password}@{host}:{port}/{database}"

engine = create_engine(f'postgresql://{connection_string}')
```



## Cleaning of the dataset:

1. Combined the Brent oil prices data sets and Natural Gas prices data sets and merged with Covid dataset using Pandas. Since oil and natural gas is not traded during the weekends, the Covid data set had to be filtered to exclude weekends. 

2. Clean up of Forex dataset

   

## Data Visualization:

The app is designed with 7 tabs for data visualization from a global view to county view for Georgia including visualizations for Forex and oil prices with the final tab for CDC Guidelines.

###### Home Tab:![image-20200428211035669](C:\Users\jules\AppData\Roaming\Typora\typora-user-images\image-20200428211035669.png)

###### Regional Tab:<img src="C:\Users\jules\AppData\Roaming\Typora\typora-user-images\image-20200428210738294.png" alt="image-20200428210738294" style="zoom: 67%;" />

###### USA Tab:![image-20200428211139378](C:\Users\jules\AppData\Roaming\Typora\typora-user-images\image-20200428211139378.png)

###### Georgia Tab:![image-20200428211302329](C:\Users\jules\AppData\Roaming\Typora\typora-user-images\image-20200428211302329.png)

###### Oil Prices Effects Tab:![image-20200428211343122](C:\Users\jules\AppData\Roaming\Typora\typora-user-images\image-20200428211343122.png)



## Updates:

Coming soon!





## Considerations:

As the Covid continues to spread globally the feelings of anxiety and uncertainty are gripping people worldwide. From practicing social distancing to indefinite remote working the adjustments are taxing and stressful. In such an environment it is imperative for individuals to have an outlet to express themselves. Our hope is to provide one such channel by adding a blog to our Heroku App - 'Our Little Covid Helper', staying true to its name. 

