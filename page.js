$(document).ready(function() {
  $('#day_select').material_select();
  $('#search_type').material_select();
  getEditions();

  //fillCutOffs();

  $('#day_select').on('change', function(e) {
    day = e.target.value;
    $('#rankings_table > thead').empty();
    $('#rankings_table > tbody').empty();
    $("#ranking_info").text(editionInfo());

    if ($.isNumeric(day)) {
      addHeaders('single');
    } else {
      addHeaders('multi');
    }

    if (day === 'list') {
      $('.points-options').removeClass('hide');
    } else {
      $('.points-options').addClass('hide');
    }
  });

  $('#edition').on('change', function(e) {
    document.querySelector('#search_players').disabled = false;
    $("#ranking_info").text(editionInfo());
  });

  $('#group_name_value').on('keyup', function(e) {
    $('#group_title').text(e.target.value);
  });

  $('#search_players').on('click', function(e) {
    e.preventDefault();
    var player_ids = $('#player_ids').val().split(',');
    //var search_type = $('#search_type').val();
    var gw_edition = $('#edition').val();
    var day = $('#day_select').val();

    if (player_ids.length > 30) {
      Materialize.toast('You can only search 30 items at a time!', 4000);
    } else {
      player_ids.forEach(function(id) {
        searchPlayers(id, gw_edition, day);
      });
    }
  });

  $('#points_type').on('click', function(e) {
    var total_rows = $('#rankings_table > tbody tr').length;
    if (total_rows > 0) {
      swapScores();
    }
  });
});
