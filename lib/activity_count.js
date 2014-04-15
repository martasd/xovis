var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var helpers = require('lib/helpers');

exports.create_chart = function(deployments) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      type: 'bar',
      zoomType: 'x'
    },
    title: {
      text: 'Activity Frequency'
    },
    xAxis: {
      title: {
        text: 'Activity<br/> Name',
        offset: 100,
        rotation: 0
      }
    },
    yAxis: {
      title: {
        text: "Launched Instances",
        offset: 30
      }
    },
    plotOptions: {
      bar: {
        pointWidth: 10
      },
      series: {
        colorByPoint: true
      }
    },
    legend: {
      enabled: false
    },
    series: []
  };

  helpers.create_graph(deployments,'activity', options);

  // show a tip for the user
  var tip = $(document.createElement("h4")).attr({id: 'dragtip', class: 'tip'});
  var tipText = $(document.createTextNode('Drag your mouse vertically to zoom on a range of activities!'));
  tip.append(tipText);
  $('#right-container').prepend(tip);
}; // create_chart