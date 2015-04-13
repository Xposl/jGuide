(function($){
   jGuide.extension.message = {
     elem: null,
     clickToNext: null,
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
         
          var move_interval = null;
          if(_this_.elem.length){
            _this_.elem.addClass("guide-focus");
            var type_regex = /(success|primary|info|warning|danger)/;
            var description_type = action['messageType'] != undefined && type_regex.test(action['messageType'])? action['messageType'] : 'info';
            var description = action['description'] != undefined ? action['description'] : 'Message!';
            jGuide.displayMessage(description,"bg-"+description_type);
            _this_.clickToNext = _this_.end.bind(_this_,action,callback);
            $help_top_cover.bind("click",_this_.clickToNext);
          }
        }else{
          callback();
        }
     },
     end: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       
       if(_this_.elem && _this_.elem.length){
         _this_.elem.removeClass("guide-focus");
       }
       if(typeof action['callback'] == 'function'){
         action['callback'].call(_this_);
       }
       if(_this_.clickToNext){
         $help_top_cover.unbind("click",_this_.clickToNext);
       }
       jGuide.clearMessages(callback);
     }
   };
})(jQuery);
