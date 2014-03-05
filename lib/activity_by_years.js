var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

exports.create_chart = function(deployment) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      type: 'line',
      marginRight: 180,
      zoomType: 'x'
    },
    title: {
      text: 'Activity Use By Years'
    },
    xAxis: {
      title: {
        text: 'Year'
      },
      minRange: 1
    },
    yAxis: {
      title: {
        text: 'Launched<br/> Instances'
      }
    },
    legend: {
      enabled: true,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      title: {
        text: 'Click on a label <br/>to toggle its display',
        style: {
          fontWeight: 'normal',
          padding: '5px'
        }
      }
    }
  };

  // source: http://stackoverflow.com/questions/1960473/unique-values-in-an-array
  function only_unique(value, index, self) {
    return self.indexOf(value) === index;
  }

  db.getView('xovis-couchapp', 'activity_by_years',
             {'group':'true', 'startkey':[deployment], 'endkey':[deployment,
             {}, {}]},
             function (err, data) {
               if (err) {
                 return alert(err);
               }

               // all_series is a dictionary of activities with their corresponding
               // instances per year
               var all_series = {};
               var single_series = {};
               var activity_name, year_count, year;
               var categories = [];
               for (var i = 0; i < data.rows.length; i++) {
                 // append to an existing series if it already exists
                 activity_name = data.rows[i].key[1];
                 year_count = data.rows[i].value;
                 year = data.rows[i].key[2];
                 if (all_series[activity_name] != undefined) {
                   // we have found an existing activity series
                   all_series[activity_name].data.push(year_count);
                 }
                 else {
                   // else create a new series
                   single_series = {
                     name: activity_name,
                     data: [year_count],
                     selected: true
                   };
                   all_series[activity_name] = single_series;
                 }

                 categories.push(year);
               }

               // convert series to an array
               var series = [];
               for (var activity in all_series) {
                 series.push(all_series[activity]);
               }

               categories = categories.filter(only_unique);
               categories.sort(function (a,b) { return a - b; });
               options.series = series;
               options.xAxis.categories = categories;
               var chart = new Highcharts.Chart(options);
             });
};