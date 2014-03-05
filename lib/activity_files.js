var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

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
        text: 'Activity Name',
        offset: 30
      }
    },
    yAxis: {
      title: {
        text: "Files<br/> Generated",
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

  var stats = {
    names: [],
    counts: []
  };


  db.getList('xovis-couchapp', 'sort', 'files',
             {'group':'true', 'startkey':[deployment], 'endkey':[deployment, {}]},
             function (err, data) {
               if (err) {
                 return alert(err);
               }
               for (var i = 0; i < data.rows.length; i++) {
                 stats.names.push(data.rows[i].key[1]);
                 stats.counts.push(data.rows[i].value);
               }

               var series = {
                 name: "Number of files created",
                 data: stats.counts
               }

               options.series.push(series);
               options.xAxis.categories = stats.names;
               var chart = new Highcharts.Chart(options);
             });
};