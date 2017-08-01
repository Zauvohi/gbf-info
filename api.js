// Documentation https://github.com/Zauvohi/gbf-gw_api/blob/developer/README.md

function getBaseUrl() {
  return "https://serene-spire-95459.herokuapp.com";
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

function getSingleDay(url) {
  $.ajax({
    method: 'GET',
    url: url,
    crossDomain: true,
    dataType: 'json',
    data: 'day=' + day,
    processData: false,
  }).done(function(response) {
    addToTable(response, day);
  });
}

function getMultiDay(url) {
  $.ajax({
    method: 'GET',
    url: url,
    crossDomain: true,
    dataType: 'json',
    processData: false,
  }).done(function(response) {
    addToTable(response, day);
  });
}

function searchPlayers(player_id, edition_id, day) {
  var url = getBaseUrl() + '/rankings/';
  var s_url = edition_id + "/" + player_id;

  if (day === 'list' || day === 'global') {
    url += day + '/' + s_url;
    getMultiDay(url);
  } else {
    url += s_url;
    getSingleDay(url);
  }
}

function editionInfo() {
  var opt = $('#edition option:selected');
  var number = opt.data('number');
  var element = opt.data('element');
  var day = $('#day_select option:selected').val();
  var msg = 'Displaying rankings for GW #' + number + '(' + element + ').';

  if ($.isNumeric(day)) {
    day = day == '0' ? 'prelims' : day;
    msg += ' Day: ' + day + '.';
  } else if (day == 'global') {
    msg = 'Displaying global data.';
  }

  $('#ranking_info').text(msg);
}
