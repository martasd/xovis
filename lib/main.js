var $ = require('lib/jquery-2.0.3');
var buttons = require('lib/buttons');
var helpers = require('lib/helpers');
var highcharts = require('lib/global_highcharts');
var db = require('db').current();

function create_layout(deployments) {

  var drop_down_count = 0;
  drop_down_count = helpers.create_dropdown(deployments, drop_down_count);

  // Add or refresh buttons on deployment selection change
  $('.deployment').change( function() {
    var selected_deployments = [];
    for (var i = 0; i < drop_down_count; i++)
      selected_deployments.push($('#deployment' + i).val());

    // if buttons already exists, reload them
    if ($('#freq').length) {
      buttons.reload(selected_deployments);
    }
    else {
      buttons.add(selected_deployments);
    }
  });

} // create_layout

/**
 * Initialize the visualization page.
 */
exports.init = function() {

  $(document).ready(function() {

    highcharts.set_default_options();

    // retrieve the list of deployments from db
    var deployments = [];

    // method 1: fast retrieval from a custom db document with "deployments" id
    db.getDoc("deployments", function (err, data) {
      if (err) {
        return alert(err);
      }

      create_layout(data["deployments"]);
    }); // db.getDoc

    // method 2: (very) slow retrieval based on "deployment" attr in all docs
    // might be considered for cases with data from multiple deployments not
    // all of which are known
    //db.getList('xovis-couchapp', 'sort', 'deployments', function (err, data) {
    //  if (err) {
    //    return alert(err);
    //  }
    //
    //  create_layout(data["deployments"]);
    //});
  });
} // exports.init
