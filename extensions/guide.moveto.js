//Guide Function 'Move To'
//  name: move to
//  author: xposl
//  date: March, 5th, 2014
/**
 * Move the cusror to the element or local you want
 * @action{
 *   type: 'moveto',
 *   selector: [selector|function|jquery object],
 *   goal: {left:0,top:0},
 *   duration: 0                    //how long will this cursor runs
 *   delay: 0                         //how long will be wait to begin the action
 * }
 */
(function($){
   Guide.extension.moveto = {
     move_interval: null,
     elem: null,
     offset: {top:0,left:0},
     clickToNext: null,
     run: function(action,callback){
       var _this_ = this;
       var duration = this.duration;
       var $help_cursor = $("#help-cursor");
       var $help_top_cover = $("#help-top-cover");
       //action attribute
       var delay = action['delay'] != undefined ? action['delay'] : 1;
       var duration = action['duration'] != undefined ? action['duration'] : 800;
       
       if(action['selector'] != undefined || action['goal'] != undefined){
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
         var init_offsest = {
           'top': $help_cursor.css('top'),
           'left': $help_cursor.css('left')
         };
         setTimeout(function(){
           if(action['goal'] != undefined){
              _this_.offset = {
                top: action['goal'].top != undefined ? action['goal'].top : 0,
                left: action['goal'].left != undefined ? action['goal'].left : 0
              };
           }else if(_this_.elem && _this_.elem.length){
             _this_.offset = _this_.elem.offset();
             var width = _this_.elem.outerWidth();
             var height = _this_.elem.outerHeight();
             _this_.offset = {
               top: _this_.offset['top'] + (height/2)  - $help_top_cover.offset().left,
               left: _this_.offset['left'] + (width/2)  - $help_top_cover.offset().top,
             };
           }else{
             _this_.offset = {
               top: $help_cursor.css('top'),
               left: $help_cursor.css('left')
             };
           }
          
           if(action['description']){
             Guide.displayMessage(action['description']);
             $help_cursor.animate(_this_.offset,duration,function(){
               $help_cursor.css(init_offsest);
             });
             _this_.move_interval = setInterval(function(){
               $help_cursor.animate(_this_.offset,duration,function(){
                 $help_cursor.css(init_offsest); 
               });
             },duration);
             _this_.clickToNext = _this_.end.bind(_this_,action,callback);
             $help_top_cover.bind("click",_this_.clickToNext);
           }else{
             $help_cursor.animate(_this_.offset,duration,_this_.end.bind(_this_,action,callback));
           }
         },delay);
       }else{
         callback();
       }
     }, 
     end: function(action,callback){
       var _this_ = this;
       var $help_cursor = $("#help-cursor");
       var $help_top_cover = $("#help-top-cover");
       if(_this_.move_interval){
         clearInterval(_this_.move_interval);
         _this_.move_interval = null;
         _this_.offset = {top:0,left:0};
       }
       $help_cursor.stop().css(_this_.offset);
       if(_this_.elem && _this_.elem.length){
          _this_.elem.removeClass("guide-focus");
          _this_.elem = null;
       }
       if(_this_.clickToNext){
         $help_top_cover.unbind("click",_this_.clickToNext);
         _this_.clickToNext = null;
       }       
       if(action['description']){
         Guide.clearMessages(callback);
       }else if(typeof callback == 'function'){
         callback();
       }
     }
   };
})(jQuery);
