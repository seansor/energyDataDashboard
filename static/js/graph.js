Promise.all([
    d3.csv("data/populationStats.csv"),
    d3.csv("data/TFC.csv"),
    d3.csv("data/ghg.csv")
]).then(function(datafile) {
    makePopGraph(datafile[0]);
    showCurrentPop(datafile[0]);
    showGNIdata(datafile[0]);
    makeGNIGraph(datafile[0]);
    showTFCdata(datafile[1]);
    makeTFCGraphs(datafile[1]);
    makeTFCPieCharts(datafile[1]);
    makeghgGraphs(datafile[2]);
    makeghgPieCharts(datafile[2]);
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
        .height(400)
        .minWidth(600)
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

function showCurrentPop(data) {
    var ndx = crossfilter(data);

    var year_dim = ndx.dimension(dc.pluck('Year'));


    year_dim.filter(function(d) {
        return d === 2018;
    });

    var currentPop = ndx.groupAll().reduceSum(function(d) { return d.Population });

    dc.numberDisplay("#currentPop")
        .formatNumber(d3.format(".3s"))
        .valueAccessor(function(d) {
            return d * 1000;
        })
        .group(currentPop);

    var popChange = ndx.groupAll().reduceSum(function(d) { return d.Population_change });

    dc.numberDisplay("#popChange")
        .formatNumber(d3.format(",d"))
        .valueAccessor(function(d) {
            return d * 1000;
        })
        .group(popChange);
}

function showGNIdata(data) {
    var ndx = crossfilter(data);

    var year_dim = ndx.dimension(dc.pluck('Year'));


    year_dim.filter(function(d) {
        return (d > 2015 && d < 2018);
    });

    var GNIincrease = ndx.groupAll().reduce(
        function(p, v) {
            p.count++;
            if (p.count < 2) {
                p.increase = 0;
                p.prevGNI = v.GNI;
            }
            else {
                p.increase = v.GNI / p.prevGNI;
                p.prevGNI = v.GNI;
            }
            return p;
        },

        function(p, v) {
            p.count--;
            if (p.count < 2) {
                p.increase = 0;
                p.prevGNI = v.GNI;
            }
            else if (p.count == 0) {
                p.increase = 0;
                p.prevGNI = v.GNI;
            }
            else {
                p.increase = v.GNI / p.prevGNI;
                p.prevGNI = v.GNI;
            }
            return p;
        },

        function() {
            return { count: 0, increase: 0, prevGNI: 0 };
        }
    );



    dc.numberDisplay("#GNIincrease")
        .formatNumber(d3.format(",.1%"))
        .valueAccessor(function(d) {
            return d.increase - 1;
        })
        .group(GNIincrease);
}


function makeGNIGraph(data) {
    var ndx = crossfilter(data);

    data.forEach(function(d) {
        isNaN(parseFloat(d.GNI)) ? d.GNI = '' : d.GNI = parseFloat(d.GNI).toFixed(2);
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
        .height(400)
        .minWidth(600)
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


/*---------------------Need to resolve this function--------------------*/

function showTFCdata(data) {
    var ndx = crossfilter(data);

    /*var year_dim = ndx.dimension(dc.pluck('Year'));*/

    data.forEach(function(d) {

        d.Year = parseInt(d.Year, 10);

        d.ktoe = +(parseFloat(d.ktoe.replace(/,/g, '')).toFixed(2));

    });


    var TFCincrease = ndx.groupAll().reduce(
        function(p, v) {
            if (v.Year == 2016) {
                p.yearTotal_16 += v.ktoe;
                p.count16++;
                
            }
            else if (v.Year == 2017) {
                p.yearTotal_17 += v.ktoe;
                p.count17++;

            }
            
            if (p.count16>0 && p.count17>0) {
                p.increase = p.yearTotal_17/p.yearTotal_16;
            }
            return p;
        },

        function(p, v) {
            if (v.Year == 2016) {
                if(p.count16=0) {
                    p.yearTotal_16 = 0;
                    p.count16 = 0;
                } else {
                    p.yearTotal_16 -= v.ktoe;
                    p.count16--;
                }
                
            }
            else if (v.Year == 2017) {
                if(p.count17=0) {
                    p.yearTotal_17 = 0;
                    p.count17 = 0;
                }else {
                    p.yearTotal_17 -= v.ktoe;
                    p.count17--;
                }
            }
            
            if (p.count16>0 && p.count17>0) {
                p.increase = p.yearTotal_17/p.yearTotal_16;
            }else{
                p.increase = 0;
            }
            return p;
        },

        function() {
            return { count16: 0, count17: 0, increase: 0, yearTotal_16: 0, yearTotal_17: 0 };
        }
    );


    dc.numberDisplay("#TFCincrease")
        .formatNumber(d3.format(",.1%"))
        .group(TFCincrease)
        .valueAccessor(function(d) {
            
            return d.increase-1;
        });
        
        
        var transportPercentage = ndx.groupAll().reduce(
        function(p, v) {
            if (v.Year == 2017) {
                p.total += v.ktoe;
                if(v.Sector == "Transport"){
                    p.transportTotal +=v.ktoe;
                }
                
            }
            
            if (p.total>0){
                p.transportRatio = p.transportTotal/p.total;
            }
            return p;
        },

        function(p, v) {
            if (v.Year == 2017) {
                p.total -= v.ktoe;
                if(v.Sector == "Transport"){
                    p.transportTotal -=v.ktoe;
                }
                
            }
            
            if (p.total>0){
                p.transportRatio = p.transportTotal/p.total;
            }
            return p;
        },

        function() {
            return { total: 0, transportTotal: 0, transportRatio:0};
        }
    );


    dc.numberDisplay("#transportRatio")
        .formatNumber(d3.format(",.1%"))
        .group(transportPercentage)
        .valueAccessor(function(d) {
            
            return d.transportRatio;
        });
        
        
        var oilPercentage = ndx.groupAll().reduce(
        function(p, v) {
            if (v.Year == 2017) {
                p.total += v.ktoe;
                if(v.Fuel == "Oil"){
                    p.oilTotal +=v.ktoe;
                }
                
            }
            
            if (p.total>0){
                p.oilRatio = p.oilTotal/p.total;
            }
            return p;
        },

        function(p, v) {
            if (v.Year == 2017) {
                p.total -= v.ktoe;
                if(v.Sector == "oil"){
                    p.oilTotal -=v.ktoe;
                }
                
            }
            
            if (p.total>0){
                p.oilRatio = p.oilTotal/p.total;
            }
            return p;
        },

        function() {
            return { total: 0, oilTotal: 0, oilRatio:0};
        }
    );


    dc.numberDisplay("#oilRatio")
        .formatNumber(d3.format(",.1%"))
        .group(oilPercentage)
        .valueAccessor(function(d) {
            
            return d.oilRatio;
        });
}

/*!---------------------Need to resolve this function--------------------*/


function makeTFCGraphs(data) {

    data.forEach(function(d) {

        d.Year = parseInt(d.Year, 10);

        /*d.ktoe = +(parseFloat(d.ktoe.replace(/,/g, '')).toFixed(2));*/


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
    fuel_selector(ndx);
    makeTFCSectorGraphs(ndx);
    makeTFCFuelTypeGraphs(ndx);


    /*        function hideGraphs() {
            $(".tfcChartHidden").hide();
        }

        function renderAndHide (callback) {
            dc.renderAll();
            callback();   
        }
        
        renderAndHide(hideGraphs);
    }*/

    dc.renderAll();
}

function makeghgGraphs(data) {

    data.forEach(function(d) {

        d.Year = parseInt(d.Year, 10);

        d.Emissions = parseInt(d.Emissions, 10);


        d.Sector == "Agriculture" ? d.sectorNum = 4 :
            d.Sector == "Energy related Non-ETS" ? d.sectorNum = 3 :
            d.Sector == "Other non-ETS" ? d.sectorNum = 2 :
            d.sectorNum = 1;

    });


    var ndx = crossfilter(data);
    makeghgSectorGraphs(ndx);


    /*     function hideGraphs() {
            $(".tfcChartHidden").hide();
        }

        function renderAndHide (callback) {
            dc.renderAll();
            callback();   
        }
        
        renderAndHide(hideGraphs);
    }*/

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

//Fuel select Menu

function fuel_selector(ndx) {
    var dim = ndx.dimension(function(d) { return d.Fuel });
    var group = dim.group();
    var select = dc.selectMenu("#fuel_selector")
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

    var colorsArrayDark = ['#3969b1', '#da7c30', '#3e9651', '#cc2529', '#535154', '#6b4c9a', '#922428', '#948b3d'];

    chart
        .width(null)
        .height(450)
        .minWidth(600)
        .x(d3.scaleLinear().domain([minDate, maxDate + 1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 30 })
        .renderTitle(true)
        .renderArea(true)
        .ordinalColors(colorsArrayDark)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("ktoe", 20)
        .xAxisLabel("Year")
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
            all: function() {
                return sourceGroup.all().filter(function(d) {
                    for (i = 0; i < 5; i++) {
                        return Object.values(d.value).some(v => v != 0);
                    }
                });
            }
        };
    }

    //render barchart

    var barChart = dc.barChart("#TFCbySector_bar");
    var colorsArrayLight = ['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210'];




    /*var anchorHeight = $(".tfcChart-container1").height();
    console.log(anchorHeight);
    var anchorWidth = $(".tfcChart").width();

    var getHeight = function(anchor) {
        return anchor.height();
    };*/


    barChart
        .height(450)
        .width(null)
        .minWidth(600)
        .x(d3.scaleLinear().domain([2008, maxDate + 1]))
        .margins({ left: 50, top: 100, right: 10, bottom: 30 })
        .renderTitle(true)
        .ordinalColors(colorsArrayLight)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agri & Fisheries", "Services", "Industry", "Residential", "Transport"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("ktoe", 20)
        .xAxisLabel("Year")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));

    barChart.xAxis().tickFormat(d3.format('d'));

    barChart.legend(dc.legend().x(500).y(0).itemHeight(13).gap(5)
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

    var colorsArrayDark = ['#3969b1', '#da7c30', '#3e9651', '#cc2529', '#535154', '#6b4c9a', '#922428', '#948b3d'];

    chart
        .width(null)
        .height(450)
        .minWidth(600)
        .x(d3.scaleLinear().domain([minDate, maxDate + 1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 30 })
        .renderTitle(true)
        .transitionDuration(500)
        .title(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return fuels[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .renderArea(true)
        .ordinalColors(colorsArrayDark)
        .brushOn(false)
        .clipPadding(10)
        .yAxisLabel("ktoe", 20)
        .xAxisLabel("Year")
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

    var barChart = dc.barChart("#TFCbyFuel_bar");
    var colorsArrayLight = ['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210'];

    barChart
        .width(null)
        .height(450)
        .minWidth(600)
        .x(d3.scaleLinear().domain([2008, maxDate + 1]))
        .margins({ left: 50, top: 100, right: 10, bottom: 30 })
        .renderTitle(true)
        .ordinalColors(colorsArrayLight)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return fuels[this.layer - 1] + ': ' + d.value[this.layer].toFixed(2);
        })
        .clipPadding(10)
        .yAxisLabel("ktoe", 20)
        .xAxisLabel("Year")
        .dimension(year_dim)
        .group(energySumGroup, '1', sel_stack('1'));

    barChart.xAxis().tickFormat(d3.format('d'));

    barChart.legend(dc.legend().x(450).y(0).itemHeight(13).gap(5)
        .legendText(function(d) {
            var fuels = ["Oil", "Natural Gas", "Electricity", "Renewable", "Peat", "Coal", "Non-Renewable Waste"];
            return (fuels[d.name - 1]);
        }));

    dc.override(barChart, 'legendables', function() {
        var items = barChart._legendables();
        return items.reverse();
    });

    for (var i = 2; i < 8; i++) {
        barChart.stack(energySumGroup, '' + i, sel_stack(i));
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

    var sectorSumGroup = sector_dim.group().reduceSum(function(d) { return d.ktoe; });
    var fuelSumGroup = fuel_dim.group().reduceSum(function(d) { return d.ktoe; });

    var colorsArrayLight = ['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210'];

    pieChart1
        .width(null)
        .height(400)
        .innerRadius(100)
        .dimension(sector_dim)
        .group(sectorSumGroup)
        .transitionDuration(500)
        .ordinalColors(colorsArrayLight)
        .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5))
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function(pieChart1) {
            pieChart1.selectAll('text.pie-slice').text(function(d) {
                return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            });
        });
        

    pieChart2
        .width(null)
        .height(400)
        .innerRadius(100)
        .dimension(fuel_dim)
        .group(fuelSumGroup)
        .title(function(d) {
            return d.key + ': ' + d.value.toFixed(2) + ' ktoe';
        })
        .transitionDuration(500)
        .ordinalColors(colorsArrayLight)
        .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5))
        
        
        
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function(pieChart1) {
            pieChart1.selectAll('text.pie-slice').text(function(d) {
                if ((d.endAngle - d.startAngle) > (0.1 * Math.PI)) {
                    return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                }
                else if ((d.endAngle - d.startAngle) < (0.05 * Math.PI)) {
                    return '';
                }
                else {
                    return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                }
            });
        });
        
    
    dc.renderAll();

}

function makeghgPieCharts(data) {

    //Render Pie Chart

    var ndx = crossfilter(data);
    var pieChart = dc.pieChart("#ghg_pie");

    /*data.forEach(function(d) {
        d.Emissions = parseInt(d.Emissions, 10);
        d.Year = parseInt(d.Year.replace(/,/g, ''), 10);
    });*/

    var year_dim = ndx.dimension(dc.pluck('Year'));

    year_dim.filter(function(d) {
        return d === 2017;
    });

    var sector_dim = ndx.dimension(dc.pluck('Sector'));


    var sectorSumGroup = sector_dim.group().reduceSum(function(d) { return d.Emissions; });

    var colorsArrayLight = ['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210'];

    pieChart
        .width(null)
        .height(400)
        .innerRadius(100)
        .dimension(sector_dim)
        .group(sectorSumGroup)
        .transitionDuration(500)
        .ordinalColors(colorsArrayLight)
        .legend(dc.legend().x(10).y(0).itemHeight(13).gap(5))
        // workaround for #703: not enough data is accessible through .label() to display percentages
        .on('pretransition', function(pieChart) {
            pieChart.selectAll('text.pie-slice').text(function(d) {
                return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            });
        });



    dc.renderAll();

}

function makeghgSectorGraphs(ndx) {

    var year_dim = ndx.dimension(dc.pluck('Year'));

    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;

    var emissionsSumGroup = year_dim.group().reduce(function(p, v) {

        p[v.sectorNum] = (p[v.sectorNum] || 0) + v.Emissions;
        return p;
    }, function(p, v) {
        p[v.sectorNum] = (p[v.sectorNum] || 0) - v.Emissions;
        return p;
    }, function() {
        return {};
    });

    var filtered_group = remove_competely_empty_bins(emissionsSumGroup); // fake groups to remove 0 value bins

    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }

    var chart = dc.lineChart("#ghgbySector_area");

    var colorsArrayDark = ['#3969b1', '#da7c30', '#3e9651', '#cc2529', '#535154', '#6b4c9a', '#922428', '#948b3d'];

    chart
        .width(null)
        .height(450)
        .minWidth(600)
        .x(d3.scaleLinear().domain([minDate, maxDate + 1]))
        .margins({ left: 50, top: 10, right: 10, bottom: 30 })
        .renderTitle(true)
        .renderArea(true)
        .ordinalColors(colorsArrayDark)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agriculture", "Energy related Non-ETS", "Other Non-ETS", "ETS"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer];
        })
        .clipPadding(10)
        .yAxisLabel("ktCO2", 20)
        .xAxisLabel("Year")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));

    chart.xAxis().tickFormat(d3.format('d'));

    chart.legend(dc.legend().x(75).y(20).itemHeight(13).gap(5)
        .legendText(function(d) {
            var sectors = ["Agriculture", "Energy related Non-ETS", "Other Non-ETS", "ETS"];
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

    for (var i = 2; i < 5; i++) {
        chart.stack(filtered_group, '' + i, sel_stack(i));
    }

    //Need to revisit this to remove 0 value bins

    function remove_competely_empty_bins(sourceGroup) {
        return {
            all: function() {
                return sourceGroup.all().filter(function(d) {
                    for (i = 0; i < 4; i++) {
                        return Object.values(d.value).some(v => v != 0);
                    }
                });
            }
        };
    }

    //render barchart

    var barChart = dc.barChart("#ghgbySector_bar");
    var colorsArrayLight = ['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210'];




    /*var anchorHeight = $(".tfcChart-container1").height();
    console.log(anchorHeight);
    var anchorWidth = $(".tfcChart").width();

    var getHeight = function(anchor) {
        return anchor.height();
    };*/


    barChart
        .height(450)
        .width(null)
        .minWidth(600)
        .x(d3.scaleLinear().domain([2008, maxDate + 1]))
        .margins({ left: 50, top: 100, right: 10, bottom: 30 })
        .renderTitle(true)
        .ordinalColors(colorsArrayLight)
        .transitionDuration(500)
        .brushOn(false)
        .title(function(d) {
            var sectors = ["Agriculture", "Energy related Non-ETS", "Other Non-ETS", "ETS"];
            return sectors[this.layer - 1] + ': ' + d.value[this.layer];
        })
        .clipPadding(10)
        .yAxisLabel("ktCO2", 20)
        .xAxisLabel("Year")
        .dimension(year_dim)
        .group(filtered_group, '1', sel_stack('1'));

    barChart.xAxis().tickFormat(d3.format('d'));

    barChart.legend(dc.legend().x(20).y(0).itemHeight(13).gap(5)
        .legendText(function(d) {
            var sectors = ["Agriculture", "Energy related Non-ETS", "Other Non-ETS", "ETS"];
            return (sectors[d.name - 1]);
        }));

    dc.override(barChart, 'legendables', function() {
        var items = barChart._legendables();
        return items.reverse();
    });

    for (var i = 2; i < 5; i++) {
        barChart.stack(filtered_group, '' + i, sel_stack(i));
    }



}
