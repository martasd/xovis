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
      text: 'Activity Use By Years'
    },
    xAxis: {
      title: {
        text: 'Year'
      }
    },
    yAxis: {
      title: {
        text: "Launched<br/> Instances"
      }
    },
    series: []
  };

  helpers.create_graph(deployments, 'years', options);

};