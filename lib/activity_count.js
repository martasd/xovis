var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

exports.create_chart = function(deployment) {
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
    series: [{}]
  };

  var stats = {
    names: [],
    counts: []
  };

  db.getList('xovis-couchapp', 'sort', 'activity',
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
                 name: "Instances Launched",
                 data: stats.counts
               }

               options.series.push(series);
               options.xAxis.categories = stats.names;
               console.log(JSON.stringify(options));
               var chart = new Highcharts.Chart(options);
             });

  var tip = $(document.createElement("h4")).attr({id: 'dragtip',
                                                  class: 'tip'});
  var tipText = $(document.createTextNode('Drag your mouse vertically to zoom on a \
range of activities!'));
  tip.append(tipText);
  $('#right-container').append(tip);
};