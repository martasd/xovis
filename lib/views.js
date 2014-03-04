exports.activity = {
    map: function (doc) {
      emit([doc.deployment, doc.activity], 1);
    },
    reduce: function(keys, values, rereduce) {
      return sum(values);
    }
};

exports.files = {
  map: function (doc) {
    // if mime_type is not empty string, a file was generated
    if (doc.mime_type != "") {
      emit([doc.deployment, doc.activity], 1);
    }
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.share = {
  map: function (doc) {
    if (doc["share-scope"] == "private") {
      emit([doc.deployment, doc.activity], 1);
    }
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.timeofday = {
  map: function (doc) {
    // time is in UTC, so need to convert, which Date does automatically
    var time_diff = 345 * 60000;
    var orig_date = new Date(doc.mtime);
    var utc_date = new Date(orig_date.getTime() + time_diff);
    var hour = utc_date.getHours();
    emit([doc.deployment, hour], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.months = {
  map: function (doc) {
    var month_names = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ];
    var date = new Date(doc.mtime);
    var month = month_names[date.getMonth()];
    emit([doc.deployment, month], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.years = {
  map: function(doc) {
    var date = new Date(doc.mtime);
    var year = date.getFullYear();
    emit([doc.deployment, year], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.activity_by_years = {
  map: function(doc) {
    var date = new Date(doc.mtime);
    var year = date.getFullYear();
    emit([doc.deployment, doc.activity, year], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};