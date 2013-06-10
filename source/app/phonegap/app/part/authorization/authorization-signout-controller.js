'use strict';

Application.Controllers.controller('authorization.signout.controller', ['$scope', '$constant', '$configuration', '$interval', function($scope, $constant, $configuration, $interval){
    var self = this;
    
     $scope.$on('$stateChangeSuccess', function (event, data) {
         $scope.$emit('event:authorization:user-sign-out-requested');
    });
    
    
    // SCOPE EVENT HANDLERS.
    $scope.$on('event:authorization:user-sign-out-request-success', function(event, data) {
        $scope.$state.transitionTo('authorization.signin', $scope.$stateParams);
    }); 
    
    
    // SCOPE FUNCTION
    
  
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
}]);