'use strict';

Application.Controllers.controller('bruto.netto.parameter.extended.controller', ['$scope', function($scope){
    var self = this;
    
    $scope.$on('$stateChangeSuccess', function (event, data) {
        $scope.view.mode= 'extended';
    });
    
    $scope.$watch(function() { 
        $scope.$emit('event:application:resize-requested');
    });
    
    $scope.goToCalculate = function() {
        $scope.$state.transitionTo('brutonetto.calculation', $scope.$stateParams);
    };

}]);