var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highcharts');

exports.create_chart = function(deployment) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      renderTo: 'center-container',
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
        text: "Files Generated",
        offset: 100,
        rotation: 0
      }
    },
    legend: {
      enabled: false
    },
    colors: [
      '#2f7ed8',
      '#0d233a',
      '#8bbc21',
      '#910000',
      '#1aadce',
      '#492970',
      '#f28f43',
      '#77a1e5',
      '#c42525',
      '#a6c96a'
    ],
    plotOptions: {
      series: {
      }
    },
    series: [{}]
  };

  // retrieve local json file
  var filepath = "data/" + deployment + "/activity_files.json";
  $.getJSON(filepath)
  .done(function (data) {

    var series = {
      name: "Number of files created",
      data: data.stats
    }

    options.series.push(series);
    options.xAxis.categories = data.categories;
    var chart = new Highcharts.Chart(options);
  });
};