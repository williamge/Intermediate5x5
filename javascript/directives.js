define( [
    "app"
],  function( squatApp ) {
	
		squatApp.directive( "saFadeIn", function() {
			return {
				restrict: "A",
				link: function( scope, element, attrs ) {

					$(element).hide();

					scope.$watch(attrs.saFadeIn, function( value ) {
						if (value) {
							$(element).fadeIn(1000);
							$('html, body').animate( {
								scrollTop: $(element).offset().top 
							}, 1000 );
						}
					});
				}
			};
		} ) ;

	}
);