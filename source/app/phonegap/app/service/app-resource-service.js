'use strict';

Application.Services.factory('$resourceServiceProvider', ['$http', '$q', '$oauth2Connector', function($http, $q, $oauth2Connector) {

    function ResourceServiceProvider(clientIdentifier, clientSecret, endpoint) {
        
        function ResourceService(parameters) {
            var self = this;
            
            self.settings = angular.extend({ serviceName: null, serviceEndpoint: null }, parameters);
        }
        
        ResourceService.prototype.get = function (parameters) {
            var self = this;
            
            // Build the resource endpoint.
            var resourceEndpoint = self.settings.serviceEndpoint + parameters.resource + (parameters.id ? '/' + parameters.id : '');
            var promise = $oauth2Connector.get({ securityContext: self.settings.securityContext, serviceName: self.settings.serviceName, serviceEndpoint: resourceEndpoint, onBehalfOf: parameters.onBehalfOf });

            return promise;                     
        };
        
        return new ResourceService(clientIdentifier, clientSecret, endpoint);
    }
    
    return ResourceServiceProvider;
}]);

Application.Services.factory('$resourceService', ['$resourceServiceProvider', '$constant', function($resourceServiceProvider, $constant) {
    return $resourceServiceProvider({ securityContext: $constant.APPLICATION_SECURITY_CONTEXT, serviceName: 'RESOURCES', serviceEndpoint: 'http://localhost:53898/api/1.0/resource/' });
}]);