var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

/**
 * Creates graph with deployment data
 * Note: Currently uses recursion (haven't figured out how to wait for
 * muptiple db.getList functions to complete using deferred object before
 * creating the graph.
 *
 * @param {array} deployments - deployments selected by user
 * @param {string} view - name of view to be queried
 * @param {json} options - highcharts options
 * @param {json} custom - other custom options
 */
exports.create_graph = function(deployments, view, options, custom) {

  var custom = custom || {};
  if (deployments.length == 0) {
    var chart = new Highcharts.Chart(options);
  }
  else {
    var current_deployment = deployments[0];
    var remaining_deployments = deployments.slice(1);

    db.getList('xovis-couchapp', 'sort', view,
               {'group':'true', 'startkey':[current_deployment], 'endkey':[current_deployment, {}]},
               function (err, data) {
                 if (err) {
                   return alert(err);
                 }

                 var stats = {
                   names: [],
                   counts: []
                 };

                 for (var i = 0; i < data.rows.length; i++) {
                   stats.names.push(data.rows[i].key[1]);
                   stats.counts.push(data.rows[i].value);
                 }

                 var series = {
                   name: current_deployment,
                   data: stats.counts
                 }

                 // series customizations
                 if (custom.appendName != undefined) {
                   series.name += custom.appendName;
                 }

                 if (custom.stack != undefined) {
                   series.stack = custom.stack;
                   custom.stack--;
                 }

                 options.series.push(series);
                 options.xAxis.categories = stats.names;

                 exports.create_graph(remaining_deployments, view, options, custom);
               });
  }
} // create_graph