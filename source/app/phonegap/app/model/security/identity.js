Application.Model.Security.Identity = ObjectBase.extend({ 
//    $initialize: function(options){
//        this.$super(options);
//    },
    
    ID : null,
    Name: null,
	FirstName: null,
    Locale: null,
	AvatarUrl: null,
    
    DisplayName: function(){
        return this.FirstName + ' ' + this.Name;
	}
});

Application.Model.Security.Identity.$createGuestIdentity = function() {
    var identity = new Application.Model.Security.Identity();
    return identity;
};