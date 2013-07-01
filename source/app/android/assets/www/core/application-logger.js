'use strict';

Application.Logger = Application.Logger || {};
Application.Logger.Strategy = Application.Logger.Strategy || {};

Application.Logger.Strategy.ConsoleLoggerStrategy = function() {
    
    function LoggerStrategy() {
        var self = this;
        
        self.events = [];
    }
    
    LoggerStrategy.prototype.log = function(event) {
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
    
    LoggerStrategy.prototype.getLogEvents = function(event) {
        var self = this;
        
        return self.events;
    }
    
    return new LoggerStrategy();
};

Application.Services.factory('$loggerFactory', ['$rootScope', '$constant', '$configuration', function($scope, $constant, $configuration) {

    function LoggerFactory() {
        var self = this;
        
        function Logger() {
            var self = this;
            
            // Retrieve the LOG LEVEL.
            self.level = $configuration.get($constant.LOCAL_STORAGE, 'application.logging.logLevel', $constant.DEFAULT_LOG_LEVEL);
            
            // Retrieve the LOGGER STRATEGY.
            var _loggerStrategy = $configuration.get($constant.LOCAL_STORAGE, 'application.logging.loggerStrategy', $constant.DEFAULT_LOGGER_STRATEGY);
            self.loggerStrategy = Application.Logger.Strategy[_loggerStrategy]();
        }
        
        Logger.prototype.log = function(event) {
            var self = this;
            
            var level = event.level ? event.level.split('.')[1] : 'UNSPECIFIED';        
            var _event = angular.extend({ id: Guid.newGuid(), timestamp: new Date().toISOString(), level: $constant.LOG_LEVEL_INFO, message: null, data: null }, { level: level, message: event.message, data: event.data });
            
            // The event is logged in case there is a logging strategy and the level is equal or lower then the current log level.
            if (self.loggerStrategy && event.level <= self.level) { 
               self.loggerStrategy.log(_event);
            }
            
            var logEvents = self.getLogEvents();
            $scope.$broadcast('event:application:log-events-changed', logEvents);
        };
        
        Logger.prototype.getLogEvents = function() {
            var self = this;
            
            var logEvents = [];
            if (self.loggerStrategy) { 
               logEvents = self.loggerStrategy.getLogEvents();
            }
            
            return logEvents;
        }
        
        return new Logger();
    }
    
    return LoggerFactory;
}]);

Application.Services.factory('$logger', ['$loggerFactory', function($loggerFactory) {
    
    return $loggerFactory();    
                                              
}]);
