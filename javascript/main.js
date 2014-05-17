requirejs.config({
    "baseUrl": "javascript",
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "jquery-ui": "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js",
      "angular": "//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.7/angular.min"
    },
    shim: {
    	"angular": {
    		exports: "angular",
    	},
    	"jquery-ui": {
    		exports: "jquery-ui",
    		deps: [ "jquery" ]
    	}
    },
    deps: [ "bootstrap" ]
});

