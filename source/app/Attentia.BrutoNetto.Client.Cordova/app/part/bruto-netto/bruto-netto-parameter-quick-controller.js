'use strict';

Application.Controllers.controller('bruto.netto.parameter.quick.controller', ['$scope', function($scope){
    var self = this;
    
    $scope.$on('$stateChangeSuccess', function (event, data) {
        $scope.view.mode= 'quick';
    });
    
    $scope.$watch(function() { 
        $scope.$emit('event:application:resize-requested');
    });
    
    $scope.goToExtendedParameters = function() {
        $scope.$state.transitionTo('brutonetto.parameter-extended', $scope.$stateParams);
    };
    
    $scope.goToCalculate = function() {
        $scope.$state.transitionTo('brutonetto.calculation', $scope.$stateParams);
    };

}]);