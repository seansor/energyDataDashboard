# Energy Data Dashboard

Interactive Frontend Development Milestone Project 2 - Code Institute 

This is a dashboard that allows users to see a breakdown of Ireland's Final Energy Consumption (Total Final Consumption [TFC]) 
by sector and by fuel type, as well as a breakdown of Ireland's Greenhouse gas/CO2 emissions.
The dashboard is primarily aimed at academics, researchers and professionals working in the energy industry or concerned with
energy policy but the data should be digestible to any readers with some knowledge of energy and greenhouse gas metrics.

## UX

It is envisaged that this dashboard will primarily be used by academics, researchers and professionals working in the energy
industry or concerned with energy policy.

The dashboard is broken into three distinct sections, namely; Population and Economic Data, Energy Statistics and Greenhouse
Gas Emissions. At the beginning of each section "Key Statistics" are provided to the user. These key statistics give the user 
a snapshot of some of the most important insights.

Key population and ecomonic statistics are displayed at the top of the page as these are key drivers of
changes in energy consumption. This data is displayed in simple line graphs which clearly display the trends over time.

The Energy Statistics section focuses on final energy consumption, known in the industry as Total Final Consumption (TFC).
This section gives breakdown of the TFC in terms of sector and fuel type. The user is first presented with the most recent
full datasets available which are for 2017. This data is illustrated for the user through the use of pie-charts which are 
suitable for displaying data for a single year. The user has ability to select different timescales which change the type
of graph shown. Stacked bar charts are shown for ten year data and stacked area charts are shown for the maximum time-range
which is from 1990-2017. Both of these graph types are suitable for representing these data-sets as they show the trends
over time as well as a breakdown by sector and fuel type. For these chart types the user can filter through by using the
dropdown-select menus provided. (Due to the way stacked charts are rendered using dc.js, clicking on the data type in the
graph does not automatically filter data on these chart types. The select menus must be used.) Users are directed as to
how they can filter data for each chart type through clear instructions above each chart.

The Greenhouse Gas Emissions section provides users with a similar format to the energy section, with a pie chart for the
most recent dataset (2017) and stacked bar charts and stacked area charts for longer term data. These charts can be toggled
using the select menu provided.

There is text provided for all graphs providing some high level information on the data represented in the graphs. So as
not to make the dashboard too "text heavy", much of the text is hidden from view by default and users and opt to view it or
hide it by clicking on the "More Info/Less Info" options.

Note: The page should be reloaded if the screen size is changed as the charts will not re-render automatically. This is a design
choice as re-rendering the charts everytime there is a change in screen size slows down the website unnecessarily.

### User Stories

* As a user, I want to be able to see a population graph, so that I can view the changes in the population over time.
* As a user, I want to be able to see a Gross National Income (GNI) graph, so that I can view the changes in the GNI
over time.
* As a user, I want to see key statistics for each section, so that I can quickly get an overview of important points.
* As a user, I want to be able to be able to interact with the data points, so that I can view the distinct values of
each data point.
* As a user, I want to be able to see the Total Final Consumption (TFC) for a range of timescales, so that I can see
the most recent year's data and the the data for longer periods of time.
*As a user, I want to be able to see a breakdown of TFC by sector and by fuel type, so that I can see the proportion
of energy related to each sector and fuel type.
*As a user, I want to be able to filter the data by sector and fuel type, so that I can focus on certain sectors or fuels.
*As a user, I want to view the greenhouse gas emissions in terms of CO2 equivalent for each distinct sector, so that I 
can see the breakdown of emissions in terms of CO2 equivalent.
*As a user, I want to be able to see the emissions breakdown for the most recent year available and for at least ten
years previously.
*As a user, I want to be able to be able to read a high level summary of the data presented in each graph.


### Wireframes

Wireframes for the site are provided in the project files in the "wireframes" folder.

## Features

### Existing Features
The Population and GNI graphs allows users to see the discrete values for each data point by hovering on the data points.

The key statistics are linked to the datasets and are rendered via graph.js using dc.js "number display" functionality.
(Exception: Greenhouse gas emissions key stats which are not related explicitly to data and are just informative and are
therefore hard coded into the html).

The 'Select Years' feature in the 'Energy' section allows users to view differnt date ranges (2017, 10yr, max) by 
selecting the relevant date range from the select options. This feature displays a different graph type for each range.
The select menu also hides or displays additional sector/fuel select menus depending on the graph type. This functionality
is implemented via the main.js file.

The "select sector/fuel type" select menus allow users to filter the data based on sector and/or fuel type.

For the pie charts the user can filter the data by simply clicking on the relevant sector/fuel type directly on the chart
or in the legend.

The user can see the discrete value for the Total Final Consumption (TFC) for any sector or fuel type in a specific year by
hovering over that data of interest in the graphs. The Energy values are displayed in "kilo-tonne of oil equivalent" (ktoe).

The select menu in the greenhosue gas section allows the users to change date range by selecting the relevant option. As per
the energy section, this selection results in one of three graph types being displayed: a pie chart (2017), a stacked
bar-chart (10yrs) or a stacked area-chart (max range).

The user can see the discrete value for the greenhouse gas emission (TFC) for any of the sectors by hovering over that data
of interest in the graphs. The emissions values are displayed in "kilo-tonne of CO2" equivalent (ktCO2).

The user can see more or less text (graph information) by clicking on the more "info/less info" text provided.

### Future additional Features
In the future Primary Energy as well as Total Final Consumption may be incorporated into the dashboard.

A more detailed breakown of CO2 emission including a more granular breakdown of emissions by sector
(e.g. transport, residential, etc.) could be included at a future date. 

Another future feature could be a section on renewables.

## Technologies Used

#### HTML5

#### CSS3

#### Javascript

#### d3 (Data-Driven Documents)

The project uses the [D3 JavaScript library](https://d3js.org/) (d3.js) for manipulating the DOM based on the data.

#### dc (Dimensional Charting Javascript Library)
The [dc.js javascript charting library](https://dc-js.github.io/dc.js/) is used on the project. It has native crossfilter
(see below) support which allows allows highly efficient exploration on large multi-dimensional datasets. It leverages
d3 to render charts in CSS-friendly SVG format. Charts rendered using dc.js are data driven and reactive.

#### Crossfilter
The [Crossfilter](http://crossfilter.github.io/crossfilter/) JavaScript library is used in conjunction with the dc.js and
d3.js libraries for interaction with the data in the browser. Due to its design it extremely fast it is particularly
uselful for exploring large multivariate datasets in the browser. 


#### Bootstrap
The project uses [bootstrap 4.3.1](https://getbootstrap.com/docs/4.3/getting-started/introduction/) to assist in layout
and styling of the dashboard. [Bootswatch](https://bootswatch.com/) was used to implement a particular bootstrap theme.

#### Fontawesome
The [Fontawesome](https://fontawesome.com/) icon toolkit was used to add icons to the website.

#### JQuery
The project uses [JQuery 3.4.1](https://jquery.com/) to simplify DOM manipulation.

#### Jasmine

The [Jasmine framework](https://jasmine.github.io/) was used for automated testing.

## Testing

### Overview
* Population and GNI Graphs render correctly.
* Data point values are displayed when hovered over.
* Key statistics render correctly.
* All energy graphs render correctly.
* The "select years" drop down toggles different graph types.
* Additional select menus for sector and fuel type appear when graphs are bar charts or area charts (i.e. 10yr or max selected).
* Additional select menus for sector and fuel type hidden when graphs is a pie chart (i.e. 2017 selected).
* The pie chart data filters when data types are clicked directly in the chart or when legend item is clicked.
* the bar chart and area chart data filters when data types are selected in dropdown menus.
* Greenhouse Gas Emissions graphs render correctly.
* Year select menu toggles between graph types for different year ranges selected.
* When "more info" text is clicked paragraphs/text slide down (shown).
* When "less info" text is clicked paragraphs/text slide up (hidden).

### Automated Testing
Most of the functions in the code alter the DOM in some way so these were not automated. Functions that simply return a
value were tested. The Jasmine framework was used to perform the testing.

The "colors" function which returns two arrays containing light and dark color palettes was tested. 3 tests were run.
The process runs the 'colors' function and tells the test what to expect as the return value. If they match the test passes.
The test files can be found in the "spec" folder. The graphSpec.js file is the test code while the runSpec.html is the file
that needs to be run to run the test code. In order to run the test open runSpec.html in your IDE and Preview the file.

### Responsiveness
The dashboard was tested on different devices including a windows laptop, an IOS device (iPhone 6) and an android
device (OnePlus Phone). The website was also testing using different browsers including Edge, Firefox and Chrome
and the developer tools in these browsers were also used to test the website's responsiveness.

The website displays well on all sizes of device although this type of dashboard display is generally better suited
to large screen resolutions. On screen sizes smaller than 1200px the graphs display vertically. On small screens
the code has been designed so that the graphs, particularly charts displayign data over time are not reduced below
a certain width. A horizontal scroll feature is incorporated to view these charts on small devices e.g. mobile devices
less than 400px.

### bugs
A number of bugs were caught during the testing process. Many of the these were found when testing for reponsiveness.
One such bug was causing the legend on the pie charts to overlap the charts on small screen sizes (i.e. screens less than 400px).
To overcome this I created a function which is called when the charts are rendered to move the legend from it's usual coordinates
on screen sizes less 400px. As noted in the UX section the page should be reloaded if the screen size is changed as the charts
will not re-render automatically so this function is only called when a re-render of the charts is called. (i.e. it was not
necessary to add a listener and call the function each time a change in screen size is detected as teh cahrts need to be
re-renderd manually [with a page reload]).

## Deployment
This site is hosted using GitHub pages, deployed directly from the master branch. To deploy the site I accessed the project
on GitHUb >> selected "settings" from the main project tab bar >> scrolled down to "GitHub pages" >> selected the "Source" 
as "master branch" >> clicked on the link that appear that says "Your site is published at
https://seansor.github.io/energyDataDashboard/". The deployed site will update automatically upon new commits to the master
branch. In order for the site to deploy correctly on GitHub pages, the landing page must be named 'index.html'.

To run locally, you can clone this repository directly into the editor of your choice by pasting
'git clone https://github.com/seansor/energyDataDashboard.git' into your terminal. To cut ties with this GitHub repository,
type "git remote rm origin" into the terminal.

## Credits
### Content
Parts of the text describing the population and GNI statistics were copied from the Central Statistics Office Website:
https://www.cso.ie/en/statistics/population/populationandmigrationestimates/
https://www.cso.ie/en/releasesandpublications/ep/p-nie/nie2017/mgni/ 

Parts of the text describing the energy and carbon statistics were taken from the Sustainable Energy Authority of ireland 
Website:

https://www.seai.ie/resources/seai-statistics/key-statistics/energy-use-overview/
https://www.seai.ie/resources/seai-statistics/key-statistics/co2/

### Acknowledgements
I received inspiration for this project from SEAI's and the EPA's websites which provide data on energy and greenhouse gas 
emissions.

