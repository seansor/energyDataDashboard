Promise.all([
    d3.csv("data/populationStats.csv"),
    d3.csv("data/TFC.csv")
]).then(function(datafile) {
    makePopGraph(datafile[0]);
    makeTFCGraph(datafile[1]);

});



function makePopGraph(populationStats) {
    var ndx = crossfilter(populationStats);
    var year_dim = ndx.dimension(dc.pluck('Year'));
    populationStats.forEach(function(d) {
        d.Population = parseFloat(d.Population.replace(/,/g, ''));
        var parseYear = d3.timeParse('%Y');
        d.Year = parseYear(d.Year);
    });


    var year_dim = ndx.dimension(dc.pluck('Year'));
    /*var population = year_dim.groupAll()('Population');*/
    var population = year_dim.group().reduceSum(dc.pluck('Population'));


    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;

    var pop_dim = ndx.dimension(dc.pluck('Population'));

    var minPop = pop_dim.bottom(1)[0].Population;
    var maxPop = pop_dim.top(1)[0].Population;

    dc.lineChart("#population-chart")
        .width(600)
        .height(400)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(year_dim)
        .group(population)
        .transitionDuration(500)
        .y(d3.scaleLinear().domain([2000, maxPop]))
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .yAxisLabel("'000 People")
        .xAxisLabel("Year")
        .brushOn(false)
        .renderDataPoints({ radius: 2, fillOpacity: 0.8, strokeOpacity: 0.0 });
        

    dc.renderAll();
}

function makeTFCGraph(data) {
    var ndx = crossfilter(data);
    var year_dim = ndx.dimension(dc.pluck('Year'));
    
    var minDate = year_dim.bottom(1)[0].Year;
    var maxDate = year_dim.top(1)[0].Year;
    
    data.forEach(function(d) {
        var parseYear = d3.timeParse('%Y');
        d.Year = parseYear(d.Year);
        
        d.Sector == "Transport"? d.Sector = 1
        : d.Sector == "Residential"? d.Sector = 2
        : d.Sector == "Industry"? d.Sector = 3
        : d.Sector == "Services"? d.Sector = 4
        : d.Sector = 5;

    });

    var energySumGroup = year_dim.group().reduce(function(p, v) {
            var tfcBySector = v.Coal+v.Peat+v.Oil+v.NatGas+v.Renewable+v.NonRenWaste+v.Elec;
            p[v.Sector] = (p[v.Sector] || 0) + tfcBySector;
            return p;
        }, function(p, v) {
            tfcBySector = v.Coal+v.Peat+v.Oil+v.NatGas+v.Renewable+v.NonRenWaste+v.Elec
            p[v.Sector] = (p[v.Sector] || 0) - tfcBySector;
            return p;
        }, function() {
            return {};
        });


    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }
    var chart = dc.lineChart("#test");
    chart
        .width(768)
        .height(480)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .margins({ left: 50, top: 10, right: 10, bottom: 20 })
        .renderArea(true)
        .brushOn(false)
        .renderDataPoints(true)
        .clipPadding(10)
        .yAxisLabel("This is the Y Axis!")
        .dimension(year_dim)
        .group(energySumGroup, "1", sel_stack('1'));
    for (var i = 2; i < 6; ++i)
        chart.stack(energySumGroup, '' + i, sel_stack(i));
    chart.render();
}
