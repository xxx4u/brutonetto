'use strict';

Application.Controllers.controller('bruto.netto.calculation.controller', ['$scope', function($scope){
    var self = this;
    
    $scope.goToParameters = function() {
        $scope.$state.transitionTo('brutonetto.parameter', $scope.$stateParams);
    };

}]);