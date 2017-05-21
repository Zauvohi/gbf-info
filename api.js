function addToCutoffsTable(data) {
  //parsed_data = JSON.parse(data);
  time = new Date(data.created_at);
  f_time = time.toLocaleDateString() + " @ " + time.toLocaleTimeString();
  keys = Object.keys(data).slice(0, 4);

  for(i = 0; i < keys.length; i++) {
    rank_text = keys[i].charAt(0).toUpperCase();
    rank_text += keys[i].slice(1, 3);
    rank_text += ' ' + keys[i].slice(3, 5) + '000';
    tr = document.createElement('tr');
    td_rank = document.createElement('td');
    td_points = document.createElement('td');
    rank = document.createTextNode(rank_text);
    points = document.createTextNode(data[keys[i]]);
    tr.clasName = keys[i];
    td_rank.appendChild(rank);
    td_points.appendChild(points);
    tr.appendChild(td_rank);
    tr.appendChild(td_points);
    document.querySelector('#cutoff-table tbody').appendChild(tr);
  }

  $(".cutoffs-updated-at").text(f_time);
}

function fillCutOffs() {
  var url = "https://serene-spire-95459.herokuapp.com/cutoffs/newest";
  $.ajax({
    method: 'GET',
    url: url,
    crossDomain: true,
    dataType: 'json'
  }).done(function(response) {
    addToCutoffsTable(response);
  });
}

function addToIndividualTable(data) {
  var tr = document.createElement('tr');
  var tds = [];
  var attributes = ['position, id, name, rank, ranking_points, total_battles'];


  for (i = 0; i < 6; i++) {
    tds.push(document.createElement('td'));
  }

  tds[0].innerHTML = data.position;
  tds[1].innerHTML = data.id;
  tds[2].innerHTML = data.name;
  tds[3].innerHTML = data.rank;
  tds[4].innerHTML = data.ranking_points[0];
  tds[5].innerHTML = data.total_battles;

  for (i = 0; i < tds.length; i++) {
    tr.appendChild(tds[i]);
  }

  document.querySelector('#individual_day_table tbody').appendChild(tr);
}

function addToGlobalTable(data) {
  var tr = document.createElement('tr');
  var tds = [];
}


function addToTable(data, type) {
  console.log(data);
  if (type == "global") {
    //addToGlobalTable(data);
    console.log(data);
  } else {
    addToIndividualTable(data);
  }
}
