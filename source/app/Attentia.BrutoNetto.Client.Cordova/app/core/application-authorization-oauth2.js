'use strict';

Application.Authorization = Application.Authorization || {};
Application.Authorization.Strategy = Application.Authorization.Strategy || {};

Application.Authorization.Strategy.OAuth2AuthorizationStrategy = function($constant, $base64) {

    function OAuth2AuthorizationStrategy() {
        var self = this;

        // Create a queue to hold the request invoked with an access token which turned out to be expired.
        self.requestRetryQueue = [];

        // Register all interesting events for logging.
        $scope.$on('event:authorization:access-token-expired', function() {
            $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:access-token-expired' });
        });

        $scope.$on('event:authorization:access-token-refresh-success', function(event, data) {
            $scope.$logger.log({ level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:access-token-refresh-success', data: data });
        });

        $scope.$on('event:authorization:access-token-refresh-error', function(event, error) {
            $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:access-token-refresh-error', data: error });
        });
    }

    OAuth2AuthorizationStrategy.prototype.getClientAccessToken = function(parameters) {
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
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

    OAuth2AuthorizationStrategy.prototype.exchangeUserCredentialForAccessToken = function(parameters) {
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
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

    OAuth2AuthorizationStrategy.prototype.refreshUserAccessToken = function(parameters) {
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
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

    return new OAuth2AuthorizationStrategy();
};

Application.Services.factory('$authorization', ['$rootScope', '$configuration', '$constant', '$logger', '$http', '$q', '$base64', function($scope, $configuration, $constant, $logger, $http, $q, $base64) {

    function OAuth2Connector() {
        var self = this;

        // Create a queue to hold the request invoked with an access token which turned out to be expired.
        self.requestRetryQueue = [];

        // Register all interesting events for logging.
        $scope.$on('event:authorization:access-token-expired', function() {
            $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:access-token-expired' });
        });

        $scope.$on('event:authorization:access-token-refresh-success', function(event, data) {
            $scope.$logger.log({ level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:access-token-refresh-success', data: data });
        });

        $scope.$on('event:authorization:access-token-refresh-error', function(event, error) {
            $scope.$logger.log({ level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:access-token-refresh-error', data: error });
        });
    }

    OAuth2Connector.prototype.getClientAccessToken = function(parameters) {
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
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

    OAuth2Connector.prototype.exchangeUserCredentialForAccessToken = function(parameters) {
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
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

    OAuth2Connector.prototype.refreshUserAccessToken = function(parameters) {
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
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


    return new OAuth2Connector();
}]);