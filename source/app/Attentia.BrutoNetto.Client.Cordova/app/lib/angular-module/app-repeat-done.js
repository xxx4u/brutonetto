Application.Directives
    .directive('appRepeatDone', function() {
        return function(scope, element, attrs) {
            if (scope.$last) { // all are rendered
                scope.$eval(attrs.appRepeatDone);
            }
        };
    });

Application.Directives
    .directive('appSelectOnClick', function () {
    // Linker function
    return function (scope, element, attrs) {
        element.click(function () {
            element.select();
        });
    };
});