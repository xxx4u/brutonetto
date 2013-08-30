Application.Controllers.controller('startup.controller', ['$scope', '$timeout', function($scope, $timeout){
    var self = this; 
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    if ($scope.APPLICATION_USER_IDENTITY.User.IsAuthenticated) {
        $scope.$state.transitionTo('brutonetto.parameter-quick', $scope.$stateParams);
    }
    else {
        $timeout(function() {
            $scope.$state.transitionTo('authorization.signin', $scope.$stateParams);
        }, 100);
    }
}]);