define( [
    "require",
    "angular",
    "jquery",
    "app", 
    "controllers",
    "directives",
    "exercisesService"
],  function( require, angular, $ ) {
        $(function() {
            angular.bootstrap(document, ['squatApp']);
        });
    }
);