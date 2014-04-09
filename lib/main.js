var $ = require('lib/jquery-2.0.3');
var buttons = require('lib/buttons');
var highcharts = require('lib/global_highcharts');
var db = require('db').current();

function create_layout(deployments) {
  var drop_down = $(document.createElement('select'))
                  .attr('id', 'deployments');
  var label = $(document.createElement('label'));

  // create a drop-down for selecting a deployment
  var option, deployment, default_text, select_text, select_text_elem;
  option = $(document.createElement('option')).attr({ value: "",
                                                      selected: "selected"});
  default_text = $(document.createTextNode("Select One ..."));
  option.append(default_text);
  drop_down.append(option);
  for (var i = 0; i < deployments.length; i++) {
    option = $(document.createElement('option')).attr('value', deployments[i]);
    deployment = $(document.createTextNode(deployments[i]));
    option.append(deployment);
    drop_down.append(option);
  };

  select_text = $(document.createTextNode("Select a deployment site:"));
  select_text_elem = $(document.createElement('h4')).append(select_text);
  $('#left-container').prepend(select_text_elem, label, drop_down);
  highcharts.set_default_options();

  // Add button options when a deployment gets selected
  $('#deployments').change( function() {
    deployment = $('#deployments').val();

    // if buttons already exists, reload them
    if ($('#freq').length) {
      buttons.reload(deployment);
    }
    else {
      buttons.add(deployment);
    }
  });
} // create_layout

exports.init = function() {

  $(document).ready(function() {

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