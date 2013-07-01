'use strict';

Application.Controllers.controller('authorization.signup.controller', ['$scope', '$constant', '$configuration', '$translate', '$dataService', function($scope, $constant, $configuration, $translate, $dataService){
    var self = this;
    
    
    // SCOPE EVENT HANDLERS.

    
    
    // SCOPE PROPERTIES
    $scope.alerts = [];
    
    $scope.dismissAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    
    $scope.dismissAllAlerts = function() {
        $scope.alerts = [];
    };
    
    $scope.supportedLocales = 
        Enumerable.From($scope.getSupportedLocales())
            .Select(function(x) { return angular.extend(x, { select: function(){ self.selectLocale(this.code); } }); })
            .ToArray();
    
    $scope.newUser = new Application.Model.Security.UserIdentity();
    
    
    
    // SCOPE FUNCTION
    $scope.supportedLocalesRendered = function(info) {
        var locale = $configuration.get($constant.LOCAL_STORAGE, 'application.setting.locale', $constant.DEFAULT_LOCALE);
        self.selectLocale(locale);
    };
    
    $scope.doSignUp = function () {
        $scope.isBusy = true;
        $scope.dismissAllAlerts();
        $dataService.signUpUser({ onBehalfOf: $constant.ON_BEHALF_OF_CLIENT }, $scope.newUser.toDataTransferObject())
            .then(function(data) {
                $scope.isBusy = false;
                $scope.$emit('event:authorization:user-sign-up-success', data);
                
                // Try to sign in.
                $scope.$emit('event:authorization:user-access-token-requested', { 
                    username: $scope.newUser.User.Identifier, 
                    password: $scope.newUser.User.Password
                });
                
            }, function(error) {
                $scope.isBusy = false;
                $scope.$emit('event:authorization:user-sign-up-error', error);
                $scope.alerts.push({ type: 'error', message: error.Error.Message });
            });
    };
    
    $scope.goToSignIn = function() {
        $scope.$state.transitionTo('authorization.signin', $scope.$stateParams);
    };
  
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    self.selectLocale = function(locale) {
        Enumerable.From($scope.supportedLocales)
            .ForEach(function(x) { x.isSelected = x.code === locale });
        
        // Set the locale in the new user instance.
        $scope.newUser.Identity.Locale = locale;
        
        // Also emit the change to the application level.
        $scope.$emit('event:application:change-locale-requested', locale);
    };
}]);