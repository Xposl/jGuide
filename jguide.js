/* javascript document */


var jGuide = jGuide || {settings:{},extension:{},actions:{}};
(function($){
    var settings = {
      title: 'Help',
      configs: {}, //Your jGuide Lists
      extension_path: './extensions/',
      extensions: ['moveto','eventclick','message','inputvalue','event','drag'],
    };
    var current_guide = null;
    var action_running = jGuide.extension ? jGuide.extension : {};
    var action_index = 0;
    
    
    var $help_group = $('<div id="jguide-help-group" ></div>');
    var $help_menu = $('<ul class="dropdown-menu"></ul>');
    var $help_top_cover = $('<div id="help-top-cover" class="help-cover hidden"></div>');
    var $help_bottom_cover = $('<div id="help-bottom-cover" class="help-cover hidden"></div>');
    var $help_cursor = $('<div id="help-cursor" class="cursor hidden" ></div>');
    var $help_description = $('<div id="help-description" class="hidden"></div>');
    var $help = $('<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle glyphicon glyphicon-question-sign" data-toggle="dropdown">'+settings['title']+'<span class="caret"></span></button></div>');
    var $skip_button = $('<div id="help-btn-skip" class="btn btn-default hidden">Skip</div>');
    
    $(document).ready(function(){
      jGuide.settings = $.extend(settings,jGuide.settings);
      settings = jGuide.settings;
      var curr_actions = null;
      //append scripts
      for(var i=0; i < settings.extensions.length; i++){
        var s = document.createElement("script");
        var extionsion = settings.extensions[i];
        s.type = "text/javascript";
        s.src = settings['extension_path']+'jguide.'+extionsion+".js";
        $("head").append(s);
      }
      action_running = jGuide.extension ? jGuide.extension : {};
      $help_group.bind("show",function(){
        var height = parseInt($(document).height());
        var width = parseInt($(document).width());
        $help_top_cover.css({
          height: height,
          width: width
        });
        $help_bottom_cover.css({
          height: height,
          width: width
        });
        
        $help_top_cover.removeClass("hidden");
        $help_bottom_cover.removeClass("hidden");
        $help_cursor.removeClass("hidden");
        $skip_button.removeClass("hidden");
      }).bind("hide",function(){
        $help_top_cover.addClass("hidden");
        $help_bottom_cover.addClass("hidden");
        $help_cursor.addClass("hidden");
        $skip_button.addClass("hidden");
      });
      
      //TODO: extenstion add stop function
      $skip_button.bind("click",function(){
        stopActions.call(current_guide,curr_actions);
        curr_actions = null;
      });
      
      for(var menu_key in settings['configs']){
        var menu = settings['configs'][menu_key];
        var menu_title = menu['title'] ? menu['title'] : menu_key;
    
        var $menu = $('<li><a href="#">'+menu_title+'</a></li>');
        $menu.data('menu',menu);
        $help_menu.append($menu);
        $menu.bind("click",function(){
          var menu = $(this).data('menu');
          current_guide = menu;
          curr_actions = menu['actions'] ? menu['actions'] : [];
          $help_group.trigger("show");
          $help_cursor.css({
              left: 0,
              top: 0
          });
          if(typeof menu.start == 'function'){
            menu.start.call(menu,function(){
              runActions.call(menu,curr_actions,0);
            });
          }else{
            runActions.call(menu,curr_actions,0);
          }
        });
      }
      
      $help_top_cover.bind("mousemove",function(e){e.preventDefault();e.stopPropagation();});
      $help_top_cover.bind("mouseup",function(e){e.preventDefault();e.stopPropagation();});
      $help.append($help_menu);
      $help_group.append($help);
      $help_group.append($help_bottom_cover);
      $help_group.append($help_top_cover);
      $help_group.append($help_description);
      $help_group.append($help_cursor);
      $help_group.append($skip_button);
      $("body").append($help_group);
    });
    
    //run actions
    function runActions(actions,index){
      var _this_ =  this;
      if(actions[index] != undefined){
        var action = actions[index];
        action_index = index;
        if(action_running[action.type] != undefined && action.type!=undefined){
          if(typeof action_running[action.type].run == 'function'){
            action_running[action.type].run.call(action_running[action.type],action,function(){
              runActions.call(_this_,actions,++index);
            });
            return true;
          }
        }
      }else{
        action_index = -1;
        return stopActions.call(current_guide,actions);
      }
      $help_group.trigger("hide");
      action_index = 0;
      return false;
    }
    
    function stopActions(actions){
      var _this_ =  this;
      if(action_index >=0 
        && actions[action_index] != undefined){
        var action = actions[action_index];
        if(typeof action_running[action.type].end == 'function'){
          action_running[action.type].end.call(action_running[action.type],action,function(){
            jGuide.clearMessages();
            if(typeof _this_.end == 'function'){
               _this_.end.call(_this_);
            }
            $help_group.trigger("hide");
            action_index = 0;
          });
          return true;
        }
      }
      if(typeof _this_.end == 'function'){
        _this_.end.call(_this_);
      }
      jGuide.clearMessages();
      $help_group.trigger("hide");
      action_index = 0;
      return true;
    }
    
    //description
    jGuide.displayMessage = function(description,className,callback){
      className =  className != undefined ? className : "bg-info";
      var $description = $('<p>'+description+'</p>');
      $help_description.removeClass("hidden");
      $description.addClass(className);
      $help_description.append($description);
      if(typeof callback == 'function'){
        callback.call(this);
      }
    };
    
    jGuide.clearMessages = function(callback){
      $help_description.html('');
      $help_description.addClass("hidden");
      if(typeof callback == 'function'){
        callback.call(this);
      }
    };
})(jQuery);
