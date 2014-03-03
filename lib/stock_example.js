var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');

exports.create_chart = function() {
var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();


	                    var options =        {
	                              chart: {
                                        renderTo: 'center-container'
	                              },


	                              yAxis: [{
	                                title: {
	                                  text: 'GOOGL'
	                                }
	                              }, {
	                                title: {
	                                  text: 'MSFT'
	                                },
	                                gridLineWidth: 0,
	                                opposite: true
	                              }],

	                              rangeSelector: {
	                                selected: 1
	                              },

	                              series: [{
	                                name: 'GOOGL',
	                                data: GOOGL
	                              }, {
	                                name: 'MSFT',
	                                data: MSFT,
	                                yAxis: 1
	                              }]
	                             };

  var chart = new Highcharts.StockChart(options);
};
