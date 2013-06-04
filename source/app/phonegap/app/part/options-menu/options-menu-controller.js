Application.Controllers.controller('options.menu.controller', ['$scope', '$location', '$constant', '$translate', function($scope, $location, $constant, $translate){
    var self = this;
    
    // SCOPE --------------------------------------------------------------------------------------------------------
    $scope.supportedLocales = 
        Enumerable.From($scope.getSupportedLocales())
            .Select(function(x) { return angular.extend(x, { select: function(){ self.selectLocale(this.code); } }); })
            .ToArray();
    
    
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    self.selectLocale = function(locale) {
        Enumerable.From($scope.supportedLocales)
            .ForEach(function(x) { x.isSelected = x.code === locale });
        
        $scope.$emit('event:application:change-locale-requested', locale);
    };
}]);