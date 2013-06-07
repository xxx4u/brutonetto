'use strict';

Application.Controllers.controller('bruto.netto.parameter.controller', ['$scope', function($scope){
    var self = this;
    
    $scope.goToCalculate = function() {
        $scope.$state.transitionTo('brutonetto.calculation', $scope.$stateParams);
    };

}]);