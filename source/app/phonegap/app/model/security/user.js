Application.Model.Security.User = ObjectBase.extend({
    
    Identifier: null,
    Password: null,
    IsAuthenticated: true,
    Scopes: [],
    
    addScope: function(scopes) {
        var self = this;
        var _scopes = [];
        
        if($.isArray(scopes)) {
            _scopes = scopes;
        } else {
            _scopes = [ scopes ];
        }        
        
        Enumerable.From(_scopes)
            .ForEach(function(scope) {
                var _scope = 
                    Enumerable.From(this.Scopes)
                        .Where(function (x) { return x === scope; })
                        .FirstOrDefault();
                
                if (!_scope){
                    if (!self.Scopes) { self.Scopes = []; }
                    self.Scopes.push(scope);
                }
            });
    },
    
    removeScope: function(scope) {
        this.Scopes = 
            Enumerable.From(this.Scopes)
                .Where(function (x) { return x !== scope; })
                .ToArray();
    },
    
    hasScope: function(scopes) {
        var _scopes = [];
        
        if($.isArray(scopes)) {
            _scopes = scopes;
        } else {
            _scopes = [ scopes ];
        }
        
        var hasScope = 
            Enumerable.From(this.Scopes)
                    .Where(function (x) { return Enumerable.From(scopes).Any(function(y) { return y===x }); })
                    .Any();
        
        return hasScope;
    },
});

Application.Model.Security.User.$createGuestUser = function() {
    var guest = new Application.Model.Security.User({IsAuthenticated: false, Scopes: [ Application.Model.Security.UserScope.GUEST ]});    
    return guest;
};