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