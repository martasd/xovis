var $ = require('lib/jquery-2.0.3');
var highcharts = require('lib/highcharts-more');
var db = require('db').current();

/**
 * Creates a average frequency graph with data from multiple deployments.
 *
 * @param {array} deployments - deployments selected by user
 * @param {json} num_devices - the number of devices in each deployment
 * @param {json} options - highcharts options to append 'series' to
 */
function create_graph(deployments, num_devices, options) {

  if (deployments.length == 0) {
    var chart = new Highcharts.Chart(options);
  }
  else {
    var current_deployment = deployments[0];
    var remaining_deployments = deployments.slice(1);

    db.getList('xovis-couchapp', 'sort', 'activity',
               {'group':'true', 'startkey':[current_deployment],
                'endkey':[current_deployment, {}]},
               function (err, data) {
                 if (err) {
                 return alert(err);
                 }

                 var stats = {
                   names: [],
                   counts: []
                 };

                 var avg_instances;
                 var num_devices_deployed = num_devices[current_deployment];
                 for (var i = 0; i < data.rows.length; i++) {
                   stats.names.push(data.rows[i].key[1]);
                   avg_instances = data.rows[i].value / num_devices_deployed;
                   stats.counts.push(parseFloat(avg_instances.toFixed(2)));
                 }

                 var series = {
                   name: current_deployment,
                   data: stats.counts
                 }

                 options.series.push(series);
                 options.xAxis.categories = stats.names;

                 create_graph(remaining_deployments, num_devices, options);
               }); // db.getList
  }
} // create_graph


exports.create_chart = function(deployments) {
  var current_chart = $('#center-container').highcharts();
  if (current_chart)
    current_chart.destroy();

  var options = {
    chart: {
      polar: true,
      type: 'line'
    },
    title: {
      text: 'Activity Frequency per Device'
    },
    xAxis: {
      title: {
      }
    },
    yAxis: {
      gridLineInterpolation: 'circle',
      title: {
      }
    },
    plotOptions: {
      bar: {
      },
      series: {
      }
    },
    legend: {
      enabled: true,
      x: -50
    },
    series: []
  };

  // use bar chart if more than one deployment selected,
  // otherwise use polar chart (default)
  if (deployments.length > 1) {
    options.chart.type = 'bar';
    options.chart.polar = false;
    options.chart.zoomType = 'x';
    options.xAxis.title.text = 'Activity<br/> Name';
    options.xAxis.title.offset = 100;
    options.xAxis.title.rotation = 0;
    options.yAxis.title.text = 'Launched Instances';
    options.yAxis.title.offset = 30;
    options.plotOptions.bar.pointWidth = 10;
    options.plotOptions.series.colorByPoint = true;
    options.legend.enabled = false;

    // show a tip for the user
    var tip = $(document.createElement("h4")).attr({id: 'dragtip', class: 'tip'});
    var tipText = $(document.createTextNode('Drag your mouse vertically to zoom on a range of activities!'));
    tip.append(tipText);
    $('#right-container').prepend(tip);
  }

  db.getDoc("number of devices", function (err, data) {
    if (err) {
      return alert(err);
    }

    var deployment, num_devices = {};
    for (var i = 0; i < deployments.length; i++) {
      deployment = deployments[i];
      num_devices[deployment] = data[deployment];
    }

    create_graph(deployments, num_devices, options);
  }); // getDoc

}; // create_chart
