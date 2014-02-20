exports.sort = function (head, req) {
    var row;
    var rows = [];
    while ((row = getRow())) {
      rows.push(row);
    }

    rows.sort(function(a,b) {
      return b.value - a.value;
    });

    send(JSON.stringify({"rows" : rows}));
  };