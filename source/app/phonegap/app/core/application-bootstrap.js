'use strict';

// Create the module namespaces.
Application.Bootstrap = angular.module('application.bootstrap', ['application.filters', 'application.services', 'application.directives', 'application.constants', 'application.settings', 'application.controllers', 'ui.compat', 'ui', 'pascalprecht.translate', 'app.interval']);
Application.Constants = angular.module('application.constants', []);
Application.Services = angular.module('application.services', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);
Application.Providers = angular.module('application.providers', []);
Application.Settings = angular.module('application.settings', ['application.constants']);
Application.Controllers = angular.module('application.controllers', ['application.settings']);


// Register the routes.
Application.Bootstrap
    .config(['$constant', '$translateProvider', function($constant, $translateProvider){
        $translateProvider.registerLoader({
            type: 'static-files',
            prefix: 'language/locale_',
            suffix: '.json'
        });
    }])    
	.config(['$routeProvider', '$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', function($routeProvider, $urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {
        $locationProvider.html5Mode(false).hashPrefix('');
        
        // FIX: x-domain request fail. see: https://github.com/angular/angular.js/pull/1454.
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        
        $urlRouterProvider
            .when('/q?id', '/details/:id')
            .otherwise('/startup');
        
        $stateProvider
            .state('startup', {
                url: '/startup',
                abstract: false,
                templateUrl: 'part/startup/startup.html'
            })
            .state('authorization', {
                url: '/authorization',
                abstract: true,
                templateUrl: 'part/authorization/authorization.html'
            })
            .state('authorization.signup', {
                url: '/signup',
                views: {
                    'body@authorization': {
                        templateUrl: 'part/authorization/authorization-signup.html'
                  }
                }
            })
            .state('authorization.signin', {
                url: '/signin',
                views: {
                    'body@authorization': {
                        templateUrl: 'part/authorization/authorization-signin.html'
                  }
                }
            })
            .state('authorization.signout', {
                url: '/signout',
                views: {
                    'body@authorization': {
                        templateUrl: 'part/authorization/authorization-signout.html'
                  }
                }
            })
            .state('authorization.error', {
                url: '/error',
                views: {
                    'body@authorization': {
                        templateUrl: 'part/authorization/authorization-error.html'
                  }
                }
            })        
            .state('brutonetto', {
                url: '/brutonetto',
                abstract: true,
                templateUrl: 'part/bruto-netto/bruto-netto.html'
            })
            .state('brutonetto.parameter', {
                url: '/parameter',
                views: {
                    'body@brutonetto': {
                        templateUrl: 'part/bruto-netto/bruto-netto-parameter.html'
                  }
                }
            })
            .state('brutonetto.calculation', {
                url: '/calculation',
                views: {
                    'body@brutonetto': {
                        templateUrl: 'part/bruto-netto/bruto-netto-calculation.html'
                  }
                }
            })
            .state('profile', {
                url: '/profile',
                abstract: false,
                templateUrl: 'part/profile/profile.html'
            })
            ;
        
	}])
    .run(function ($rootScope, $state, $stateParams, $constant, $configuration, $translate, $logger, $oauth2Connector, $dataService) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        
        // Default locale of the application.
        var locale = $configuration.get($constant.LOCAL_STORAGE, 'application.setting.locale', $constant.DEFAULT_LOCALE);
        $translate.uses(locale);
        
        // The LOGGER service.
        $rootScope.$logger = $logger;
        
        var userIdentityJSON = $configuration.get($constant.LOCAL_STORAGE, 'application.security.profile.userIdentity', angular.toJson(Application.Model.Security.UserIdentity.$createGuestUserIdentity()));
        var userIdentity = angular.fromJson(userIdentityJSON);
        $rootScope.APPLICATION_USER_IDENTITY = new Application.Model.Security.UserIdentity(userIdentity);
        
        $rootScope.$watch('APPLICATION_USER_IDENTITY', function(newValue, oldValue) { 
            $rootScope.$broadcast('event:authorization:user-identity-changed', newValue);
        });
        
        $rootScope.$watch('APPLICATION_USER_IDENTITY.Identity.Locale', function(newValue, oldValue) { 
            $rootScope.$broadcast('event:application:change-locale-requested', newValue);
        });
        
        // SCOPE EVENT HANDLERS.
        $rootScope.$on('$stateChangeStart', function (event, next, current) {
            $.slidePage({ action: 'close' });
        }); 
        
        $rootScope.$on('event:application:change-locale-requested', function (event, locale) {
            try {
                if (locale) {
                    $configuration.set($constant.LOCAL_STORAGE, 'application.setting.locale', locale);
                    $translate.uses(locale);
                    
                    // Notify the LOCALE change.
                    $rootScope.$logger.log({level: $constant.LOG_LEVEL_INFO, message: 'event:application:change-locale-success', data: locale });
                    $rootScope.$broadcast('event:application:change-locale-success', locale);
                }
            }
            catch (error) {
                $rootScope.$logger.log({level: $constant.LOG_LEVEL_ERROR, message: 'event:application:change-locale-error', data: error });
                $rootScope.$broadcast('event:application:change-locale-error', error);
            }
        }); 
        
        // Handles the CLIENT ACCESS TOKEN REQUESTED event.
        $rootScope.$on('event:authorization:client-access-token-requested', function(event) {
            var parameters = {
                securityContext: $constant.APPLICATION_SECURITY_CONTEXT,
                authenticationEndpoint: $constant.OAUTH_APPLICATION_AUTHENTICATION_SERVER_ENDPOINT, 
                clientIdentifier: $constant.OAUTH_APPLICATION_CLIENT_CREDENTIALS.clientIdentifier,
                clientSecret: $constant.OAUTH_APPLICATION_CLIENT_CREDENTIALS.clientSecret
            };
            
            $oauth2Connector.getClientAccessToken(parameters)
                .then(function(data) {
                    // Store the security context parameters in LOCAL storage.
                    $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + parameters.securityContext + '.oauth.authenticationEndpoint', parameters.authenticationEndpoint);
                    $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + parameters.securityContext + '.oauth.clientIdentifier', parameters.clientIdentifier);
                    $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + parameters.securityContext + '.oauth.clientSecret', parameters.clientSecret);
                    $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + parameters.securityContext + '.oauth.clientAccessToken', data);
                    
                    // Notify the reception of the new USER ACCESS TOKEN.
                    $rootScope.$logger.log({level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:client-access-token-request-success', data: data});
                    $rootScope.$broadcast('event:authorization:client-access-token-request-success', data);
                }, function(error) {
                    // Okay ... something went wrong, let the world know about it.
                    $rootScope.$broadcast('event:authorization:client-access-token-request-error', error);
                });
        });
        
        
        $rootScope.$on('event:authorization:client-access-token-request-success', function(event, clientAccessToken) {
        });
        
        $rootScope.$on('event:authorization:user-identity-changed', function(event, userIdentity) {
            $configuration.set($constant.LOCAL_STORAGE, 'application.security.profile.userIdentity', angular.toJson(userIdentity));
        });
        
        // Handles the USER ACCESS TOKEN REQUESTED event.
        $rootScope.$on('event:authorization:user-access-token-requested', function(event, credentials) {
            var parameters = {
                securityContext: $constant.APPLICATION_SECURITY_CONTEXT,
                authenticationEndpoint: $constant.OAUTH_APPLICATION_AUTHENTICATION_SERVER_ENDPOINT, 
                clientIdentifier: $constant.OAUTH_APPLICATION_CLIENT_CREDENTIALS.clientIdentifier,
                clientSecret: $constant.OAUTH_APPLICATION_CLIENT_CREDENTIALS.clientSecret,
                username: credentials.username,
                password: credentials.password
            };
            
            $oauth2Connector.exchangeUserCredentialForAccessToken(parameters)
                .then(function(data) {
                    // Store the security context parameters in LOCAL storage.
                    $configuration.set($constant.LOCAL_STORAGE, 'application.security.context.' + parameters.securityContext + '.oauth.userAccessToken', data);
                    
                    // Split the received SCOPES and add these to the USER instance.
                    var scopes = data.scope.split(' ');
                    $rootScope.APPLICATION_USER_IDENTITY.User = new Application.Model.Security.User({IsAuthenticated : true, Scopes: scopes});
                    
                    // Notify the reception of the new USER ACCESS TOKEN.
                    $rootScope.$logger.log({level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:user-access-token-request-success', data: data});
                    $rootScope.$broadcast('event:authorization:user-access-token-request-success', data);
                    
                    // Get the user profile of the current application user.
                    $dataService.getUserIdentity({ onBehalfOf: $constant.ON_BEHALF_OF_USER })
                        .then(function(data) {
                            $rootScope.APPLICATION_USER_IDENTITY.Identity = new Application.Model.Security.Identity(data.Result.Identity);
                            
                            $rootScope.$logger.log({level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:user-profile-retrieve-success', data: data });
                            $rootScope.$broadcast('event:authorization:user-identity-changed', $rootScope.APPLICATION_USER_IDENTITY);
                            $rootScope.$broadcast('event:authorization:user-profile-retrieve-success', data);
                        }, function(error) {
                            // There was an error while retrieving the user profile.
                            // We will try to sign out of the application.
                            $rootScope.$logger.log({level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:user-identity-retrieve-error', data: error });
                            $rootScope.$broadcast('event:authorization:user-identity-retrieve-error', error);
                            $rootScope.$broadcast('event:authorization:sign-out-requested', error);
                        });
                }, function(error) {
                    // Okay ... something went wrong, let the world know about it.
                    $rootScope.$logger.log({level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:user-access-token-request-error', data: error });
                    $rootScope.$broadcast('event:authorization:user-access-token-request-error', error);
                });
        });
        
        $rootScope.$on('event:authorization:user-sign-out-requested', function(event) {
            try {
                var parameters = {
                    securityContext: $constant.APPLICATION_SECURITY_CONTEXT
                };
                
                // Store the security context parameters in LOCAL storage.
                $configuration.remove($constant.LOCAL_STORAGE, 'application.security.context.' + parameters.securityContext + '.oauth.userAccessToken');
                
                // Reset the application user to a GUEST profile.
                $rootScope.APPLICATION_USER_IDENTITY = Application.Model.Security.UserIdentity.$createGuestUserIdentity();
                
                $rootScope.$logger.log({level: $constant.LOG_LEVEL_INFO, message: 'event:authorization:user-sign-out-request-success' });
                $rootScope.$broadcast('event:authorization:user-sign-out-request-success');
            }
            catch (error) {
                $rootScope.$logger.log({level: $constant.LOG_LEVEL_ERROR, message: 'event:authorization:user-sign-out-request-error', data: error });
                $rootScope.$broadcast('event:authorization:user-sign-out-request-error', error);
            }
        });
        
        $rootScope.getSupportedLocales = function() {
            var locales = [{
                code: "en_US", 
                description: "English", 
                isSelected: true, 
                select: function() { self.selectLocale(this.code); } 
            }, { 
                code: "nl_BE", 
                description: "Nederlands", 
                isSelected: false, 
                select: function() { self.selectLocale(this.code); } 
            }];
            
            return locales;
        };
        
        $rootScope.$emit('event:authorization:client-access-token-requested');
        
    });
