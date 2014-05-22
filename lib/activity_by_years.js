var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

var deployments_num = null;

/**
 * Use with filter to select unique values from an array.
 *
 * source: http://stackoverflow.com/questions/1960473/unique-values-in-an-array
 */
function only_unique(value, index, self) {
  return self.indexOf(value) === index;
}


/**
 * Creates Activity by years graph with data from multiple deployments.
 *
 * @param {array} deployments - deployments selected by user
 * @param {json} options - highcharts options to append 'series' to
 */
function create_graph(deployments, options) {

  if (deployments.length == 0) {
    var chart = new Highcharts.Chart(options);
  }
  else {
    var current_deployment = deployments[0];
    var remaining_deployments = deployments.slice(1);

    db.getView('xovis-couchapp', 'activity_by_years',
             {'group':'true', 'startkey':[current_deployment],
              'endkey':[current_deployment, {}, {}]},

             function (err, data) {
               if (err) {
                 return alert(err);
               }

               // all_series is a dictionary of activities with their corresponding
               // instances per year
               var all_series = {};
               var single_series = {};
               var activity_name, series_name, year_count, year;
               var categories = [];
               for (var i = 0; i < data.rows.length; i++) {
                 // append to an existing series if it already exists
                 activity_name = data.rows[i].key[1];
                 year_count = data.rows[i].value;
                 year = data.rows[i].key[2];

                 if (deployments_num > 1) {
                   series_name = current_deployment + ": " + activity_name;
                 }
                 else {
                   series_name = activity_name;
                 }

                 if (all_series[series_name] != undefined) {
                   // we have found an existing activity series
                   all_series[series_name].data.push(year_count);
                 }
                 else {
                   // else create a new series
                   single_series = {
                     name: series_name,
                     data: [year_count],
                     selected: true
                   };
                   all_series[series_name] = single_series;
                 }

                 categories.push(year);
               }

               // append all series to options
               for (var series in all_series) {
                 options.series.push(all_series[series]);
               }

               categories = categories.filter(only_unique);
               categories.sort(function (a,b) { return a - b; });
               options.xAxis.categories = categories;

               create_graph(remaining_deployments, options);
             }); // db.getView
  }
} //create_graph


exports.create_chart = function(deployments) {
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
    },

    series: []
  }; // options

  deployments_num = deployments.length;

  create_graph(deployments, options);

}; // create_chart