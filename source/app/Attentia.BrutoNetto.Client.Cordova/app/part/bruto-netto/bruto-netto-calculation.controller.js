'use strict';

Application.Controllers.controller('bruto.netto.calculation.controller', ['$scope', '$constant', '$translate', '$dataService', '$interval', '$document', function($scope, $constant, $translate, $dataService, $interval, $document){
    var self = this;
    
    $scope.$on('$stateChangeSuccess', function (event, data) {
        // Start the calculation.
        $scope.calculate();
    });
    
    $scope.$watch('progress', function(newValue, oldValue) {
        $scope.progressBarStyle = { width: + $scope.progress + "%" };
    });
    
    $scope.progress = 0;
    $scope.test = 0;
    
    $scope.calculate = function() {
        var dto = $scope.brutoNettoModel.toDataTransferObject();
        
        var parameters = angular.toJson(dto);
        var job = self.enableProgressNotification($scope);
        
        $dataService.calculateBrutoNetto({ onBehalfOf: $constant.ON_BEHALF_OF_USER }, { parameters: parameters })
            .then(function(data) {
                self.disableProgressNotification(job, $scope);
                var result = angular.fromJson(data.Result);
                $scope.brutoNettoModel.Calculation = angular.extend({}, { Bruto: Number(result.Bruto).toFixed(2), Netto: Number(result.Netto).toFixed(2) });                
            }, function(error) {
                self.disableProgressNotification(job, $scope);
                $scope.$state.transitionTo('brutonetto.error', $scope.$stateParams);
            }); 
    };
    
    $scope.goToParameters = function() {
        $scope.brutoNettoModel.Calculation = angular.extend({}, { Bruto: null, Netto: null });
        $scope.$state.transitionTo('brutonetto.parameter-' + $scope.view.mode, $scope.$stateParams);
    };
    
    self.enableProgressNotification = function($scope) {
        $scope.progress = 0;
        var job = $interval(function() {
            $scope.progress = $scope.progress + 1;
        }, 300, 100, true).stop();
        
        setTimeout(function() {
            if (!$scope.brutoNettoModel.Calculation.Bruto && !$scope.brutoNettoModel.Calculation.Netto) {
                job.start();
            };
        }, 500);
        
        return job;
    };
    
    self.disableProgressNotification = function(job, $scope) {
        job.stop();
        $scope.progress = 0;
        
        return job;
    };
}]);