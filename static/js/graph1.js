Promise.all([
    d3.csv("data/populationStats.csv"),
    d3.csv("data/TFC2.csv")
]).then(function(datafile) {
    makePopGraph(datafile[0]);
    makeTFCGraphs(datafile[1]);
});



function makePopGraph(populationStats) {
    var ndx = crossfilter(populationStats);
    var year_dim = ndx.dimension(dc.pluck('Year'));
    populationStats.forEach(function(d) {
        d.Population = parseFloat(d.Population.replace(/,/g, ''));
        d.Year = parseInt(d.Year.replace(/,/g, ''), 10);
    });


    var year_dim = ndx.dimension(dc.pluck('Year'));
    /*var population = year_dim.groupAll()('Population');*/
    var population = year_dim.group().reduceSum(dc.pluck('Population'));


    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;

    var pop_dim = ndx.dimension(dc.pluck('Population'));

    var minPop = pop_dim.bottom(1)[0].Population;
    var maxPop = pop_dim.top(1)[0].Population;

    var chart = dc.lineChart("#population-chart")

    chart
        .width(600)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(population)
        .transitionDuration(500)
        .y(d3.scaleLinear().domain([2000, maxPop]))
        .x(d3.scaleLinear().domain([1990, maxDate]))
        .yAxisLabel("'000 People")
        .xAxisLabel("Year")
        .brushOn(false)
        .renderDataPoints({ radius: 2, fillOpacity: 0.8, strokeOpacity: 0.0 });

    chart.xAxis().tickFormat(d3.format('d'));

    dc.renderAll();
}


function makeTFCGraphs(data) {

    data.forEach(function(d) {

        d.Year = parseInt(d.Year, 10);

        d.ktoe = parseInt(d.ktoe.replace(/,/g, ''),10);

        d.Sector == "Transport" ? d.sectorNum = 5 :
            d.Sector == "Residential" ? d.sectorNum = 4 :
            d.Sector == "Industry" ? d.sectorNum = 3 :
            d.Sector == "Services" ? d.sectorNum = 2 :
            d.sectorNum = 1;

        d.Fuel == "Coal" ? d.fuelNum = 6 :
            d.Fuel == "Peat" ? d.fuelNum = 5 :
            d.Fuel == "Elec" ? d.fuelNum = 3 :
            d.Fuel == "Oil" ? d.fuelNum = 1 :
            d.Fuel == "NatGas" ? d.fuelNum = 2 :
            d.Fuel == "Renewable" ? d.fuelNum = 4 :
            d.fuelNum = 7;
    });


    var ndx = crossfilter(data);
    show_sector_selector(ndx);
    makeTFCSectorGraph(ndx);
    makeTFCFuelTypeGraph(ndx);




    dc.renderAll();
}

function show_sector_selector(ndx) {
    var dim = ndx.dimension(function(d) { return d.Sector });
    var group = dim.group();
    var select = dc.selectMenu("#sector-selector")
        .dimension(dim)
        .group(group);


    select.title(function(d) {
        return d.key;
    });

    /*    select.filterDisplayed(function () {
            return false;
        });*/

}

function makeTFCSectorGraph(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));



    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;


    var energySumGroup = year_dim.group().reduce(function(p, v) {

        p[v.sectorNum] = (p[v.sectorNum] || 0) + v.ktoe;
        return p;
    }, function(p, v) {
        p[v.sectorNum] = (p[v.sectorNum] || 0) - v.ktoe;
        return p;
    }, function() {
        return {};
    });


    var filtered_group = remove_competely_empty_bins(energySumGroup); // fake groups to remove 0 value bins


    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }

    var chart = dc.lineChart("#test");

    chart
        .width(600)
        .height(480)
        .x(d3.scaleLinear().domain([minDate, maxDate]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .renderArea(true)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));


    chart.legend(dc.legend().x(75).y(10).itemHeight(13).gap(5)
        .legendText(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return (sectors[d.name - 1]);
        }));


    dc.override(chart, 'legendables', chart._legendables);

    dc.override(chart, 'legendables', function() {
        var legendables = this._legendables();
        if (!this.dashStyle()) {
            return legendables.reverse();
        }
        return legendables.map(function(l) {
            l.dashstyle = this.dashStyle();
            return l.reverse();
        });
    });


    chart.xAxis().tickFormat(d3.format('d'));

    for (var i = 2; i < 6; i++) {
        chart.stack(filtered_group, '' + i, sel_stack(i));
    }
    
    //Need to revisit this to remove 0 value bins
    
    function remove_competely_empty_bins(sourceGroup) {
          return {
              all:function () {
                  return sourceGroup.all().filter(function(d) {
                     for(i=0; i<5; i++){
                     return Object.values(d.value).some(v => v!=0);
                     }
                  });
              }
          };
      }
      
      //render barchart
      
     var barchart = dc.barChart("#test2");

    barchart
        .width(600)
        .height(480)
        .x(d3.scaleLinear().domain([minDate, maxDate]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));


    barchart.legend(dc.legend().x(75).y(10).itemHeight(13).gap(5)
        .legendText(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return (sectors[d.name - 1]);
        }));
        
        dc.override(barchart, 'legendables', function() {
              var items = barchart._legendables();
              return items.reverse();
          });
        
    for (var i = 2; i < 6; i++) {
        barchart.stack(filtered_group, '' + i, sel_stack(i));
    }
    

}

function makeTFCFuelTypeGraph(ndx) {
    var year_dim = ndx.dimension(dc.pluck('Year'));

    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;

    var energySumGroup = year_dim.group().reduce(function(p, v) {

        p[v.fuelNum] = (p[v.fuelNum] || 0) + v.ktoe;
        return p;
    }, function(p, v) {
        p[v.fuelNum] = (p[v.fuelNum] || 0) - v.ktoe;
        return p;
    }, function() {
        return {};
    });

    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }
    var chart = dc.lineChart("#test1");

    chart
        .width(600)
        .height(480)
        .x(d3.scaleLinear().domain([minDate, maxDate]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .title(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return fuels[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .renderArea(true)
        .brushOn(false)
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(energySumGroup, '1', sel_stack('1'));

    chart.legend(dc.legend().x(100).y(10).itemHeight(13).gap(5)
        .legendText(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return (fuels[d.name - 1]);
        }));

    dc.override(chart, 'legendables', chart._legendables);

    dc.override(chart, 'legendables', function() {
        var legendables = this._legendables();
        if (!this.dashStyle()) {
            return legendables.reverse();
        }
        return legendables.map(function(l) {
            l.dashstyle = this.dashStyle();
            return l.reverse();
        });
    });

    chart.xAxis().tickFormat(d3.format('d'));

    for (var i = 2; i < 8; i++) {
        chart.stack(energySumGroup, '' + i, sel_stack(i));
    }

}
