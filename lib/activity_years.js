var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

exports.create_chart = function(deployment) {
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
    plotOptions: {
      column: {
        color: '#77a1e5'
      }
    },
    series: [{}]
  };

  var stats = {
    names: [],
    counts: []
  };


  db.getView('xovis-couchapp', 'years',
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
                 name: "Activities Launched",
                 data: stats.counts
               }

               options.series.push(series);
               options.xAxis.categories = stats.names;
               var chart = new Highcharts.Chart(options);
             });
};