requirejs.config({
    "baseUrl": ".",
    "paths": {
        "angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.7/angular.min",
        "angular-mocks" : "//code.angularjs.org/1.3.0-beta.7/angular-mocks",
        "app" : "../javascript/app",
        "exercisesService": "../javascript/exercisesService",
        "helpers": "../javascript/helpers"
    },
    shim: {
    	"angular": {
    		exports: "angular"
    	},
        "angular-mocks": {
            exports: "angular-mocks"
        }
    }
});

requirejs( [
    "lib/jasmine-2.0.0/boot",
    "angular",
    "angular-mocks",
    "spec/exercisesServiceSpec"

],  function() {
        window.executeTests()
    }
);