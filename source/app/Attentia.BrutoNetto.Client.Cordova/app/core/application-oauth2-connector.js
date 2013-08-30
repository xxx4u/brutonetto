'use strict';

Application.Services.factory('$oauth2ConnectorFactory', ['$rootScope', '$configuration', '$constant', '$logger', '$http', '$q', '$base64', function($scope, $configuration, $constant, $logger, $http, $q, $base64 ) {

    function OAuth2ConnectorFactory() {
        var self = this;
        
        /** 
         *  Creates a OAuth2 service connector. 
         *  The connector allows to exchange and refresh client and user access token. 
         *  It wraps HTTP request and uses an retry mechanism in case an access token is expired and needs to be refreshed.
         */
        function  OAuth2Connector() {
            var self = this;
            
            // Create a queue to hold the request invoked with an access token which turned out to be expired.
            self.requestRetryQueue = [];
            
            // Register all interesting events for logging.
            $scope.$on('event:authorization:access-token-expired', function() {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:access-token-expired'});
            });
            
            $scope.$on('event:authorization:access-token-refresh-success', function(event, data) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:access-token-refresh-success', data: data });
            });
            
            $scope.$on('event:authorization:access-token-refresh-error', function(event, error) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:access-token-refresh-error', data: error });
            }); 
            
            $scope.$on('event:oauth2-connector:http-get-success', function(event, data) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_DEBUG, message: 'event:oauth2-connector:http-get-success', data: data });
            }); 
            
            $scope.$on('event:oauth2-connector:http-get-error', function(event, error) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:oauth2-connector:http-get-error', data: error });
            }); 
            
            $scope.$on('event:oauth2-connector:http-post-success', function(event, data) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_DEBUG, message: 'event:oauth2-connector:http-post-success', data: data });
            }); 
            
            $scope.$on('event:oauth2-connector:http-post-error', function(event, error) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:oauth2-connector:http-post-error', data: error });
            }); 
            
            $scope.$on('event:oauth2-connector:request-retry-success', function(event, data) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_INFO, message: 'event:oauth2-connector:request-retry-success', data: data });
            }); 
            
            $scope.$on('event:oauth2-connector:request-retry-error', function(event, error) {
                $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:oauth2-connector:request-retry-error', data: error });
            });                 
        }
    
        OAuth2Connector.prototype.getClientAccessToken = function (parameters) {
            var self = this;
            
            var deferred = $q.defer();
            
            // Merge parameters with default configuration.
            var settings = angular.extend({ authenticationEndpoint: null, clientIdentifier: null, clientSecret: null, scope: null, grantType: 'client_credentials' }, parameters);
            
            // Use HTTP basic authentication for this request.
            var encoded = $base64.encode(settings.clientIdentifier + ':' + settings.clientSecret);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            
            // HTTP post.
            $http.post(
                settings.authenticationEndpoint,
                
                // DATA
                { 
                    scope: settings.scope, 
                    grant_type: settings.grantType 
                },
                
                // CONFIG
                { 
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, 
                    transformRequest: self.transformToRequestParameters 
                })
                .success(function(data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {                 
                    deferred.reject(data);
                });

            return deferred.promise;                        
        };
        
        OAuth2Connector.prototype.exchangeUserCredentialForAccessToken = function (parameters) {
            var self = this;
            
            var deferred = $q.defer();
            
            // Merge parameters with default configuration.
            var settings = angular.extend({ authenticationEndpoint: null, clientIdentifier: '', clientSecret: '', username: '', password: '', scope: '', grantType: 'password' }, parameters);
            
            // Use HTTP basic authentication for this request.
            var encoded = $base64.encode(settings.clientIdentifier + ':' + settings.clientSecret);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            
            // HTTP post.
            $http.post(
                settings.authenticationEndpoint,
                
                // DATA
                { 
                    username: settings.username,
                    password: settings.password,
                    scope: settings.scope, 
                    grant_type: settings.grantType 
                },
                
                // CONFIG
                { 
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, 
                    transformRequest: self.transformToRequestParameters 
                })
                .success(function(data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {                    
                    deferred.reject(data);
                });

            return deferred.promise;                        
        };
        
        OAuth2Connector.prototype.refreshUserAccessToken = function (parameters) {
            var self = this;
            
            var deferred = $q.defer();
            
            // Merge parameters with default configuration.
            var settings = angular.extend({ authenticationEndpoint: null, clientIdentifier: '', clientSecret: '', accessToken: '', grant_type: 'refresh_token' }, parameters);
            
            // Use HTTP basic authentication for this request.
            var encoded = $base64.encode(settings.clientIdentifier + ':' + settings.clientSecret);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            
            // HTTP post.
            $http.post(
                settings.authenticationEndpoint,
                
                // DATA
                {
                    grant_type: settings.grant_type,
                    refresh_token: settings.accessToken.refresh_token
                },
                
                // CONFIG
                { 
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, 
                    transformRequest: self.transformToRequestParameters 
                })
                .success(function(data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {                    
                    deferred.reject(data);
                });

            return deferred.promise;                        
        };
        
        OAuth2Connector.prototype.handleUnauthorizedRequest = function(request) {
            var self = this;

            var credentials = {};

            // Store the request in a queue.
            self.requestRetryQueue.push(request);        
            
            if (request.settings.onBehalfOf === $constant.ON_BEHALF_OF_USER) {
                // Build the credentials to refresh the oauth2 access token.
                credentials = {
                    authenticationEndpoint: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.authenticationEndpoint'), 
                    clientIdentifier: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.clientIdentifier'), 
                    clientSecret: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.clientSecret'), 
                    accessToken: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.userAccessToken') 
                };
                
                self.refreshUserAccessToken(credentials)
                    .then(function(data) {
                        // Store the refreshed oauth2 access token.
                        $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.userAccessToken', data);
                        $scope.$emit('event:authorization:user-access-token-refresh-success', data);
                        
                        // Take the request with the SECURITY CONTEXT of the intercepted failed request.
                        var requestsToRetry = 
                            Enumerable.From(self.requestRetryQueue)
                                .Where(function (x) { return x.settings.securityContext === request.settings.securityContext && x.settings.onBehalfOf === $constant.ON_BEHALF_OF_USER; })
                                .ToArray();
                        
                        // Retry the selected requests from the queue.
                        angular.forEach(requestsToRetry, function(_request, index) {
                            self.retryRequest(_request);
                        });
                        
                        // Reset the request retry queue.
                        self.requestRetryQueue =
                            Enumerable.From(self.requestRetryQueue)
                                .Where(function (x) { return x.settings.securityContext !== request.settings.securityContext && x.settings.onBehalfOf !== $constant.ON_BEHALF_OF_USER; })
                                .ToArray();
                        
                    }, function(error, status, headers, config) {
                        $scope.$emit('event:authorization:user-access-token-refresh-error', error);
                    });
            }
            else if (request.settings.onBehalfOf === $constant.ON_BEHALF_OF_CLIENT) {
                // Build the credentials to refresh the oauth2 access token.
                credentials = {
                    authenticationEndpoint: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.authenticationEndpoint'), 
                    clientIdentifier: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.clientIdentifier'), 
                    clientSecret: $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.clientSecret')
                };
                
                self.getClientAccessToken(credentials)
                    .then(function(data) {
                        // Store the refreshed oauth2 access token.
                        $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + request.settings.securityContext + '.oauth.clientAccessToken', data);
                        $scope.$emit('event:authorization:client-access-token-request-success', data);
                        
                        // Take the request with the SECURITY CONTEXT of the intercepted failed request.
                        var requestsToRetry = 
                            Enumerable.From(self.requestRetryQueue)
                                .Where(function (x) { return x.settings.securityContext === request.settings.securityContext && x.settings.onBehalfOf === $constant.ON_BEHALF_OF_CLIENT; })
                                .ToArray();
                        
                        // Retry the selected requests from the queue.
                        angular.forEach(requestsToRetry, function(_request, index) {
                            self.retryRequest(_request);
                        });
                        
                        // Reset the request retry queue.
                        self.requestRetryQueue =
                            Enumerable.From(self.requestRetryQueue)
                                .Where(function (x) { return x.settings.securityContext !== request.settings.securityContext && x.settings.onBehalfOf !== $constant.ON_BEHALF_OF_CLIENT; })
                                .ToArray();
                        
                    }, function(error, status, headers, config) {
                        $scope.$emit('event:authorization:client-access-token-request-error', error);
                    });                
            }
            else {
                throw 'UNSUPPORTED REQUEST RETRY';
            }
        };
        
        OAuth2Connector.prototype.retryRequest = function(request) {
            var self = this;
            
            // Add the client or user access token to the HTTP AUTHORIZATION header.
            self.setAuthorizationHeader(request.settings);
            
            $http(request.config)
                .success(function(data) {
                    $scope.$emit('event:oauth2-connector:request-retry-success', data);
                    
                    // Resolve the original promise object.
                    request.deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    var error = { data: data, status: status, header: headers(), config: angular.toJson(config) };
                    $scope.$emit('event:oauth2-connector:request-retry-error', error);
                    
                    // Reject the original promise object.
                    request.deferred.reject(data);
                });
        };
        
        OAuth2Connector.prototype.get = function (parameters) {
            var self = this;
            
            var settings = angular.extend({ securityContext: null, serviceName: null, serviceEndpoint: null, onBehalfOf: null }, parameters);
            
            // Ensure required parameters are provided.
            if (!settings.securityContext) { throw 'SECURITY CONTEXT PARAMETER CANNOT BE EMPTY' }
            if (!settings.serviceEndpoint) { throw 'SERVICE ENDPOINT PARAMETER CANNOT BE EMPTY' }
            
            // Add the client or user access token to the HTTP AUTHORIZATION header.
            self.setAuthorizationHeader(settings);
            
            // Invoke the service request.
            var deferred = $q.defer();
            $http.get(settings.serviceEndpoint)
                .success(function(data) {
                    $scope.$emit('event:oauth2-connector:http-get-success', data);
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    if (status == 401) {
                        var request = { settings: settings, deferred: deferred, config: config };
                        $scope.$emit('event:authorization:access-token-expired', request);
                        
                        // Handle the failed request, 
                        // in this case of 401 the request will be retried after refreshing the token.
                        self.handleUnauthorizedRequest(request);
                    }
                    else {
                        var error = { data: data, status: status, header: headers(), config: angular.toJson(config) };
                        $scope.$emit('event:oauth2-connector:http-get-error', error);
                        deferred.reject(data);
                    }
                });

            return deferred.promise;
        };
        
        OAuth2Connector.prototype.post = function (parameters, data) {
            var self = this;
            
            var settings = angular.extend({ securityContext: null, serviceName: null, serviceEndpoint: null, onBehalfOf: null }, parameters);
            
            // Ensure required parameters are provided.
            if (!settings.securityContext) { throw 'SECURITY CONTEXT PARAMETER CANNOT BE EMPTY' }
            if (!settings.serviceEndpoint) { throw 'SERVICE ENDPOINT PARAMETER CANNOT BE EMPTY' }
            
            // Add the client or user access token to the HTTP AUTHORIZATION header.
            self.setAuthorizationHeader(settings);
            
            // Invoke the service request.
            var deferred = $q.defer();
            $http.post(settings.serviceEndpoint, data)
                .success(function(data) {
                    $scope.$logger.log({level: $constant.LOG_LEVEL_DEBUG, message: 'event:oauth2-connector:http-post-success', data: data});
                    
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    if (status == 401) {
                        var request = { settings: settings, deferred: deferred, config: config };
                        $scope.$emit('event:authorization:access-token-expired', request);
                        
                        // Handle the failed request, 
                        // in this case of 401 the request will be retried after refreshing the token.                        
                        self.handleUnauthorizedRequest(request);
                    }
                    else {
                        var error = { data: data, status: status, header: headers(), config: angular.toJson(config) };
                        $scope.$emit('event:oauth2-connector:http-post-error', error);
                        
                        deferred.reject(data);
                    }
                });

            return deferred.promise;
        };
        
        OAuth2Connector.prototype.setAuthorizationHeader = function(settings) {
            // Retrieve the oauth2 access token if the service is invoked on behalf of the client application or the user.
            var accessToken = null;
            switch (settings.onBehalfOf) {
                case $constant.ON_BEHALF_OF_CLIENT:
                    accessToken = $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + settings.securityContext + '.oauth.clientAccessToken');
                    break;
                    
                case $constant.ON_BEHALF_OF_USER:
                    accessToken = $configuration.get($constant.LOCAL_STORAGE, 'application.security.context.' + settings.securityContext + '.oauth.userAccessToken');
                    break;
            }
            
            if (accessToken && accessToken.access_token) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken.access_token;
            }
            else {
                $http.defaults.headers.common.Authorization = null;
                var error = 'NO LONGER AUTHENTICATED FOR THE SECURITY CONTEXT (' + settings.securityContext + ')';
                throw error;
            }
        };
        
        OAuth2Connector.prototype.transformToRequestParameters = function (data) {
            // Use jQuery param function to get a form encoded representation of the data parameters.
            // Should this be changed to a private implementation to avoid dependency op jQuery ?
            return $.param(data);
        };
        
        return new OAuth2Connector();
    }
    
    return OAuth2ConnectorFactory;
}]);

Application.Services.factory('$oauth2Connector', ['$oauth2ConnectorFactory', function($oauth2ConnectorFactory) {
    return $oauth2ConnectorFactory();
}]);