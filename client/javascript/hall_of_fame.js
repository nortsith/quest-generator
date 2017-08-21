var moments;

var moments_element = jQuery('#moments'),
    add_button      = jQuery('#add_button'),
    socket          = io();

function create_moment(){
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
    url: "/data?type=read",
    type: 'POST',
    success: function(data){
      moments = data;
      create_moments(moments);
    }
  });
}

function add_moment(moment){
  jQuery.ajax({
    url: "/data?type=write&data="+JSON.stringify(moment),
    type: 'POST',
    success: function(data){
      new_moment(moment);
    }
  });
}

function create_moments(moments){
  console.log(moments);
  var html = '';
  moments.forEach(function(object,index){
    var moment = JSON.parse(object);
    html += '<div class="moment">'+
              '<div class="moment_title">'+moment.title+'</div>'+
              '<div class="moment_game_master"><span>Dungeon Master</span></br>'+moment.game_master+'</div>'+
              '<div class="moment_player"><span>Oyuncu</span></br>'+moment.player+'</div>'+
              '<div class="moment_description"><span>Hikaye</span></br>'+moment.description+'</div>'+
            '</div>';
  });
  moments_element.append(html);
}

function new_moment(moment){
  html = '<div class="moment">'+
           '<div class="moment_title">'+moment.title+'</div>'+
           '<div class="moment_game_master"><span>Dungeon Master</span></br>'+moment.game_master+'</div>'+
           '<div class="moment_player"><span>Oyuncu</span></br>'+moment.player+'</div>'+
           '<div class="moment_description"><span>Hikaye</span></br>'+moment.description+'</div>'+
         '</div>';
  socket.emit('new_moment_added',html);
}

function hall_of_fame_events(){
  add_button.on('click',function(){
    create_moment();
  });
  socket.on("add_moment",function(moment){
    moments_element.append(moment);
  });
}

get_moments();
hall_of_fame_events();
