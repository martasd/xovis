var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var helpers = require('lib/helpers');

exports.create_chart = function(deployments) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Activity Files Generated'
    },
    xAxis: {
      title: {
        text: 'Activity Name'
      }
    },
    yAxis: {
      title: {
        text: "Files<br/> Created"
      }
    },
    plotOptions: {
    },
    series: []
  };

  helpers.create_graph(deployments, 'files', options);
}; // create_chart