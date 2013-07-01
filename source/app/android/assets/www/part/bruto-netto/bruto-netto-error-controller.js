'use strict';

Application.Controllers.controller('bruto.netto.error.controller', ['$scope', function($scope){
    var self = this;
    
    $scope.goToParameters = function() {
        $scope.brutoNettoModel.Calculation = angular.extend({}, { Bruto: null, Netto: null });
        $scope.$state.transitionTo('brutonetto.parameter-' + $scope.view.mode, $scope.$stateParams);
    };
    
}]);