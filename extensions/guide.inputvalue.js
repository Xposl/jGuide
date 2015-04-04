(function($){
   Guide.extension.inputvalue = {
     elem: null,
     input_interval: null,
     clickToNext: null,
     value: null,
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

          var duration = 50;
          if(_this_.elem.length){
            var description = action['description'] != undefined ? action['description'] : 'Input Value!';
            _this_.value = action['value'] != undefined ? action['value'] : 'Input Value!';
            var index = 0;
            var inputValue = '';
            
            _this_.elem.addClass("guide-focus");
            Guide.displayMessage(description);
            _this_.input_interval = setInterval(function(){
              inputValue += _this_.value[index++];
              _this_.elem.val(inputValue);
              if(index >= _this_.value.length){
                inputValue = '';
                index = 0;
              }
            },duration);
            _this_.clickToNext = _this_.end.bind(_this_,action,callback);
            $help_top_cover.bind("click",_this_.clickToNext);
          }
        }else{
          callback();
        }
     }, 
     end: function(action,callback){
       var _this_ = this;
       var $help_cursor = $("#help-cursor");
       var $help_top_cover = $("#help-top-cover");
        if(_this_.input_interval){
          clearInterval(_this_.input_interval);
          _this_.input_interval = null;
        }
        if(_this_.elem &&  _this_.elem.length){
          _this_.elem.val(_this_.value);
          _this_.elem.removeClass("guide-focus");
        }
        if(typeof action['callback'] == 'function'){
          action['callback'].call(_this_);
        }
        if(_this_.clickToNext){
          $help_top_cover.unbind("click",_this_.clickToNext);
        }
        _this_.value = null;
        Guide.clearMessages(callback);
     }
   };
})(jQuery);