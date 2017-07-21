function getBaseUrl() {
  return "https://serene-spire-95459.herokuapp.com";
}

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
  var attributes = ['position', 'id', 'name', 'rank', 'points', 'total_battles'];

  for (i = 0; i < 6; i++) {
    td = document.createElement('td');
    td.innerHTML = data[attributes[i]];
    tr.appendChild(td);
  }

  document.querySelector('#individual_day_table tbody').appendChild(tr);
}

function addToGlobalTable(data) {
  var tr = document.createElement('tr');
  var tds = [];
  var info_attributes = ['position', 'id', 'name', 'rank', 'total_battles'];
  var ranking_points = data.ranking_points;

  for (i = 0; i < 13; i++) {
    tds.push(document.createElement('td'));
  }

  for (i = 0; i < info_attributes.length; i++) {
    tds[i].innerHTML = data[info_attributes[i]];
  }

  var previous_total = 0;

  for (i = 0; i < ranking_points.length; i++) {
     if (i == 2) {
       tds[6].innerHTML = ranking_points[2] - ranking_points[0];
     } else if (i > 2){
       tds[i + 4].innerHTML = ranking_points[i] - previous_total;
     } else {
       tds[i + 5].innerHTML = ranking_points[i] - previous_total;
     }

     previous_total = ranking_points[i];
  }

  tds[11].innerHTML = ranking_points[6];

  for (i = 0; i < tds.length; i++) {
    tr.appendChild(tds[i]);
  }

  document.querySelector('#global_table').appendChild(tr);
}


function addToTable(data, day) {
  if (day == "global") {
    addToGlobalTable(data);
  } else {
    addToIndividualTable(data);
  }
}

function getEditions() {
  var url = getBaseUrl();
  url += '/editions';

  $.ajax({
    method: 'GET',
    url: url,
    crossDomain: true,
    dataType: 'json',
    processData: false,
  }).done(function(response) {
    fillEditions(response);
  });
}

function fillEditions(data) {
  data.forEach(function(edition) {
    var opt = document.createElement('option');
    opt.value = edition.id;
    opt.text = edition.number + ' (' + edition.element + ')';
    opt.dataset.element = edition.element;
    opt.dataset.number = edition.number;
    document.querySelector('#edition').appendChild(opt);
  });

  $('#edition').material_select();
}

function searchPlayers(player_id, edition_id, day) {
  var url = getBaseUrl() + "/rankings/" + edition_id + "/" + player_id;
  $.ajax({
    method: 'GET',
    url: url,
    crossDomain: true,
    dataType: 'json',
    data: { 'day': day },
    processData: false,
  }).done(function(response) {
    addToTable(response, day);
  });
}
