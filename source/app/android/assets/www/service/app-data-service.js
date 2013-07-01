'use strict';

Application.Services.factory('$dataServiceProvider', ['$http', '$q', '$oauth2Connector', function($http, $q, $oauth2Connector) {

    function DataServiceProvider(parameters) {
        
        function DataService(parameters) {
            var self = this;
            
            self.settings = angular.extend({ securityContext: null, serviceName: null, serviceEndpoint: null }, parameters);
        }
        
        DataService.prototype.signUpUser = function (parameters, data) {
            var self = this;
            
            // Build the service endpoint.
            var serviceEndpoint = self.settings.serviceEndpoint + 'signUpUser';
            var settings = { securityContext: self.settings.securityContext, serviceName: self.settings.serviceName, serviceEndpoint: serviceEndpoint, onBehalfOf: parameters.onBehalfOf };
            var promise = $oauth2Connector.post(settings, data);
            
            return promise;
        };
        
        DataService.prototype.getUserIdentity = function (parameters) {
            var self = this;
            
            // Build the service endpoint.
            var serviceEndpoint = self.settings.serviceEndpoint + 'getUserIdentity';
            var settings = { securityContext: self.settings.securityContext, serviceName: self.settings.serviceName, serviceEndpoint: serviceEndpoint, onBehalfOf: parameters.onBehalfOf };
            var promise = $oauth2Connector.get(settings);

            return promise;                     
        };
        
        DataService.prototype.calculateBrutoNetto = function (parameters, data) {
            var self = this;
            
            // Build the service endpoint.
            var serviceEndpoint = self.settings.serviceEndpoint + 'calculateBrutoNetto';
            var settings = { securityContext: self.settings.securityContext, serviceName: self.settings.serviceName, serviceEndpoint: serviceEndpoint, onBehalfOf: parameters.onBehalfOf };
            var promise = $oauth2Connector.post(settings, data);
            
            return promise;
        };
        
        return new DataService(parameters);
    }
    
    return DataServiceProvider;
}]);

Application.Services.factory('$dataService', ['$dataServiceProvider', '$constant', function($dataServiceProvider, $constant) {
    return $dataServiceProvider({ securityContext: $constant.APPLICATION_SECURITY_CONTEXT, serviceName: 'DATA_SERVICE', serviceEndpoint: $constant.DATA_SERVICE_ENDPOINT });
}]);