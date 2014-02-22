var $ = require('lib/jquery-2.0.3');
var activity_count = require('lib/activity_count');
var activity_files = require('lib/activity_files');
var activity_share = require('lib/activity_share');
var activity_timeofday = require('lib/activity_timeofday');

exports.add = function (deployment) {
  // use jQuery to create a button for each visualizations
  var label = $(document.createTextNode('Activity Frequency'));
  var button = $(document.createElement('a'))
               .attr({ id: 'freq',
                       href: '#',
                       class: 'theme button white'
                     })
               .click(function () { activity_count.create_chart(deployment); })
               .append(label);
  $('#left-container').append(button);


  label = $(document.createTextNode('Files Generated'));
  button = $(document.createElement('a'))
           .attr({ id: 'files',
                   href: '#',
                   class: 'theme button white'
                 })
           .click(function () { activity_files.create_chart(deployment); })
           .append(label);
  $('#left-container').append(button);


  label = $(document.createTextNode('Activities Shared'));
  button = $(document.createElement('a'))
           .attr({ id: 'shared',
                   href: '#',
                   class: 'theme button white'
                 })
           .click(function () { activity_share.create_chart(deployment); })
           .append(label);
  $('#left-container').append(button);


  label = $(document.createTextNode('Time of Day Usage'));
  button = $(document.createElement('a'))
           .attr({ id: 'timeofday',
                   href: '#',
                   class: 'theme button white'
                 })
           .click(function () { activity_timeofday.create_chart(deployment); })
           .append(label);
  $('#left-container').append(button);
};

exports.reload = function (deployment) {

  $('#freq').click(function () {
    activity_count.create_chart(deployment); });
  $('#files').click(function () {
    activity_files.create_chart(deployment); });
  $('#shared').click(function () {
    activity_share.create_chart(deployment); });
  $('#timeofday').click(function () {
    activity_timeofday.create_chart(deployment); });
}