'use strict';

Application.Controllers.controller('application.controller', ['$scope', '$route', '$routeParams', '$oauth2Connector', '$configuration', function($scope, $route, $routeParams, $oauth2Connector, $configuration) {
    var self = this;
    
    // SCOPE
    $scope.showUserProfile = function() {
        $scope.$state.transitionTo('profile', $scope.$stateParams);
    };
    
    $scope.$on('$stateChangeSuccess', function (event, data) {
        $scope.$emit('event:application:resize-requested');
    });
    
    $scope.$on('event:application:resize-requested', function (event, next, current) {
        setTimeout(function() {
            self.resize();
        }, 200);
    });


    
    // JQUERY EVENTS
    
    $(window).resize(function () {
        self.resize();
    });

    $(document).ready(function () {
        self.initialize();
    });
    
    
    
    // CONTROLLER --------------------------------------------------------------------------------------------------------
    
    self.initialize = function () {        
        //$('.scrollIndicator').scrollIndicator();

        try {
            $('#scrollable-content').niceScroll({ cursorcolor: '#a0a0a0', cursorborder: '#a0a0a0', cursoropacitymax: 0.5, cursorborderradius: '0px', scrollspeed: 30 });
        }
        catch (error) { /* IGNORE */}

        $.slidePage({
            action: 'init',
            toggle: '.app-menu-toggle',
            sidepanel: '#sidePanel',
            speed: 150,
            visibilityChanging: function () {              
            },
            visibilityChanged: function () {
                self.resize();
            }
        });
        
        $('#bootstrapLoader').hide();
        $('#application').show();
        
        self.resize();
    };

    self.resize = function resize() {
        setTimeout(function () {
            
            var windowHeight = $(window).height();
            var $content = $('.content');
            $content.height(windowHeight);

            var $sidepanelHeader = $('#sidePanel .app-sidepanel-header');
            var $sidepanelBody = $('#sidePanel .app-sidepanel-body');
            var height = $('.slidePage-sidepanel').height();
            $sidepanelBody.height(height - $sidepanelHeader.height());

            var $app_nav_menu = $('.app-nav-menu');
            var $app_body_content = $('.app-body-content');
            $app_body_content.height($content.height() - $app_nav_menu.height());

            //$('.scrollIndicator').scrollIndicator({ action: 'resize' });

            setTimeout(function() {
                try {
                    $('#scrollable-content').getNiceScroll().resize();
                }
                catch (error) { /* IGNORE */ }
            }, 1000);
        }, 10);
    };

}]);