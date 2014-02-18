var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highcharts');

exports.create_chart = function(deployment) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      renderTo: 'center-container',
      type: 'area'
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
        text: "Shared Instances",
        offset: 100,
        rotation: 0
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: '#77a1e5'
      }
    },
    series: [{}]
  };

  // retrieve local json file
  var filepath = "data/" + deployment + "/activity_share.json";
  $.getJSON(filepath)
  .done(function (data) {

    var series = {
      name: "Number of activities shared",
      data: data.stats
    }

    options.series.push(series);
    options.xAxis.categories = data.categories;
    var chart = new Highcharts.Chart(options);

  });
};