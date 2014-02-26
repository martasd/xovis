var $ = require('lib/jquery-2.0.3');

/**
 * Adds a dropdown to #left-container
 * @param {array} deployments - all available deployments
 * @param {array} drop_down_count  - num of drop downs created so far
 * @return {array} drop_downs - ^^
 */
exports.create_dropdown = function(deployments, drop_down_count) {

  // drop-down for selecting a deployment
  var drop_down = $(document.createElement('select'))
                  .attr({id: 'deployment' + drop_down_count,
                         class: 'deployment'
                        });
  var label = $(document.createElement('label'));

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
  $('#left-container').prepend(label, drop_down);

  drop_down_count += 1;
  return drop_down_count;
}