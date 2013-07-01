'use strict';

Application.Settings.factory('$configurationFactory', ['$constant', function($constant) {

    function ConfigurationFactory() {
        var self = this;
        
        function Configuration() { }
        
        Configuration.prototype.get = function(storage, key, defaultValue) {
            var value;
            
            switch (storage) {
                case $constant.SESSION_STORAGE:
                value = store.session.get(key);
                break;
                
                case $constant.LOCAL_STORAGE:
                value = store.local.get(key);
                break;
                
                default:
                throw 'UNSUPPORTED STORAGE TYPE';
            }
            
            if (!value) { value = defaultValue; }
            
            return value;
        };
            
        Configuration.prototype.set = function(storage, key, value) {        
            switch (storage) {
                case $constant.SESSION_STORAGE:
                    store.session.set(key, value);
                    break;
                
                case $constant.LOCAL_STORAGE:
                    store.local.set(key, value);
                    break;
                
                default:
                    throw 'UNSUPPORTED STORAGE TYPE';
            }
        };
            
        Configuration.prototype.remove = function(storage, key) {
            switch (storage) {
                case $constant.SESSION_STORAGE:
                    store.session.remove(key);
                    break;
                
                case $constant.LOCAL_STORAGE:
                    store.local.remove(key);
                    break;
                
                default:
                    throw 'UNSUPPORTED STORAGE TYPE';
            }
        };
            
        
        return new Configuration();
    }
    
    return ConfigurationFactory;
}]);

Application.Settings.factory('$configuration', ['$configurationFactory', function($configurationFactory) {
    
    return $configurationFactory();    
                                              
}]);