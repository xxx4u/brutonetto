'use strict';

Application.Controllers.controller('authorization.signin.controller', ['$scope', '$constant', '$configuration', '$translate', function($scope, $constant, $configuration, $translate){
    var self = this;
    
    
    // SCOPE EVENT HANDLERS.    
    $scope.$on('event:authorization:user-access-token-request-error', function(event, error) {
        $scope.isBusy = false;
        $scope.alerts.push({ type: 'error', message: error.error_description || error.Error.Message });
    });
    
    
    
    // SCOPE PROPERTIES
    $scope.alerts = [];
    
    $scope.dismissAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
    $scope.dismissAllAlerts = function() {
        $scope.alerts = [];
    };
    
    $scope.userIdentifier = null;
    $scope.password = null;
    
    
    
    // SCOPE FUNCTION
    $scope.doSignIn = function () {
        $scope.isBusy = true;
        $scope.dismissAllAlerts();
        
        $scope.$emit('event:authorization:client-access-token-requested');
        
        $scope.$emit('event:authorization:user-access-token-requested', { 
            username: $scope.userIdentifier, 
            password: $scope.password
        });
    };
    
    $scope.goToSignUp = function() {
        $scope.$state.transitionTo('authorization.signup', $scope.$stateParams);
    };
    
  
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
}]);