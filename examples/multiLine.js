var data = [
    {date: new Date('2015-10-01'), close: 4},
    {date: new Date('2015-10-02'), close: 8},
    {date: new Date('2015-10-05'), close: 15},
    {date: new Date('2015-10-06'), close: 16},
    {date: new Date('2015-10-07'), close: 23},
    {date: new Date('2015-10-08'), close: 42}
];

var chart = fc.chart.linearTimeSeries()
    .xDomain([new Date('2015-09-30'), new Date('2015-10-10')])
    .yDomain([0, 50]);

var line = fc.series.line();
var line2 = fc.series.line().yValue(function(d) { return d.close * 1.1; });
var line3 = fc.series.line().yValue(function(d) { return d.close * 1.2; });

var multi = fc.series.multi()
    .series([fc.annotation.gridline(), line, line2, line3]);

chart.plotArea(multi);

d3.select('#chart')
    .datum(data)
    .call(chart);