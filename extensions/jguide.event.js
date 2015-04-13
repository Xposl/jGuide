(function($){
   jGuide.extension.event= {
     elem: null,
     clickToTriggerEvent: null,
     run: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       var $cursor = $("#help-cursor");

       if(action['selector'] != undefined && action['event'] != undefined){
          if(typeof action['selector'] == 'function'){
            action['selector'] = action['selector'].call(action);
          }
          if(typeof action['selector'] == 'string'){
            _this_.elem = $(action['selector']).eq(0);
          }else{
            _this_.elem = action['selector'];
          }
             
          var event_name = action['event'];
          var target = action['target'] != undefined ? action['target'] : action['selector'];
          var target_elem = $(target)[0];
          var pageX = $cursor.offset().left;
          var pageY = $cursor.offset().top;
          
          var eventAttrs = {pageX: pageX, pageY: pageY, target: target_elem};
          if(action['eventAttrs'] != undefined){
            for(var eventAttr in action['eventAttrs']){
              eventAttrs[eventAttr] = action['eventAttrs'][eventAttr];
            }
          }
          var my_evet = jQuery.Event(event_name, eventAttrs);
          
          if(_this_.elem.length){
            _this_.elem.addClass("guide-focus");
            if(action['description']){
              jGuide.displayMessage(action['description']);
              _this_.clickToTriggerEvent = function(e){
                e.preventDefault();
                _this_.elem.trigger(my_evet);
                _this_.end(action,callback);
              };
              $help_top_cover.bind('click',_this_.clickToTriggerEvent );
            }else{
              $elem.trigger(my_evet);
              _this_.end(action,callback);
            }
          }
        }else{
          callback();
        }
     },
     end: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       $help_top_cover.removeClass("hidden");
       
       if(_this_.elem && _this_.elem.length){
         _this_.elem.unbind("click",_this_.end);
         _this_.elem.removeClass("guide-focus");
         _this_.elem = null;
       }
       if(typeof action['callback'] == 'function'){
         action['callback'].call(_this_);
       }
       if(_this_.clickToEmulation){
         $help_top_cover.unbind("click",_this_.clickToEmulation);
         _this_.clickToEmulation = null;
       }
       if(action['description']){
         jGuide.clearMessages(callback);
       }else{
         callback();
       }
     }
   };
})(jQuery);
