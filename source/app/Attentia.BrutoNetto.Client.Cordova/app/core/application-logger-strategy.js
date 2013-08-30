'use strict';

Application.Logger = Application.Logger || {};
Application.Logger.Strategy = Application.Logger.Strategy || {};

Application.Logger.Strategy.ConsoleLoggerStrategy = function() {
    
    function ConsoleLoggerStrategy() {
        var self = this;
        
        self.events = [];
    }
    
    ConsoleLoggerStrategy.prototype.log = function (event) {
        var self = this;
        var MAX_EVENTS = 100;
        
        self.events.push(event);
        
        if (self.events.length > MAX_EVENTS){
            self.events =
                Enumerable.From(self.events)
                    .OrderByDescending(function(x) { return x.timestamp; })
                    .Take(MAX_EVENTS)
                    .OrderBy(function(x) { return x.timestamp; })
                    .ToArray();
        }
        
        console.log(event);
    };

    ConsoleLoggerStrategy.prototype.getLogEvents = function (event) {
        var self = this;

        return self.events;
    };
    
    return new ConsoleLoggerStrategy();
};
