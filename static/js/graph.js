Promise.all([
    d3.csv("data/populationStats.csv"),
    d3.csv("data/TFC.csv")
]).then(function(datafile) {
    makePopGraph(datafile[0]);
    makeGNIGraph(datafile[0]);
    makeTFCGraphs(datafile[1]);
    makeTFCPieCharts(datafile[1]);
});



function makePopGraph(data) {
    var ndx = crossfilter(data);

    data.forEach(function(d) {
        d.Population = parseFloat(d.Population.replace(/,/g, ''));
        d.Year = parseInt(d.Year.replace(/,/g, ''), 10);
    });


    var year_dim = ndx.dimension(dc.pluck('Year'));

    var population = year_dim.group().reduceSum(dc.pluck('Population'));


    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;

    var pop_dim = ndx.dimension(dc.pluck('Population'));

    var minPop = pop_dim.bottom(1)[0].Population;
    var maxPop = pop_dim.top(1)[0].Population;

    var chart = dc.lineChart("#population-chart")

    chart
        .width(null)
        .height(null)
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

function makeGNIGraph(data) {
    var ndx = crossfilter(data);

    data.forEach(function(d) {
        isNaN(parseFloat(d.GNI))? d.GNI='': d.GNI = parseFloat(d.GNI).toFixed(2);
    });


    var year_dim = ndx.dimension(dc.pluck('Year'));
    
    //revisit issue with final data point
    
/*    year_dim.filter(function(d){
       if(d<2018) {
           var year = d;
       }else {
           d=undefined;
       }
     return year;
    });*/
    
/*    console.log(year_dim.group());*/

    var gni_group = year_dim.group().reduceSum(dc.pluck('GNI'));


    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;

    var gni_dim = ndx.dimension(dc.pluck('GNI'));

    var minGNI = gni_dim.bottom(1)[0].GNI;
    var maxGNI = gni_dim.top(1)[0].GNI;

    var chart = dc.lineChart("#gni-chart")

    chart
        .width(null)
        .height(null)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(gni_group)
        .transitionDuration(500)
        .y(d3.scaleLinear().domain([minGNI, maxGNI]))
        .x(d3.scaleLinear().domain([1990, 2017]))
        .yAxisLabel("USD/Capita")
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
    sector_selector(ndx);
    makeTFCSectorGraphs(ndx);
    makeTFCFuelTypeGraphs(ndx);


    dc.renderAll();
}

//Sector select Menu

function sector_selector(ndx) {
    var dim = ndx.dimension(function(d) { return d.Sector });
    var group = dim.group();
    var select = dc.selectMenu("#sector_selector")
        .dimension(dim)
        .group(group);

    select.title(function(d) {
        return d.key;
    });
}


//Total Final Consumption (TFC)/Total Final Energy Graphs

function makeTFCSectorGraphs(ndx) {
    
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

    var chart = dc.lineChart("#TFCbySector_area");

    chart
        .width(600)
        .height(500)
        .x(d3.scaleLinear().domain([minDate, maxDate+1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .renderArea(true)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));

    chart.xAxis().tickFormat(d3.format('d'));
    
    chart.legend(dc.legend().x(75).y(10).itemHeight(13).gap(5)
        .legendText(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return (sectors[d.name - 1]);
        }));


    //reverse order of legend to match order of chart
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
    
    //loop to stack each sector

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
      
    var barChart = dc.barChart("#TFCbySector_bar");
    
    /*var anchorHeight = $(".tfcChart").height();
    console.log(anchorHeight);
    var anchorWidth = $(".tfcChart").width();*/

    /*var getHeight = function(anchor) {
        return anchor.height();
    };*/

    barChart
        .width(600)
        .height(500)
        .x(d3.scaleLinear().domain([2008, maxDate+1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));


    barChart.legend(dc.legend().x(75).y(10).itemHeight(13).gap(5)
        .legendText(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return (sectors[d.name - 1]);
        }));
        
        dc.override(barChart, 'legendables', function() {
              var items = barChart._legendables();
              return items.reverse();
          });
        
    for (var i = 2; i < 6; i++) {
        barChart.stack(filtered_group, '' + i, sel_stack(i));
    }
    
}

function makeTFCFuelTypeGraphs(ndx) {
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
    
    //render area chart
    
    var chart = dc.lineChart("#TFCbyFuel_area");

    chart
        .width(600)
        .height(500)
        .x(d3.scaleLinear().domain([minDate, maxDate+1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .transitionDuration(500)
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

    chart.xAxis().tickFormat(d3.format('d'));

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

    for (var i = 2; i < 8; i++) {
        chart.stack(energySumGroup, '' + i, sel_stack(i));
    }
    
    //render barchart
      
    var barchart = dc.barChart("#TFCbyFuel_bar");

    barchart
        .width(600)
        .height(500)
        .x(d3.scaleLinear().domain([2008, maxDate+1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderTitle(true)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return fuels[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(energySumGroup, '1', sel_stack('1'));


    barchart.legend(dc.legend().x(75).y(10).itemHeight(13).gap(5)
        .legendText(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return (fuels[d.name - 1]);
        }));
        
        dc.override(barchart, 'legendables', function() {
              var items = barchart._legendables();
              return items.reverse();
          });
        
    for (var i = 2; i < 8; i++) {
        barchart.stack(energySumGroup, '' + i, sel_stack(i));
    }
    

}

function makeTFCPieCharts(data) {

    //Render Pie Chart
    
    var ndx = crossfilter(data);
    var pieChart1 = dc.pieChart("#TFCbySector_pie");
    var pieChart2 = dc.pieChart("#TFCbyFuel_pie");
    
    var year_dim = ndx.dimension(dc.pluck('Year'));

    
    year_dim.filter(function(d) {
        return d === 2017;
    });
    
    var sector_dim = ndx.dimension(dc.pluck('Sector'));
    var fuel_dim = ndx.dimension(dc.pluck('Fuel'));

    var sectorSumGroup = sector_dim.group().reduceSum(function(d) {return d.ktoe;});
    var fuelSumGroup = fuel_dim.group().reduceSum(function(d) {return d.ktoe;});

   
    
    pieChart1
      .width(null)
      .height(400)
      .innerRadius(100)
      .dimension(sector_dim)
      .group(sectorSumGroup)
      .transitionDuration(500)
      .legend(dc.legend())
      // workaround for #703: not enough data is accessible through .label() to display percentages
      .on('pretransition', function(pieChart1) {
          pieChart1.selectAll('text.pie-slice').text(function(d) {
              return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
          });
      });
      
      pieChart1.ordinalColors(['#1f78b4', '#b2df8a', '#cab2d6']);
    
    pieChart2
        .width(null)
        .height(400)
        .innerRadius(100)
        .dimension(fuel_dim)
        .group(fuelSumGroup)
        .transitionDuration(500)
        .legend(dc.legend())
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function(pieChart1) {
            pieChart1.selectAll('text.pie-slice').text(function(d) {
                return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
            });
        });
        
        pieChart2.ordinalColors(['#1f78b4', '#b2df8a', '#cab2d6']);
        
        
    dc.renderAll();

}