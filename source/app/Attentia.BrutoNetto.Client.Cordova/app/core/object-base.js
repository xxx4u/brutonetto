// Simple JavaScript Inheritance
// By John Resig http://ejohn.org/
// MIT Licensed.
//
// Inspired by base2 and Prototype.

(function() {	
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\$\bsuper\b/ : /.*/;
    
    // The base BaseObject implementation which doesn't do anything.
    ObjectBase = function() { };
    
    // Create a new BaseObject that inherits from this class.
    ObjectBase.extend = function(prop) {
        var $super = this.prototype;
        
        // Instantiate a base class (but only create the instance, don't run the init constructor).
        initializing = true;
        var prototype = new this();
        initializing = false;
        
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            
          // Check if we're overwriting an existing function
          prototype[name] = typeof prop[name] == "function" && 
            typeof $super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
              return function() {
                var tmp = this.$super;
                
                // Add a new .$super() method that is the same method but on the super-class
                this.$super = $super[name];
                
                // The method only need to be bound temporarily, so we remove it when we're done executing
                var ret = fn.apply(this, arguments);        
                this.$super = tmp;
                
                return ret;
              };
            })(name, prop[name]) :
            prop[name];
        }
    
        // The dummy class constructor
        function ObjectBase() {
            // All construction is actually done in the $INITIALIZE OR $$INITIALIZE method
            if ( !initializing && this.$initialize) {
                this.$initialize.apply(this, arguments);
            }
            else if ( !initializing && !this.$initialize){
                this.$$initialize.apply(this, arguments);
            }
        };
        
        // Populate our constructed prototype object.
        ObjectBase.prototype = prototype;
        
        // Enforce the constructor to be what we expect.
        ObjectBase.prototype.constructor = Application.Core.ObjectBase;
		
		// Prototype the $INITIALIZE method.
		ObjectBase.prototype.$$initialize = function(attributes) {
			if (attributes){
				for(var name in attributes) {
					this[name] = attributes[name];
				}
			}
		}
        
        // And make this class extendable.
        ObjectBase.extend = arguments.callee;
    
        return ObjectBase;
    };
})();

Application.Core.ObjectBase = ObjectBase.extend({ });