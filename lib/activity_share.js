var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var helpers = require('lib/helpers');

exports.create_chart = function(deployments) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      type: 'column',
      zoomType: 'x'
    },
    title: {
      text: 'Activity Sharing'
    },
    xAxis: {
      title: {
        text: 'Activity Name'
      }
    },
    yAxis: {
      title: {
        text: "Shared<br/>vs. Private<br/> Instances"
      }
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: []
  };

  // create a stacked column chart
  helpers.create_graph(deployments, 'share', options,
                       {stack: deployments.length, appendName: ': private'});
}; // create_chart