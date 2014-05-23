var $ = require('lib/jquery-2.0.3');
var bootstrap = require('lib/bootstrap/js/bootstrap.min');
var buttons = require('lib/buttons');
var db_stats = require('lib/db_stats');
var highcharts = require('lib/global_highcharts');
var db = require('db').current();


/**
 * Add or refresh buttons on deployment selection change.
 * @param {number} dropdown_count - number of dropdowns created so far
 */
function update_buttons(dropdown_count) {
  $('.deployment').change( function() {
    var selected_deployments = [], selected_deployment;
    for (var i = 0; i < dropdown_count; i++) {
      selected_deployment = $('#deployment' + i).val();
      if (selected_deployment != "") {
        selected_deployments.push(selected_deployment);
      }
    }

    console.log(selected_deployments, dropdown_count);
    // if buttons already exists, reload them
    if ($('#freq').length) {
      buttons.reload(selected_deployments);
    }
    else {
      buttons.add(selected_deployments);
    }
  });
} // update_buttons

/**
 * Adds a dropdown and a listener for buttons to #left-container
 * @param {array} deployments - all available deployments
 * @param {array} drop_down_count  - num of drop downs created so far
 */
function add_dropdown(deployments, drop_down_count) {

  // drop-down for selecting a deployment
  var dropdown_elem = 'dropdown-elem' + drop_down_count;

  var drop_down = $(document.createElement('select'))
                  .attr({id: 'deployment' + drop_down_count,
                         class: 'drop-down-select deployment ' + dropdown_elem
                        });
  var label = $(document.createElement('label'))
              .attr({class: 'drop-down-label ' + dropdown_elem});

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

  select_text = $(document.createTextNode("Select deployment site(s):"));
  select_text_elem = $(document.createElement('h4')).append(select_text);

  // create a + button for adding another dropdown
  // uses bootstrap:  http://getbootstrap.com/components/#glyphicons-how-to-use
  var add_drop_button = $(document.createElement('button'))
                        .attr({id: 'add-drop-button' + drop_down_count,
                               class: 'add-drop-button ' + dropdown_elem});
  drop_down_count += 1;

  add_drop_button.click( function () {
    add_dropdown(deployments, drop_down_count); });
  var button_span = $(document.createElement('span')).attr({
    class: 'glyphicon glyphicon-plus'});
  add_drop_button.append(button_span);

  // insert the elems created into the DOM
  var dropdown_elem_class = '.' + dropdown_elem;
  var last_elem = null;
  if (drop_down_count > 1) {
    last_elem = '#add-drop-button' + (drop_down_count - 2);
    add_drop_button.insertAfter(last_elem);
    label.insertAfter(last_elem);
    drop_down.insertAfter(last_elem);
  }
  else {
    $('#left-container').prepend(select_text_elem, drop_down, label, add_drop_button);
  }

  update_buttons(drop_down_count);
} // add_dropdown


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

      var deployments = data["deployments"];
      add_dropdown(deployments, 0);

      // show db statistics
      db_stats.get_instances_total(deployments);
      db_stats.get_activities_total(deployments);
      db_stats.get_collection_start_date(deployments);
      db_stats.get_collection_end_date(deployments);

    }); // db.getDoc

    // method 2: (very) slow retrieval based on "deployment" attr in all docs
    // might be considered for cases with data from multiple deployments not
    // all of which are known
    //db.getList('xovis-couchapp', 'sort', 'deployments', function (err, data) {
    //  if (err) {
    //    return alert(err);
    //  }
    //
    //  add_dropdown(data["deployments"]);
    //});
  });
} // exports.init