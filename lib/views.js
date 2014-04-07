exports.deployments = {
  map: function (doc) {
    if(doc.deployment) {
      emit(doc.deployment, null);
    }
  },
  reduce: function(keys, values, rereduce) {
    return true;
  }
};

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
    var mtime = doc.mtime;
    var hour = mtime.substring(11, 13);
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
    var mtime = doc.mtime;
    var month_index = Number(mtime.substring(5,7)) - 1;
    var month = month_names[month_index]
    emit([doc.deployment, month], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.years = {
  map: function(doc) {
    var mtime = doc.mtime;
    var year = mtime.substring(0,4);
    emit([doc.deployment, year], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.activity_by_years = {
  map: function(doc) {
    var mtime = doc.mtime;
    var year = mtime.substring(0,4);
    emit([doc.deployment, doc.activity, year], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};

exports.activity_by_months = {
  map: function(doc) {
    var mtime = doc.mtime;
    var year = mtime.substring(0,4);
    var month = Number(mtime.substring(5,7)) - 1;
    emit([doc.deployment, doc.activity, year, month], 1);
  },
  reduce: function(keys, values, rereduce) {
    return sum(values);
  }
};