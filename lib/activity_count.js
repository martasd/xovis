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
                 name: "Number of instances launched",
                 data: stats.counts
               }

               options.series.push(series);
               options.xAxis.categories = stats.names;
               console.log(JSON.stringify(options));
               var chart = new Highcharts.Chart(options);
             });

  var tip = $(document.createElement("h4"));
  var tipText = $(document.createTextNode('Drag your mouse vertically to zoom on a \
range of activities!'));
  tip.append(tipText);
  $('#right-container').append(tip);
};