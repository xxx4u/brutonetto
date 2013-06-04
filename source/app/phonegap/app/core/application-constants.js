'use strict';

Application.Constants.constant('$constant', {
    
    DEFAULT_LOCALE: 'en_US',
    
    RESOURCE_ENDPOINT : 'http://localhost:53898/api/1.0/resource/',
    DATA_SERVICE_ENDPOINT : 'http://localhost:53898/api/1.0/data/',
    
    LOCAL_STORAGE: 'LOCAL',
    SESSION_STORAGE: 'SESSION',
    
    APPLICATION_SECURITY_CONTEXT: 'APPLICATION',
    
    OAUTH_APPLICATION_AUTHENTICATION_SERVER_ENDPOINT : 'http://localhost:53898/oauth2/authorization/',
    OAUTH_APPLICATION_CLIENT_CREDENTIALS: { clientIdentifier: 'DEMO-APPLICATION', clientSecret: 'DEMO-APPLICATION-SECRET'},
    OAUTH_APPLICATION_CLIENT_SCOPE: 'demo-client-scope',
    
    OAUTH_APPLICATION_USER_SCOPE: 'demo-user-scope',
    
    ON_BEHALF_OF_CLIENT: 'CLIENT',
    ON_BEHALF_OF_USER: 'USER',
    
    LOG_LEVEL_OFF: 'OFF', 
    LOG_LEVEL_ALL: '00.ALL',
    LOG_LEVEL_FATAL: '10.FATAL', 
    LOG_LEVEL_ERROR: '20.ERROR',
    LOG_LEVEL_WARN: '30.WARN',
    LOG_LEVEL_INFO: '40.INFO',
    LOG_LEVEL_DEBUG: '50.DEBUG',
    
    DEFAULT_LOG_LEVEL: '20.ERROR',
    DEFAULT_LOGGER_STRATEGY: 'ConsoleLoggerStrategy'
    
});