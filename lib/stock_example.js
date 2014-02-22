var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var usdeur = require('lib/usdeur');

exports.create_chart = function(deployment) {
  $(document).ready(function() {

    var options = {
	    chart: {
              renderTo: 'center-container'
	    },

	    rangeSelector: {
	    	enabled: false
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	};

    var chart = new Highcharts.StockChart(options);
  });
};
