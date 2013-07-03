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
    var pluginName = 'scrollIndicator';
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

            case 'resize':
                self.resize();
                break;

            default:
                throw 'Unsupported action: ' + this.options.action;
        }
    };

    plugin.prototype.init = function () {
        var self = this;

        // Take the content of the page.
//        var _parent = self.element.parent();
        var _content = self.element.contents().detach();

        // Add the slide page container.
//        self.container = $('<div />').appendTo(_parent);
//        self.container.addClass('scrollIndicator-container');
        self.element.addClass('scrollIndicator-container');

        // Add the vertical indicator.
        self.verticalIndicator = $('<div />').appendTo(self.element);
        self.verticalIndicator.addClass('scrollIndicator-verticalIndicator');

        self.verticalIndicatorSlider = $('<div />').appendTo(self.verticalIndicator);
        self.verticalIndicatorSlider.addClass('scrollIndicator-verticalIndicator-slider');

        // Add the body.
        self.body = $('<div />').appendTo(self.element);
        self.body.addClass('scrollIndicator-body');

        self.bodyContent = $('<div />').appendTo(self.body);
        self.bodyContent.addClass('scrollIndicator-body-content');

        // Add the original content to the slidepage body.
        _content.appendTo(self.bodyContent);

        self.bindEvents();

        setTimeout(function(){
            self.resize();
        }, 200);
    };

    plugin.prototype.bindEvents = function () {
        var self = this;

        $(window).resize(function () {
            self.resize();
        });

        self.body.scroll(function(event) {
            var $this = $(this);
            self.verticalIndicatorSlider.css('top', $this.scrollTop() * self.verticalRatio);
            self.verticalIndicator.addClass('scrolling');

            if (self.scrollIndicatorVisibleTimeout) clearTimeout(self.scrollIndicatorVisibleTimeout);
            self.scrollIndicatorVisibleTimeout = setTimeout(function() {
                self.verticalIndicator.removeClass('scrolling');
            }, 2000);
        });
    };

    plugin.prototype.resize = function () {
        var self = this;

        self.element.css('position', 'relative');
        
        
        self.body.height(self.element.height());
        self.body.width(self.element.width() + 20);
        self.bodyContent.width(self.element.width());

        var marginTop = parseInt(self.verticalIndicator.css("marginTop").replace('px', ''));
        var marginBottom = parseInt(self.verticalIndicator.css("marginBottom").replace('px', ''));

        self.verticalIndicator.height(self.body.height() - marginTop - marginBottom);
        self.verticalRatio = (self.element[0].scrollHeight - marginTop - marginBottom)/ self.bodyContent.height();

        self.verticalIndicatorSlider.height(self.verticalIndicator.height() * self.verticalRatio);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new plugin($(this), options));
            }
            else {
                var instance = $.data(this, 'plugin_' + pluginName);
                instance.action(this, $.extend({}, instance.options, options));
            }
        });
    };

})(jQuery, window, document);