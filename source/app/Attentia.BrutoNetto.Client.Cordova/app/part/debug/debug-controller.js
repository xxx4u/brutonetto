Application.Controllers.controller('debug.controller', ['$scope', '$logger', '$interval', function($scope, $logger, $interval){
    var self = this;
    
    // SCOPE EVENT HANDLERS.
    $scope.$on('$stateChangeSuccess', function (event, data) {
        // Start the calculation.
        $scope.logEvents = self.filterLogEvents($logger.getLogEvents(), $scope.logEventLevels);
        $scope.selectedLogEvent = self.getLogEvent($scope.logEvents, $scope.$stateParams.id);
    });
    
    $scope.$on('event:application:log-events-changed', function (event, data) {
        $scope.logEvents = self.filterLogEvents(data, $scope.logEventLevels);
    });
    
    // SCOPE WATCHES
    $scope.$watch('selectedLogEvent', function(newValue, oldValue) {
        if (newValue) {
            $('#logEventDetail').appendTo('body').modal('show');
        }
        else {
            $('#logEventDetail').appendTo('div[ui-view]').modal('hide');
            $scope.$state.transitionTo('debug');
        }
    });
    
    
    // SCOPE PROPERTIES
    $scope.logEvents = [];
    $scope.selectedLogEvent = null;
    $scope.logEventLevels = [ 
        { level: 'DEBUG', isVisible: false },
        { level: 'INFO', isVisible: false },
        { level: 'WARN', isVisible: false },
        { level: 'ERROR', isVisible: true },
        { level: 'FATAL', isVisible: true } 
    ];
    
    
    // SCOPE BEHAVIOUR
    $scope.renderDone = function() {
        $scope.$emit('event:application:resize-requested');
    };
    
    $scope.toggleLogLevelVisibility = function(level) {
        console.log(level);
        $scope.logEvents = self.filterLogEvents($logger.getLogEvents(), $scope.logEventLevels);
    };
    
    $scope.selectEvent = function(event) {
        $scope.$state.transitionTo('debug.detail', { id: event.id });
    };
    
    $scope.unselectEvent = function() {
        $scope.selectedLogEvent = null;
    };
  
    $scope.selectPreviousEvent = function() {
        var id = self.getPreviousLogEventID($scope.logEvents, $scope.selectedLogEvent.id);        
        if (id) { $scope.$state.transitionTo('debug.detail', { id: id }); }
    };
    
    $scope.selectNextEvent = function() {
        var id = self.getNextLogEventID($scope.logEvents, $scope.selectedLogEvent.id);        
        if (id) { $scope.$state.transitionTo('debug.detail', { id: id }); }
    };
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    self.filterLogEvents = function(logEvents, logEventLevels) {
        var _logEventLevels = 
            Enumerable.From(logEventLevels)
                .Where(function(x) { return x.isVisible; })
                .ToArray();
        
        console.log(_logEventLevels);
        
        var logEvents = 
            Enumerable.From(logEvents)
                .Where(function(x) { return Enumerable.From(_logEventLevels).Any(function(y) { console.log(x); console.log(y); return x.level == y.level }); })
                .OrderByDescending(function(x) { return x.timestamp; })
                .ToArray();
        
        return logEvents;
    };
       
    self.getLogEvent = function(logEvents, id) {
       var logEvent = 
            Enumerable.From(logEvents)
                .Where(function(x) { return x.id == id; })
                .FirstOrDefault();
        
        return logEvent;
    };
        
    self.getPreviousLogEventID = function(logEvents, id) {
       var index = 
            Enumerable.From(logEvents)
                .IndexOf(Enumerable.From(logEvents).Where(function(x) { return x.id == id; }).Single()) + 1;
        
        var id = index <= logEvents.length ? logEvents[index].id : null;
        
        return id;
    };
        
    self.getNextLogEventID = function(logEvents, id) {
       var index = 
            Enumerable.From(logEvents)
                .IndexOf(Enumerable.From(logEvents).Where(function(x) { return x.id == id; }).Single()) - 1;
        
        var id = index >= 0 ? logEvents[index].id : null;
        
        return id;
    };
    
}]);