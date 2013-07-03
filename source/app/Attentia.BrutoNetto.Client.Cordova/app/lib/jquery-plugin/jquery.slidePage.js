/// <reference path="jquery-1.8.2-vsdoc.js" />


// the semi-colon before function invocation is a safety net against concatenated scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'slidePage';
    var defaults = {
        action: 'init',
        speed: 200,
        isModal: false
    };

    // The plugin constructor
    function plugin(element, options) {
        var self = this;
        
        self.element = element;
        self.action(element, options);
    }

    plugin.prototype.action = function (element, options) {
        var self = this;

        // Merge the defaults and the current options.
        self.options = $.extend({}, defaults, options);

        // Execute the requested action.
        switch (this.options.action) {
            case 'init':
                self.init();
                break;
                
            case 'close':
                self.hide();
                break;

            default:
                throw 'Unsupported action: ' + this.options.action;
        }
    };

    plugin.prototype.init = function () {
        var self = this;

        // Take the content of the page.
        var _body = self.element.contents().detach();

        // Add the slide page container.
        self.container = $('<div />').attr('id', 'slidepage').appendTo(self.element);
        self.container.addClass('slidePage-container');

        // Add the slide page body.
        self.sidepanel = $('<div />').css('display','none').appendTo(self.container);
        self.sidepanel.addClass('slidePage-sidepanel');

        // Add the slide page sidepanel.
        self.body = $('<div />').appendTo(self.container);
        self.body.addClass('slidePage-body');

        // Add the original content to the slidepage body.
        _body.appendTo(self.body);

        if (self.options.sidepanel) {
            var $sidepanel = $(self.options.sidepanel).detach();
            $sidepanel.appendTo(self.sidepanel);
        }
        else if (self.options.url) {
            self.sidepanel.load(self.options.url);
        }
        
        if (self.options.toggle) {
            $(self.options.toggle).click(function (event) {
                setTimeout(function(){
                    self.toggle();
                }, 10);

                // Prevent the default behavior and stop propagation.
                event.preventDefault();
                event.stopPropagation();
            });
        }

        // A click on the document closes the sidepanel.
        $(document).bind('click keyup', function(event) {
	        // If this is a keyup event, let's see if it's an ESC key.
            if(event.type == 'keyup' && event.keyCode != 27) return;

	        // Make sure it's visible.	    
	        if(self.sidepanel.is(':visible')) {  self.toggle(); }
	    });

        // Prevent that a click on the sidepanel hides it.
        self.sidepanel.click(function(event) {
            event.stopPropagation();
        });
        
        $(window).resize(function () {
            self.resize();
        });

        self.resize();
    };

    plugin.prototype.resize = function () {
        var self = this;

        var height = $(window).height();
        self.container.height(height);
        self.body.height(height);
        self.sidepanel.height(height);
    };

    plugin.prototype.toggle = function () {
        var self = this;

        if (self.sidepanel.is(':visible')){
            self.hide();
        }
        else {
            self.show();
        }
    };

    plugin.prototype.show = function () {
        var self = this;
        
        if (!self.sidepanel) { return; }

        var width = self.sidepanel.outerWidth(true);
        var bodyAnimation = {};
        var sidepanelAnimation = {};

        if( self.sidepanel.is(':visible') || self.isSliding ) return;	        
        self.isSliding = true;
        
        move(self.body[0])
          .set('left', width)
            .duration('0.5s')
            .end();

        self.sidepanel.css({ left: 'auto', right: '-' + width + 'px', width: width + 'px' });
        //bodyAnimation['margin-left'] = '+=' + width;
        sidepanelAnimation['left'] = '+=' + width;

        self.body.animate(bodyAnimation, self.options.speed);
        self.sidepanel
            .show()
            .animate(sidepanelAnimation, self.options.speed, function() {
                        self.isSliding = false;
                        if (self.options.visibilityChanged) self.options.visibilityChanged();
                        self.resize();
                  });
        if (self.options.visibilityChanging) self.options.visibilityChanging();
    };

    plugin.prototype.hide = function () {
        var self = this;
        
        if (!self.sidepanel) { return; }
        
        var width = self.sidepanel.outerWidth(true);
        var bodyAnimation = {};
        var sidepanelAnimation = {};

        if( self.sidepanel.is(':hidden') || self.isSliding ) return;	        
        self.isSliding = true;

        bodyAnimation['margin-left'] = '-=' + width;
        sidepanelAnimation['right'] = '-=' + width;

        move(self.body[0])
            .set('left', 0)
            .duration('0.5s')
            .end(function() { self.sidepanel.hide(); });
         
        //self.body.animate(bodyAnimation, self.options.speed);
        self.sidepanel
            .animate(sidepanelAnimation, self.options.speed, function() {
                self.isSliding = false;
                if (self.options.visibilityChanged) self.options.visibilityChanged();
                self.resize();
            });
        if (self.options.visibilityChanging) self.options.visibilityChanging();
    };
    
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new plugin($(this), options));
            }
            else{
                var instance = $.data(this, 'plugin_' + pluginName);
                instance.action(this, $.extend({}, instance.options, options));
            }
        });
    };
    
    $[pluginName] = function(options) {     
        var $body = $('body');
        $body[pluginName](options);
    };

})(jQuery, window, document);