'use strict';

Application.Logger = Application.Logger || {};
Application.Logger.Strategy = Application.Logger.Strategy || {};

Application.Logger.Strategy.ConsoleLoggerStrategy = function() {
    
    function LoggerStrategy() {
        var self = this;
        
        self.events = [];
    }
    
    LoggerStrategy.prototype.log = function(event) {
        console.log(event);
    };
    
    return new LoggerStrategy();
};

Application.Services.factory('$loggerFactory', ['$constant', '$configuration', function($constant, $configuration) {

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
            var _event = angular.extend({ timestamp: new Date().toISOString(), level: $constant.LOG_LEVEL_INFO, message: null, data: null }, { level: level, message: event.message, data: event.data });
            
            // The event is logged in case there is a logging strategy and the level is equal or lower then the current log level.
            if (self.loggerStrategy && event.level <= self.level) { 
               self.loggerStrategy.log(_event);
            }
        };            
        
        return new Logger();
    }
    
    return LoggerFactory;
}]);

Application.Services.factory('$logger', ['$loggerFactory', function($loggerFactory) {
    
    return $loggerFactory();    
                                              
}]);
