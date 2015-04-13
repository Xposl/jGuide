(function($){
   jGuide.extension.drag= {
     elem: null,
     move_interval: null,
     move_offset: 60,
     clickToNext: null,
     startPosition: {top:0,left:0},
     run: function(action,callback){
       var _this_ = this;
       var $help_top_cover = $("#help-top-cover");
       var $cursor = $("#help-cursor");
       if(action['selector'] != undefined ){
         if(typeof action['selector'] == 'function'){
           action['selector'] = action['selector'].call(action);
         }
         if(typeof action['selector'] == 'string'){
           _this_.elem = $(action['selector']).eq(0);
         }else{
           _this_.elem = action['selector'];
         }
         if(_this_.elem.length){
           _this_.elem.addClass("guide-focus");
         }
         
         _this_.move_offset = action['moveOffset'] != undefined ? action['moveOffset'] : 60;
         var description = action['description'] != undefined ? action['description'] : 'Select Element!';
         var target = action['target'] != undefined ? action['target'] : action['selector'];
         var target_elem = $(target)[0];
         _this_.startPosition.left = $cursor.offset().left;
         _this_.startPosition.top = $cursor.offset().top;
         var moveToX = _this_.startPosition.left;
         var moveToY = _this_.startPosition.top;
         var startEvent = {
           pageX: _this_.startPosition.left, 
           pageY: _this_.startPosition.top, 
           target: target_elem
         };
         if(action['eventAttrs'] != undefined){
           for(var eventAttr in action['eventAttrs']){
             startEvent[eventAttr] = action['eventAttrs'][eventAttr];
           }
         }
          
         var srart_e = jQuery.Event( "mousedown", startEvent); 
          
         if(_this_.elem.length){
           _this_.elem.addClass("guide-focus");
           
           if(action['description']){
             jGuide.displayMessage(description);
             _this_.clickToNext = _this_.end.bind(_this_,action,callback);
             $help_top_cover.bind('click',_this_.clickToNext);
           }
             
           _this_.elem.trigger(srart_e);
           var direct = 1;
           var count = 0;
           _this_.move_interval = setInterval(function(){
             if(count++ < _this_.move_offset){
               moveToX = moveToX + direct*1;
               var move_e = jQuery.Event( "mousemove", {pageX: moveToX, pageY: moveToY});
               $cursor.css({
                 left: moveToX,
                 top: moveToY
               });
               _this_.elem.trigger(move_e);
             }else{
               direct = direct*(-1);
               count = -_this_.move_offset;
               if(action['description'] == undefined){
                 _this_.end(action,callback);
               }
             }
          },5);         
         }
       }else{
         callback();
       }
     }, 
     end: function(action,callback){
       var _this_ = this;
       var $help_cursor = $("#help-cursor");
       var $help_top_cover = $("#help-top-cover");
       $help_cursor.css({
         left: _this_.startPosition.left,
         top: _this_.startPosition.top
       });
       if(_this_.move_interval){
         clearInterval(_this_.move_interval);
         _this_.move_interval = null;
       }
       if(_this_.elem && _this_.elem.length){
         _this_.elem.trigger("mouseup");
         _this_.elem.removeClass("guide-focus");
         _this_.elem = null;
       }
       $help_top_cover.removeClass("hidden");
       if(typeof action['callback'] == 'function'){
         action['callback'].call(_this_);
       }
       if(_this_.clickToNext){
         $help_top_cover.unbind('click',_this_.clickToNext);
         _this_.clickToNext = null;
       }
       if(action['description']){
         jGuide.clearMessages(callback);
       }else if(typeof callback == 'function'){
         callback();
       }
     }

   };
})(jQuery);
