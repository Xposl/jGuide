(function($){
   jGuide.extension.eventclick = {
     elem: null,
     move_interval: null,
     emulation_click: true,
     clickToEmulation: null,
     run: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       
       if(action['selector'] != undefined){
         if(typeof action['selector'] == 'function'){
            action['selector'] = action['selector'].call(action);
          }
          if(typeof action['selector'] == 'string'){
            _this_.elem = $(action['selector']).eq(0);
          }else{
            _this_.elem = action['selector'];
          }
          var description = action['description'] != undefined ? action['description'] : 'Click!';
          _this_.emulation_click = action['emulationClick'] != undefined ? action['emulationClick'] : true;

          if(_this_.elem.length){
            _this_.elem.addClass("guide-focus"); 
            if(action['description']){
              jGuide.displayMessage(description);
              _this_.clickToEmulation = _this_.emulationClick.bind(_this_,action,callback);
              $help_top_cover.bind("click",_this_.clickToEmulation);
            }else if(_this_.emulation_click){
              _this_.elem.trigger("click");
              _this_.end(action,callback);
            }
          }
        }else{
          callback();
        }
     },
     checkValue: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       var value = _this_.elem.val();
       if(!value){
         var warning = action['valueCheckerErrorInfo'] != undefined ? action['valueCheckerErrorInfo'] : 'Error';
         displayDescription(warning,"bg-warning");
       }else{
          _this_.elem.unbind("change",valueChecker);
          if(typeof callback == 'function'){
            callback(e);
          }
       }
     },
     emulationClick: function(action,callback,e){
       e.preventDefault();
       e.stopPropagation();
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       var offsetX = e.pageX - $help_top_cover.offset().left;
       var offsetY = e.pageY - $help_top_cover.offset().top;
       
       if(_this_.elem && _this_.elem.length && !_this_.emulation_click){
         var startX = _this_.elem.offset().left;
         var startY = _this_.elem.offset().top;
         var width = _this_.elem.outerWidth();
         var height = _this_.elem.outerHeight();
         if((startX <= offsetX && offsetX <= (startX+width))
          &&(startY <= offsetY && offsetY <= (startY+height))){
            _this_.elem.trigger("click");
          }
       }else if(_this_.elem && _this_.elem.length && _this_.emulation_click){
          _this_.elem.trigger("click");
          _this_.end(action,callback);
        }
     },
     end: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       $help_top_cover.removeClass("hidden");
       
       if(_this_.clickToEmulation){
         $help_top_cover.unbind("click",_this_.clickToEmulation);
         _this_.clickToEmulation = null;
       }
       if(typeof action['callback'] == 'function'){
         action['callback'].call(_this_);
       }
       if(_this_.elem && _this_.elem.length){
          _this_.elem.removeClass("guide-focus");
          _this_.elem = null;
       }
       if(action['description']){
         jGuide.clearMessages(callback);
       }else{
         callback();
       }
     }
   };
})(jQuery);
