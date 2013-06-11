'use strict';

Application.Controllers.controller('bruto.netto.controller', ['$scope', '$constant', '$translate', '$dataService', function($scope, $constant, $translate, $dataService){
    var self = this;
    
    $scope.brutoNettoModel = new Application.Model.BrutoNetto.BrutoNettoModel();
    
    $scope.view = { mode: 'quick' };
    
    $scope.renderDone = function() {
        $scope.$emit('event:application:resize-requested');
    };
}]);