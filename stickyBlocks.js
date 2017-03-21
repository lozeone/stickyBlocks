// stickyBlocks
// Sticks blocks to its parent when scrolling using the available width between two elements.
// Sort of like the right column on facebook
// requires waypoints.js
// 3/18/17
// by lozeone


(function($) {

  $.stickMultiBlocks = function(element, options) {

    // plugin's default options
    // this is private property and is  accessible only from inside the plugin
    var defaults = {
      blockElements: '.block', // the elements inside this container to make sticky
      stuckClass: 'stickyBlock', // class to add to stuck elements.
      offset: 0, // offset pixels from the top of the page.
      topTrigger: $(element), //'body', // the top of this element is the trigger
      heightEl: 'body', // the element used to determine the height
      threshold: 200 // ammount of pixels to subtract from the height element when determining stickability
    }

    // to avoid confusions, use "plugin" to reference the current instance of the object
    var plugin = this;

    // this will hold the merged default, and user-provided options
    // plugin's properties will be available through this object like:
    // plugin.settings.propertyName from inside the plugin or
    // element.data('stickMultiBlocks').settings.propertyName from outside the plugin, where "element" is the
    // element the plugin is attached to;
    plugin.settings = {}

    var $element = $(element), // reference to the jQuery version of DOM element the plugin is attached to
      element = element; // reference to the actual DOM element

    // ====================================================================
    // the "constructor" method that gets called when the object is created
    plugin.init = function() {

      // the plugin's final properties are the merged default and user-provided options (if any)
      plugin.settings = $.extend({}, defaults, options);

      var $blocks = $element.find(plugin.settings.blockElements);
      if (!$blocks.length) {
        return false;
      }
      // code goes here
      plugin.totalBlockHeight = 0;
      plugin.totalStageHeight = 0;
      //var $container = $element; //$(this);
      plugin.sticking = false;
      plugin.heightEl = $(plugin.settings.heightEl);
      plugin.topEl = $(plugin.settings.topTrigger);
      plugin.stuckBlock = false;
      //var enabled = true;
      /*if (!$element.length) {
        return false;
      }*/

      plugin.wrappers = wrapElements($blocks);
      plugin.calcBlocks();
      //console.log('totalBlockHeight: ' + plugin.totalBlockHeight);

      //console.log($blocks);
      //console.log($wrappers);

      plugin.waypoint = $(plugin.settings.topTrigger).waypoint({
        handler: function(direction) {
          if (direction == 'down') {
            // start sticking
            //console.log('Start Sticking');
            plugin.sticking = true;
            //$el.addClass(settings.stuckClass);
          } else {
            // stop sticking
            //console.log('Stop Sticking');
            sticking = false;
            unstick(plugin.wrappers);
            //$el.removeClass(settings.stuckClass);
          }
        },
        offset: plugin.settings.offset //$('#navigation').height()
      });

      plugin.react();

      // recalc size when window size changes.
      $(window).resize(plugin.calcBlocks);

      // react on scrolling
      $(window).scroll(plugin.react);



    }

    // ==================================================================
    // public methods
    // these methods can be called like:
    // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
    // element.data('stickMultiBlocks').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
    // is the element the plugin is attached to;

    // a public method. for demonstration purposes only - remove it!
    /*    plugin.foo_public_method = function() {

          // code goes here

        }*/


    plugin.calcBlocks = function() {
      if (plugin.wrappers.length) {
        unstick(plugin.wrappers);
        plugin.wrappers.each(function(index, el) {
          $el = $(el);
          $el.data('origHeight', $el.outerHeight());
          $el.data('origWidth', $el.outerWidth());
        });
        plugin.totalBlockHeight = $element.outerHeight(true);
        plugin.totalStageHeight = plugin.heightEl.outerHeight(true) - plugin.settings.threshold;
      }
    }


    plugin.react = function() {

      //var stageHeight = plugin.heightEl.outerHeight(true) - plugin.settings.threshold; //heightEl.offset().top + heightEl.outerHeight(true) - topEl.offset().top;
      if (plugin.sticking && plugin.totalStageHeight > plugin.totalBlockHeight) {
        //var stageHeight = plugin.heightEl.outerHeight(true); //heightEl.offset().top + heightEl.outerHeight(true) - topEl.offset().top;
        //console.log(stageHeight+' > '+plugin.totalBlockHeight)
        //if (stageHeight > plugin.totalBlockHeight) {
        var $vis = getVisible(availableHeight(), plugin.wrappers);
        var scrollTop = $(window).scrollTop();
        if ($vis) {
          if (scrollTop > plugin.totalBlockHeight + $element.offset().top - $vis.outerHeight(true) - plugin.settings.offset - 5) {
            //console.log('sticking', $vis);
            if ($vis != plugin.stuckBlock) {
              unstick($element.find('.' + plugin.settings.stuckClass).not($vis));
              if (!$vis.hasClass(plugin.settings.stuckClass)) {
                stick($vis);

              }
            }

          } else {
            unstick($element.find('.' + plugin.settings.stuckClass));
          }
        } else {
          unstick($element.find('.' + plugin.settings.stuckClass));
        }
        //}
      } else {
        if (plugin.stuckBlock) {
          unstick($element.find('.' + plugin.settings.stuckClass));
        }
      }
    }


    plugin.enable = function() {
      $.each(plugin.waypoint, function(i, wp) {
        wp.enable();
        plugin.sticking = true; //wp.refresh();
      });
    }


    plugin.disable = function() {
      $.each(plugin.waypoint, function(i, wp) {
        wp.disable();
      });
      plugin.sticking = false;
      unstick(plugin.wrappers);
    }

    // ==============================================================
    // private methods
    // these methods can be called only from inside the plugin like:
    // methodName(arg1, arg2, ... argn)

    // a private method. for demonstration purposes only - remove it!
    /*var foo_private_method = function() {

      // code goes here

    }*/

    var unstick = function(block) {
      //if (block.length) {
      block.removeClass(plugin.settings.stuckClass);
      block.removeAttr('style');
      plugin.stuckBlock = false;
      //console.log('unsticking', block);
      //}
    }

    var stick = function(block) {
      block.addClass(plugin.settings.stuckClass);
      block.css({
        //'position': 'fixed',
        'top': plugin.settings.offset,
        'width': block.data('origWidth') + 'px'
      });
      plugin.stuckBlock = block;
    }

    var wrapElements = function(blocks) {
      var wrapped = $();
      blocks.wrapAll($('<div class="scrollgroup"></div>'));
      blocks.each(function(index, el) {
        wrapped = wrapped.add(el);
        blocks.not(wrapped).wrapAll($('<div class="scrollgroup"></div>'));
      });
      // return all the wrapped divs
      //console.log(blocks);
      return $element.find('.scrollgroup');
    }


    var getVisible = function(av, blocks) {
      var visEl = false;
      // console.log(settings);
      blocks.each(function(index, el) {
        var $el = $(el);
        //console.log($element.data('origHeight') + ' < ' + av);
        //// data('origHeight')
        if ($el.data('origHeight') < av) {
          //console.log(index);
          visEl = $el;
          return false;
        }
      });
      return visEl;
    }

    var availableHeight = function() {
      var scrollTop = $(window).scrollTop();
      var availHeight = Waypoint.viewportHeight() - plugin.settings.offset;
      //console.log(stickTop);
      //var bottom = heightEl.offset().top + heightEl.outerHeight(true) - topEl.position().top;
      //console.log(bottom);
      if (plugin.heightEl.length) {
        //var footerPos = fstop.footer.offset().top - scrollTop - navHeight;
        var bottomPos = plugin.heightEl.offset().top + plugin.heightEl.outerHeight(true) - scrollTop - plugin.settings.offset; //20; //scrollTop -

        if (bottomPos < availHeight) {
          availHeight = bottomPos;
        }
      }

      availHeight = Math.round(availHeight);
      //console.log(availHeight);
      return availHeight;
    }


    // fire up the plugin!
    // call the "constructor" method
    plugin.init();

  }


  // add the plugin to the jQuery.fn object
  $.fn.stickMultiBlocks = function(options) {

    // iterate through the DOM elements we are attaching the plugin to
    return this.each(function() {

      // if plugin has not already been attached to the element
      if (undefined == $(this).data('stickMultiBlocks')) {

        // create a new instance of the plugin
        // pass the DOM element and the user-provided options as arguments
        var plugin = new $.stickMultiBlocks(this, options);

        // in the jQuery version of the element
        // store a reference to the plugin object
        // you can later access the plugin and its methods and properties like
        // element.data('stickMultiBlocks').publicMethod(arg1, arg2, ... argn) or
        // element.data('stickMultiBlocks').settings.propertyName
        $(this).data('stickMultiBlocks', plugin);

        //@@todo. how can i return the pugin functions directly to the object.
        //$(this).extend(plugin);

      }

    });

  }

})(jQuery);
