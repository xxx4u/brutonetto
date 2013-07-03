Application.Controllers.controller('startup.controller', ['$scope', '$location', '$constant', function($scope, $location, $constant){
    var self = this; 
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    if ($scope.APPLICATION_USER_IDENTITY.User.IsAuthenticated) {
        $scope.$state.transitionTo('brutonetto.parameter-quick', $scope.$stateParams);
    }
    else {
        $scope.$state.transitionTo('authorization.signin', $scope.$stateParams);
    }
}]);