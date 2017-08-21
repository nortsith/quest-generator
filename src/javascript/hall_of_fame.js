var moments;

var moments_element = jQuery('#moments'),
    add_button      = jQuery('#add_button');

function create_moment(){
  console.log(4)
  var inputs = [
    title = {
      element:  jQuery('.moment_title'),
      value  :  jQuery('#title').val()
    },
    game_master = {
      element:  jQuery('.moment_game_master'),
      value  :  jQuery('#game_master').val()
    },
    player = {
      element:  jQuery('.moment_player'),
      value  :  jQuery('#player').val()
    },
    description ={
      element:  jQuery('.moment_description'),
      value  :  jQuery('#description').val()
    }
  ];

  if(inputs[0].value && inputs[1].value && inputs[2].value && inputs[3].value){
    inputs.forEach(function(input,index){
      input.element.removeClass("warning");
    });
    var moment = {
      "title": inputs[0].value,
      "game_master": inputs[1].value,
      "player": inputs[2].value,
      "description": inputs[3].value
    };
    add_moment(moment);
    fade_out_element(add_element);
  } else{
    inputs.forEach(function(input,index){
      input.value.length <= 0 ? input.element.addClass("warning") : input.element.removeClass("warning");
    });
  }
}

function get_moments(){
  jQuery.ajax({
    url: "src/php/data.php",
    type: 'POST',
    success: function(data){
      moments = JSON.parse(data);
      create_moments(moments);
    }
  });
}

function add_moment(moment){
  moments.push(moment);
  jQuery.ajax({
    url: "src/php/data.php",
    type: 'POST',
    data: {
	     data: moments
    },
    success: function(data){
      add_moment_locally(moment);
    }
  });
}

function create_moments(moments){
  var html = '';
  moments.forEach(function(moment,index){
    html += '<div class="moment">'+
              '<div class="moment_title">'+moment.title+'</div>'+
              '<div class="moment_game_master"><span>Dungeon Master</span></br>'+moment.game_master+'</div>'+
              '<div class="moment_player"><span>Oyuncu</span></br>'+moment.player+'</div>'+
              '<div class="moment_description"><span>Hikaye</span></br>'+moment.description+'</div>'+
            '</div>';
  });
  moments_element.append(html);
}

function add_moment_locally(moment){
  html = '<div class="moment">'+
           '<div class="moment_title">'+moment.title+'</div>'+
           '<div class="moment_game_master"><span>Dungeon Master</span></br>'+moment.game_master+'</div>'+
           '<div class="moment_player"><span>Oyuncu</span></br>'+moment.player+'</div>'+
           '<div class="moment_description"><span>Hikaye</span></br>'+moment.description+'</div>'+
         '</div>';
  moments_element.append(html);
}

function hall_of_fame_events(){
  add_button.on('click',function(){
    create_moment();
  });
}

get_moments();
hall_of_fame_events();
