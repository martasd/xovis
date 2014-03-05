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
      text: 'Activity Use By Months'
    },
    xAxis: {
      title: {
        text: 'Month',
        offset: 30
      }
    },
    yAxis: {
      title: {
        text: "Launched<br/> Instances",
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


  db.getView('xovis-couchapp', 'months',
             {'group':'true', 'startkey':[deployment], 'endkey':[deployment, {}]},
             function (err, data) {
               if (err) {
                 return alert(err);
               }

               var month_names = [ "January", "February", "March", "April", "May", "June",
                                   "July", "August", "September", "October",
                                   "November", "December" ];

               // keep track of month's order in a year
               var month_num = {};
               for (var i = 0; i < month_names.length; i++)
                 month_num[month_names[i]] = i;

               var month, instances;
               for (i = 0; i < data.rows.length; i++) {
                 month = data.rows[i].key[1];
                 instances = data.rows[i].value;
                 stats.counts[month_num[month]] = instances;
               }

               stats.names = month_names;
               var series = {
                 name: "Months",
                 data: stats.counts
               }

               options.series.push(series);
               options.xAxis.categories = stats.names;
               var chart = new Highcharts.Chart(options);
             });
};