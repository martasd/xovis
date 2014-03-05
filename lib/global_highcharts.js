var highcharts = require('lib/highstock');

// set default chart options
exports.set_default_options = function () {

    Highcharts.setOptions({
    chart: {
      renderTo: 'center-container'
    },
    credits: {
      text: 'Built using Highcharts JS'
    },
    title: {
      align: 'center'
    },
    xAxis: {
      title: {
        offset: 30
      }
    },
    yAxis: {
      title: {
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
    }
    });
}