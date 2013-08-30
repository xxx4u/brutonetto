'use strict';

Application.Controllers.controller('authorization.controller', ['$scope', '$constant', '$configuration', '$location', function($scope, $constant, $configuration, $location){
    var self = this;
    
    // SCOPE EVENT HANDLERS.    
    $scope.$on('event:authorization:user-access-token-request-success', function(event, userAccessToken) {        
        $location.path('').search({}).hash('');
    });
    
    $scope.$on('event:authorization:client-access-token-request-error', function(event, error) {
        $scope.$state.transitionTo('authorization.error', error);
    });
    
    $scope.$on('event:authorization:user-access-token-request-error', function(event, error) {
        //$scope.$state.transitionTo('authorization.error', error);
        $scope.isBusy = false;
    });
    
    $scope.$on('event:authorization:sign-out-request-error', function(event, error) {
        $scope.$state.transitionTo('authorization.error', error);
    });
    
    $scope.$on('event:authorization:user-identity-retrieve-error', function(event, error) {
        $scope.$state.transitionTo('authorization.error', error);
    });
    
    
    
    // SCOPE PROPERTIES
    $scope.isBusy = false;
    
    
  
    // CONTROLLER --------------------------------------------------------------------------------------------------------
}]);