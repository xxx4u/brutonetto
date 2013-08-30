Application.Controllers.controller('navigation.controller', ['$scope', '$location', '$constant', function($scope, $location, $constant){
    var self = this;  
    
    // SCOPE PROPERTIES
    $scope.navigationMenu = [
        { groupName: null, items: [
            { id: 'SIGN_IN_MENU_ITEM', icon: 'media/images/icons/dark/appbar.door.enter.png', routeMatch: 'authorization[a-z/]*', route: 'authorization/signin', scopes: [Application.Model.Security.UserScope.GUEST], caption: 'APPLICATION.PART.NAVIGATION.SIGN_IN_MENU_ITEM', select: function () { $location.path(this.route); } }
        ]},
        
        { groupName: null, items: [
            { id: 'BRUTO_NETTO_MENU_ITEM', icon: 'media/images/icons/dark/appbar.currency.euro.png', routeMatch: 'brutonetto[a-z/]*', route: 'brutonetto/parameter', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.BRUTONETTO_MENU_ITEM', select: function () { $location.path(this.route); } }
        ]},
        
        { groupName: ' ', items: [
            { id: 'PROFILE_MENU_ITEM', icon: 'media/images/icons/dark/appbar.user.png', routeMatch: 'profile[a-z/]*', route: 'profile', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.PROFILE_MENU_ITEM', select: function () { $location.path(this.route); } },
            { id: 'DEBUG_MENU_ITEM', icon: 'media/images/icons/dark/appbar.radioactive.png', routeMatch: 'debug[a-z/]*', route: 'debug', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.DEBUG_MENU_ITEM', select: function () { $location.path(this.route); } },
            { id: 'SIGN_OUT_MENU_ITEM', icon: 'media/images/icons/dark/appbar.door.leave.png', routeMatch: 'authorization[a-z/]*', route: 'authorization/signout', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.SIGN_OUT_MENU_ITEM', select: function () { $location.path(this.route); } }
        ]}
    ];
    
    
    // SCOPE BEHAVIOUR
    $scope.hasScope = function(scopes) {    
        var hasScope = $scope.APPLICATION_USER_IDENTITY.User.hasScope(scopes);
        return hasScope;
    };
    
}]);