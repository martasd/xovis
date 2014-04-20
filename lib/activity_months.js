var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

/**
 * Creates a months graph with data from multiple deployments.
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

    db.getView('xovis-couchapp', 'months',
               {'group':'true', 'startkey':[current_deployment], 'endkey':[current_deployment, {}]},
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


                 var stats = {
                   names: [],
                   counts: []
                 };

                 var month, instances;
                 for (i = 0; i < data.rows.length; i++) {
                   month = data.rows[i].key[1];
                   instances = data.rows[i].value;
                   stats.counts[month_num[month]] = instances;
                 }

                 stats.names = month_names;
                 var series = {
                   name: current_deployment,
                   data: stats.counts
                 }

                 options.series.push(series);
                 options.xAxis.categories = stats.names;
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
      type: 'bar'
    },
    title: {
      text: 'Activity Use By Months'
    },
    xAxis: {
      title: {
        text: 'Month',
        offset: 60,
        rotation: 0
      }
    },
    yAxis: {
      title: {
        text: "Launched<br/> Instances",
        offset: 30
      }
    },
    series: []
  }; // options

  create_graph(deployments, options);

}; // create_chart