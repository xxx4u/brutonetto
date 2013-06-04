'use strict';

Application.Controllers.controller('authorization.signout.controller', ['$scope', '$constant', '$configuration', function($scope, $constant, $configuration){
    var self = this;
    
    
    // SCOPE EVENT HANDLERS.
    $scope.$on('event:authorization:user-sign-out-request-success', function(event, data) {
        $scope.$state.transitionTo('authorization.signin', $scope.$stateParams);
    });
    
    
    
    // SCOPE FUNCTION
    
    // Emit SIGN OUT REQUEST event on load of the controller.
    $scope.$emit('event:authorization:user-sign-out-requested');
    
  
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
}]);