function singleDayHeaders() {
  return ['Position', 'ID', 'Name', 'Rank', 'Points', 'Battles'];
}

function multiDayHeaders() {
  return [
    'Position',
    'ID',
    'Name',
    'Rank',
    'Prelims',
    'Day 1',
    'Day 2',
    'Day 3',
    'Day 4',
    'Day 5',
    'Battles'
  ];
}

function addHeaders(type) {
  var headers = [];
  if (type === 'single') {
    headers = singleDayHeaders();
  } else {
    headers = multiDayHeaders();
  }

  var tr = document.createElement('tr');

  for (var i = 0; i < headers.length; i++) {
    var th = document.createElement('th');
    th.innerHTML = headers[i];
    tr.appendChild(th);
  }

  document.querySelector('#rankings_table > thead').appendChild(tr);
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

function addToIndividualTable(data) {
  var tr = document.createElement('tr');
  var attributes = ['position', 'id', 'name', 'rank', 'points', 'total_battles'];

  for (i = 0; i < attributes.length; i++) {
    td = document.createElement('td');
    td.innerHTML = data[attributes[i]];
    tr.appendChild(td);
  }

  document.querySelector('#rankings_table tbody').appendChild(tr);
}

function calculateScores(list, days) {
  var previous_total = 0;
  var day_scores = [];
  var total_scores = [];

  for (i = 0; i < days; i++) {
    var score;

    if (list[i] === undefined) {
      score = 0;
    } else {
      score = list[i].points;
    }

    if (i === 0) {
      day_scores.push(score);
      total_scores.push(score);
    } else {
      var individual_score = score === 0 ? 0 : (score - previous_total);
      var t_score = score === 0 ? 0 : score;
      day_scores.push(individual_score);
      total_scores.push(t_score);
    }
    previous_total = score > 0 ? score : previous_total;
  }
  return [total_scores, day_scores];
}

function getCurrentDay() {
  //var str_start = $('#edition option:selected').data('start_date');
  var str_end = $('#edition option:selected').data('end_date');
  str_end = str_end.replace('+0000', '+0900');
  // we have to replace the - with /  so it follows the ECMAScript specification
  // otherwise it won't work in firefox
  str_end = str_end.replace(/-/g,'/');
  //var start_date = new Date(str_start.replace('+0000', '+0900'));
  var end_date = new Date(str_end);
  var today = new Date();
  var event_days = 5;
  var current_day = 0;

  for (var i = 0; i < event_days + 1; i++) {
    if (today >= end_date) {
      current_day = event_days - i;
      break;
    } else {
      end_date.setDate(end_date.getDate() - 1);
    }
  }

  return current_day;
}

function addToMultiDayTable(data) {
  var tr = document.createElement('tr');
  var player_attrs = ['id', 'name', 'rank'];
  var days = 6; // prelims and from day 1 to day 5
  var scores = calculateScores(data.list, days);
  var scores_type = $('#points_type').prop('checked') ? 1 : 0;

  for (var i = 0; i < player_attrs.length + days; i++) {
    var td = document.createElement('td');
    if (i < player_attrs.length) {
      td.innerHTML = data[player_attrs[i]];
      td.className = 'player-info ' + 'player-' + player_attrs[i];
    } else {
      var day = i - player_attrs.length;
      td.innerHTML = scores[scores_type][day];
      td.dataset.total_score = scores[0][day];
      td.dataset.single_score = scores[1][day];
      td.className = 'player-score ' + 'day-' + day;
    }
    tr.appendChild(td);
  }
  var pos_td = document.createElement('td');
  var battle_td = document.createElement('td');
  // last standing in the rankings
  var current_day = getCurrentDay();
  var position;
  var battles = 0;

  if (data.list[current_day] === undefined) {
    position = 'DNQ';
    console.log(current_day);
  } else {
    position = data.list[current_day].position;
    battles = data.list[current_day].total_battles;
  }

  pos_td.innerHTML = position;
  battle_td.innerHTML = battles;
  tr.insertBefore(pos_td, tr.firstChild);
  tr.appendChild(battle_td);
  document.querySelector('#rankings_table > tbody').appendChild(tr);
}

function addToTable(data, day) {
  if (day === "list") {
    addToMultiDayTable(data);
  } else if (day === "global") {
    addToGlobalTable(data);
  } else {
    addToIndividualTable(data);
  }
}

function swapScores() {
  var tds = document.querySelectorAll('.player-score');
  var score_type = $('#points_type').prop('checked') ? 'single' : 'total';
  score_type += '_score';

  tds.forEach(function(td) {
    var score = td.dataset[score_type];
    td.innerHTML = score;
  });
}
