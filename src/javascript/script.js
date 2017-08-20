/* Copyright © 2017 Onur Şahin Şentürk - All Rights Reserved */
var parser = "src/php/parser.php";

var genres = [
  "Low Fantasy",
  "High Fantasy",
  "Dark Fantasy",
  "Horror",
  "Steampunk",
  "Victorian",
  "Medieval",
  "Space",
  "Retrowave",
  "Modern"
];

var info,
    villain,
    genre;

var event_element   = jQuery('#event'),
    villain_element = jQuery('#villain'),
    genre_element   = jQuery('#genre'),
    loading_element = jQuery('#loading'),
    wrapper_element = jQuery('.wrapper'),
    slider_element  = jQuery('.slider'),
    dice_button     = jQuery('.dice'),
    content_element = jQuery('.content'),
    label_element   = jQuery('.label'),
    label_text      = jQuery('.label span'),
    logo_element    = jQuery('.logo'),
    d20_element     = jQuery('#d20'),
    d20_text        = jQuery('#d20 span'),
    generate_button = jQuery('.generate'),
    can_generate    = false;

function get_random_event(){
  jQuery.ajax({
    url: parser,
    type: 'POST',
    data: {
      address: 'http://www.history.com/this-day-in-history'
    },
    success: function(data){
      var events            = jQuery('.categories li .year',data),
          random            = get_random_item(events),
          random_event_year = jQuery.trim(jQuery(random).text()),
          random_event_href = jQuery(random).parent().find('a').attr('href'),
          random_event_info = jQuery.trim(jQuery(random).parent().find('a').text());

      info = random_event_info;
      event_element.text(info).wrap('<a href="http://www.history.com'+random_event_href+'" target="_blank"></a>').append('<div class="description down">Event</div>');
    }
  });
}

function get_random_villain(){
  jQuery.ajax({
    url: parser,
    type: 'POST',
    data: {
      address: 'http://www.imdb.com/list/ls000322259/'
    },
    success: function(data){
      var villains          = jQuery('.info a[href*="/character/"]',data),
          random            = get_random_item(villains),
          random_href       = jQuery(random).attr('href'),
          random_villain    = jQuery.trim(jQuery(random).text());

      villain = random_villain;
      villain_element.text(villain).wrap('<a href="http://www.imdb.com'+random_href+'" target="_blank"></a>').append('<div class="description down">Villain</div>');
    }
  });
}

function get_random_genre(){
  genre = get_random_item(genres);
  genre_element.text(genre).wrap('<a href="http://www.google.com.tr/search?q='+genre+'&hl=tr&source=lnms&tbm=isch" target="_blank"></a>').append('<div class="description down">Genre</div>');
}

function get_random_item(array){
  return array[Math.floor(Math.random()*array.length)];
}

function load_content(){
  var loading = setInterval(function(){
    var loaded = is_content_loaded(info) && is_content_loaded(villain) && is_content_loaded(genre);
    if(loaded){
      clearInterval(loading);
      fade_out_element(loading_element,function(){
        setTimeout(function(){
          wrapper_element.addClass('fadeIn');
          item_intro(function(){
            change_label_text(logo_element.attr('content'));
          });
        },500)
      });
    }
  },500);
  setTimeout(function(){
    clearInterval(loading);
  },1000*10);
}

function is_content_loaded(variable){
  return typeof variable !== 'undefined';
}

function fade_out_element(element,callback){
  element.addClass('fadeOut');
  setTimeout(function(){
    element.addClass('hide');
    typeof callback == 'function' && callback();
  },500)
}

function fade_in_element(element,callback){
  element.removeClass('hide');
  setTimeout(function(){
    element.removeClass('fadeOut');
    typeof callback == 'function' && callback();
  },500)
}

function item_intro(callback){
  setTimeout(function(){
    jQuery('.item').each(function(index,item){
      setTimeout(function() {
        jQuery(item).addClass('swipe');
        setTimeout(function(){
          jQuery(item).addClass('canHover');
          jQuery('.description',item).removeClass('down');
          jQuery('.canHover').length === 3 ? can_generate = true : can_generate = false;
        }, 1000)
      }, 1000*index);
    });
    typeof callback == 'function' && callback();
  },0);
}

function item_outro(callback){
  jQuery('.item').each(function(index,item){
    setTimeout(function() {
      jQuery(item).removeClass('swipe');
      jQuery(item).removeClass('canHover');
      jQuery('.description',item).addClass('down');
    }, 1000*index);
  });
  setTimeout(function(){
    typeof callback == 'function' && callback();
  },3000)
}

function events(){
  jQuery('.item').on('mouseenter',function(){
    jQuery('.description',this).addClass('down');
  });

  jQuery('.item').on('mouseleave',function(){
    jQuery('.description',this).removeClass('down');
  });

  dice_button.on('click',function(){
    var content = jQuery(this).attr('content');
    slider_element.addClass('active');
    content_element.addClass('rollerMode');
    change_label_text(content);
  });

  logo_element.on('click',function(){
    var content = jQuery(this).attr('content');
    slider_element.removeClass('active');
    content_element.attr('class','content');
    change_label_text(content);
  });

  d20_element.on('click',function(){
    d20_element.addClass('rolling');
    var roll = setInterval(function(){
      var random = Math.floor((Math.random() * 20) + 1);
      d20_text.text(random);
    },200);
    setTimeout(function(){
      clearInterval(roll);
      d20_element.removeClass('rolling');
    },1000*2)
  });

  generate_button.on('click',function(){
    if(can_generate){
      generate_button.addClass('hover');
      can_generate = false;
      var content = jQuery(this).attr('content');
      slider_element.removeClass('active');
      content_element.attr('class','content');
      change_label_text(content);
      fade_in_element(loading_element);
      item_outro(function(){
        get_random_event();
        get_random_villain();
        get_random_genre();
        load_content();
      });
      setTimeout(function(){
        generate_button.removeClass('hover');
      },500);
    }
  });
}

function change_label_text(content){
  label_element.removeClass('drop');
  setTimeout(function(){
    label_text.text(content);
    label_element.addClass('drop');
  },500);
}

function init_app(){
  get_random_event();
  get_random_villain();
  get_random_genre();
  load_content();
  events();
}

init_app();
/* Copyright © 2017 Onur Şahin Şentürk - All Rights Reserved */
