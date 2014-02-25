var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highcharts');
var db = require('db').current();

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
        text: 'Activity Name',
        offset: 30
      }
    },
    yAxis: {
      title: {
        text: "Shared<br/> Instances",
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

  var stats = {
    names: [],
    counts: []
  };

  db.getList('xovis-couchapp', 'sort', 'share',
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
                 name: "Number of activities shared",
                 data: stats.counts
               }

               options.series.push(series);
               options.xAxis.categories = stats.names;
               var chart = new Highcharts.Chart(options);
             });
};