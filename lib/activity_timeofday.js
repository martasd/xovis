var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highstock');
var db = require('db').current();

/**
 * Creates timeofday graph with data from multiple deployments.
 *
 * @param {array} deployments - deployments selected by user
 * @param {json} options - highcharts options to append 'series' to
 */
function create_graph(deployments, options) {

  if (deployments.length == 0) {
    var chart = new Highcharts.Chart(options);

    // Inform the audience that time data is not necessarily accurate
    var note_elem = $(document.createElement('p')).attr({id: 'timeofday-note'});
    var note_text = $(document.createTextNode(
      "Note: Some of the data gathered from XO-1 deployments \
contain an incorrect timestamp due to malfunction of the inside clock battery. \
As a result, some of the statistics for specific hours might not correspond \
to the actual laptop usa throughout the day. The pattern of use is, however, \
preserved, so we decided to include this graph in the visualization."));
    note_elem.append(note_text);
    $('#center-container').prepend(note_elem);

  }
  else {
    var current_deployment = deployments[0];
    var remaining_deployments = deployments.slice(1);

    db.getView('xovis-couchapp', 'timeofday',
               {'group':'true', 'startkey':[current_deployment], 'endkey':[current_deployment, {}]},
               function (err, data) {
                 if (err) {
                   return alert(err);
                 }

                 var stats = {
                   names: [],
                   counts: []
                 };

                 var activity_instances, activities_data = [], max = 0;
                 for (var i = 0; i < data.rows.length; i++) {
                   stats.names.push(data.rows[i].key[1]);
                   activity_instances = data.rows[i].value;
                   if (activity_instances > max) {
                     max = activity_instances;
                   }
                   activities_data.push(activity_instances);
                 }

                 // from http://www.colorhexa.com/0000ff-to-ffff00
                 var colors = ['#0000ff', '#0055ff', '#00aaff','#aaff00', '#ffaa00', '#ff5500', '#ff0000'];

                 // compute the color of the column in the graph based on its value
                 var colors_num = colors.length;
                 var interval_size = max / colors_num;
                 var datapoint = {};
                 for (i = 0; i < activities_data.length; i++) {
                   activity_instances = activities_data[i];

                   // compute the index in the colors' array of the current datum
                   for (var j = 0, mark = interval_size; mark < max; j++) {
                     if (activity_instances < mark) {
                       // we have found the right interval so push data and their associated colors
                       datapoint = { y: activity_instances,
                                     color: colors[j]
                                   };
                       stats.counts.push(datapoint);
                       break;
                     }
                     mark += interval_size;
                   }
                 }

                 var series = {
                   name: current_deployment,
                   data: stats.counts
                 }

                 options.series.push(series);
                 options.xAxis.categories = stats.names;

                 create_graph(remaining_deployments, options);
               }); // db.getList
  }

} // create_graph

exports.create_chart = function(deployments) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Time of Day Activity Use'
    },
    xAxis: {
      title: {
        text: 'Hour'
      }
    },
    yAxis: {
      title: {
        text: "Launched<br/> Instances"
      }
    },
    plotOptions: {
      //column: {
      //  pointWidth: 18
      //}
    },
    legend: {
      enabled: false
    },
    series: []
  }; // options

  create_graph(deployments, options);

  }; // create_chart