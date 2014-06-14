var $ = require('lib/jquery-2.0.3');
var db = require('db').current();

// helper to append database statistic to right container
// attributes is a key-val pair of attributes
function append_db_stat(stat, attributes) {
  var stat_elem = $(document.createElement('p')).attr({class: 'db-stats'});
  if (typeof attributes !== 'undefined') {
    stat_elem.attr(attributes);
  }

  var stat_text = $(document.createTextNode(stat));
  stat_elem.append(stat_text);
  $('#right-container').append(stat_elem);
} // append_db_stat

var indent_attr = { style: "text-indent: 1em" };
var title_attr = { style: "font-weight: bold; font-size: 1.1em" };

// show number of launched instances- per deployment and total
exports.get_instances_total = function (deployments) {

  db.getList('xovis-couchapp', 'sort', 'instances_total', {'group':'true'},
             function (err, data) {
               if (err) {
                 return alert(err);
               }

               var deployment_count = deployments.length;

               var instances;
               append_db_stat("Number of instances launched: ", title_attr);
               if (deployment_count == 1) {
                 instances = data.rows[0].value;
                 append_db_stat(instances);
               }
               else if (deployment_count > 1) {

                 var deployment, total_instances = 0;
                 for (var i = 0; i < deployment_count; i++) {
                   deployment = data.rows[i].key;
                   instances = data.rows[i].value;
                   append_db_stat(deployment + ": " + instances);
                   total_instances += instances;
                 }

                 // output total number of instances
                 append_db_stat("total: " + total_instances);
               }
               $('#right-container').append("<br/>");
             });
} // get_instances_total

// show total number of (unique) activities used
exports.get_activities_total = function (deployments) {
  db.getList('xovis-couchapp', 'sort', 'activity_list', {'group':'true'},
             function (err, data) {
               if (err) {
                 return alert(err);
               }

               var deployment_count = deployments.length;
               var total_activities = data.rows.length;
               append_db_stat("Number of activities used: ", title_attr);
               if (deployment_count == 1) {
                 append_db_stat(total_activities);
                 }

               else if (deployment_count > 1) {

                 // initialize
                 var deployment, activities_count = {};
                 for (var i = 0; i < deployment_count; i++) {
                   activities_count[deployments[i]] = 0;
                 }

                 for (i = 0; i < total_activities; i++) {
                   deployment = data.rows[i].key[0];
                   activities_count[deployment]++;
                 }

                 for (deployment in activities_count) {
                   append_db_stat(deployment + ": " +
                                  activities_count[deployment]);
                 }

                 append_db_stat("total: " + total_activities);
               }
               $('#right-container').append("<br/>");
             });
} // get_activities_total

// show when data started being collected
exports.get_collection_start_date = function (deployments) {
  db.getList('xovis-couchapp', 'sort', 'use_begin_date', {'group':'true'},
             function (err, data) {
               if (err) {
                 return alert(err);
               }

               var deployment_count = deployments.length;
               append_db_stat("Data collection start date:", title_attr);
               if (deployment_count == 1) {
                 append_db_stat(data.rows[0].value);
               }
               else if (deployment_count > 1) {

                 var deployment, date;
                 for (var i = 0; i < deployment_count; i++) {
                   deployment = data.rows[i].key;
                   date = data.rows[i].value;
                   append_db_stat(deployment + ": " + date);
                 }
               }
               $('#right-container').append("<br/>");
             });
} // get_collection_start_date

// show when data was last collected
exports.get_collection_end_date = function (deployments) {
  db.getList('xovis-couchapp', 'sort', 'use_end_date', {'group':'true'},
             function (err, data) {
               if (err) {
                 return alert(err);
               }

               var deployment_count = deployments.length;
               append_db_stat("Data collection end date:", title_attr);
               if (deployment_count == 1) {
                 append_db_stat(data.rows[0].value);
               }
               else if (deployment_count > 1) {

                 var deployment, date;
                 for (var i = 0;i < deployment_count; i++) {
                   deployment = data.rows[i].key;
                   date = data.rows[i].value;
                   append_db_stat(deployment + ": " + date);
                 }
               }
               $('#right-container').append("<br/>");
               });
} // get_collection_end_date

exports.get_number_of_devices = function (deployments) {
  db.getDoc("number of devices", function (err, data) {
    if (err) {
      return alert(err);
    }

    var deployment_count = deployments.length;
    append_db_stat("Number of devices:", title_attr);
    if (deployment_count == 1) {
      append_db_stat(data[deployments[0]]);
      }
    else if (deployment_count > 1) {

      var deployment, num_devices
      for (var i = 0; i < deployment_count; i++) {
        deployment = deployments[i];
        num_devices = data[deployment];
        append_db_stat(deployment + ": " + num_devices);
      }
    }
    $('#right-container').append("<br/>");
  });
} // get_number_of_devices
