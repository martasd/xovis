var highcharts = require('lib/highstock');

// set default chart options
exports.set_default_options = function () {

    Highcharts.setOptions({
    chart: {
      renderTo: 'center-container',
      height: 800
    },
    credits: {
      text: 'Built using Highcharts JS',
      style: {
	cursor: 'pointer',
	color: '#2f7ed8',
	fontSize: '12px'
      }
    },
    title: {
      align: 'center'
    },
    xAxis: {
      title: {
        offset: 20
      }
    },
    yAxis: {
      title: {
        offset: 80,
        rotation: 0
      }
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      y: 100,
      layout: 'vertical',
      title: {
        text: 'Deployments <br/><span style="font-size: 10px; color: #666; font-weight: normal">(Click to hide)</span>',
        style: {
          fontStyle: 'italic'
        }
      }
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
    ]
    });
}