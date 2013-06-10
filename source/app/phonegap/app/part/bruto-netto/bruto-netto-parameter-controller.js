'use strict';

Application.Controllers.controller('bruto.netto.parameter.controller', ['$scope', function($scope){
    var self = this;
    
    $scope.$watch(function() { 
        $scope.$emit('event:application:resize-requested');
    });
    
    $scope.goToCalculate = function() {
        $scope.$state.transitionTo('brutonetto.calculation', $scope.$stateParams);
    };

}]);