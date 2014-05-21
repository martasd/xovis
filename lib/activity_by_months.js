var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

/**
 * Creates Activity by months graph with data from multiple deployments.
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

    db.getView('xovis-couchapp', 'activity_by_months',
               {'group':'true', 'startkey':[current_deployment],
                'endkey':[current_deployment, {}, {}]},

               function (err, data) {
                 if (err) {
                   return alert(err);
                 }

                 // all_series is a dictionary of activities with their corresponding
                 // instances per month
                 var all_series = {};
                 var single_series = {};
                 var activity_name, series_name, month_count, year, month, timestamp, datapoint;
                 for (var i = 0; i < data.rows.length; i++) {
                   // append to an existing series if it already exists
                   activity_name = data.rows[i].key[1];
                   series_name = current_deployment + ": " + activity_name;
                   year = data.rows[i].key[2];
                   month = data.rows[i].key[3];
                   month_count = data.rows[i].value;
                   // any day of the month will do since we are only interested
                   // in count per month
                   timestamp = Date.UTC(year, month, 1);
                   datapoint = [timestamp, month_count];
                   if (all_series[series_name] != undefined) {
                     // we have found an existing activity series
                     all_series[series_name].data.push(datapoint);
                   }
                   else {
                     // else create a new series
                     single_series = {
                       name: series_name,
                       data: [datapoint],
                       selected: true
                     };
                     all_series[series_name] = single_series;
                   }
                 }

                 // append all series to options
                 for (var series in all_series) {
                   options.series.push(all_series[series]);
                 }

                 create_graph(remaining_deployments, options);
               }); // db.getView
  }
} // create_graph


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
      text: 'Activity Use By Months'
    },
    xAxis: {
      title: {
        text: 'Month'
      },
      type: 'datetime',
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

  create_graph(deployments, options);
};