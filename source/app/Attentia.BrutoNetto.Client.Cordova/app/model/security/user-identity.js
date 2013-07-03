Application.Model.Security.UserIdentity = ObjectBase.extend({
    $initialize: function(options) {
        var test = this.$super;
        
        if (options) {
            if (options.User) { this.User = new Application.Model.Security.User(options.User); }        
            if (options.Identity) { this.Identity = new Application.Model.Security.Identity(options.Identity); }
        }        
    },
    
    ID : null,
    User: new Application.Model.Security.User(),
	Identity: new Application.Model.Security.Identity(),
    
    toDataTransferObject: function() {
        return { User: this.User, Identity: this.Identity };
    },    
});

Application.Model.Security.UserIdentity.$createGuestUserIdentity = function() {
    var userIdentity = new Application.Model.Security.UserIdentity();
    
    // Create the GUEST user profile.
    userIdentity.User = Application.Model.Security.User.$createGuestUser();
    userIdentity.Identity = Application.Model.Security.Identity.$createGuestIdentity();
    
    return userIdentity;
};