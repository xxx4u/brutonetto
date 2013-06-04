Application.Controllers.controller('navigation.controller', ['$scope', '$location', '$constant', '$translate', function($scope, $location, $constant, $translate){
    var self = this;
    
    
    
    // SCOPE EVENT HANDLERS.
    $scope.$on("$stateChangeSuccess", function (event, next, current) {
        $scope.$logger.log({level: $constant.LOG_LEVEL_DEBUG, message: '$stateChangeSuccess', data: next });
    });    
    
    
    
    // SCOPE PROPERTIES
    $scope.navigationMenu = [
        { groupName: null, items: [
            { id: 'SIGN_IN_MENU_ITEM', icon: 'media/images/icons/dark/appbar.door.enter.png', routeMatch: 'authorization/[a-z]*', route: 'authorization/signin', scopes: [Application.Model.Security.UserScope.GUEST], caption: 'APPLICATION.PART.NAVIGATION.SIGN_IN_MENU_ITEM', select: function() { self.goToRoute(this.route); } }
        ]},
        
        { groupName: null, items: [
            { id: 'BRUTO_NETTO_MENU_ITEM', icon: 'media/images/icons/dark/appbar.currency.euro.png', routeMatch: 'brutonetto/parameter', route: 'brutonetto/parameter', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.BRUTONETTO_MENU_ITEM', select: function() { self.goToRoute(this.route); } }
        ]},
        
        { groupName: 'Account', items: [
            { id: 'PROFILE_MENU_ITEM', icon: 'media/images/icons/dark/appbar.list.png', routeMatch: 'profile', route: 'profile', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.PROFILE_MENU_ITEM', select: function() { self.goToRoute(this.route); } },
            { id: 'SIGN_OUT_MENU_ITEM', icon: 'media/images/icons/dark/appbar.door.leave.png', routeMatch: 'authorization/[a-z]*', route: 'authorization/signout', scopes: [Application.Model.Security.UserScope.USER, Application.Model.Security.UserScope.ADMINISTRATOR], caption: 'APPLICATION.PART.NAVIGATION.SIGN_OUT_MENU_ITEM', select: function() { self.goToRoute(this.route); } }
        ]}
    ];
    
    
    // SCOPE BEHAVIOUR
    $scope.hasScope = function(scopes) {    
        var hasScope = $scope.APPLICATION_USER_IDENTITY.User.hasScope(scopes);
        return hasScope;
    };
  
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    self.goToRoute = function (route) {
        $location.path(route).search({}).hash('');
    };
}]);