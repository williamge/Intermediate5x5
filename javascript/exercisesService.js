squatApp.factory( "exercisesService", function() {

	//Data needs to be loaded in the page for this service to function
	var exerciseData = window._squatData.exercise;
	var optionsData = window._squatData.options;

	var exerciseTypes = [];
	var exercises = {};

	for ( var i = 0; i < exerciseData.length; i++ ) {
		exerciseTypes.push( exerciseData[i].type );
		exercises[ exerciseData[i].type ] = exerciseData[i];
	}

	/*  Helper class to check if a given number is NaN
		Arguments:  (Number) number: the number to check against NaN
					(string) name: name of the number being checked, for output formatting
					(boolean) warn: optional flag for printing warning info in the console
		Returns: A string describing the error if there is one, or null/undefined otherwise
	 */
	var checkForNaN = function( number, name, warn ) {
		var output;

		if ( isNaN( number )  ) {
			output = name + " is not a number!";
			if ( warn ) {
				console.warn( name + " is not a number!" );
			}
		}

		return output;
	}

	/*  Helper class to push a value in to an array only if the value is not null/undefined
		Arguments:  (anything) value: the value to be pushed in to the array
					(Array) array: the array for 'value' to be pushed
		Returns: The value given
	 */
	var pushValue = function( value, array ) {
		if ( value ) {
			array.push( value );
		}
		return value;
	}

	return {
		exercises: exerciseData,
		exerciseTypes: exerciseTypes,
		options: optionsData,
		getExercise: function( name ) {
			if ( !exercises[ name ] ) {
				throw new Error("Exercise \"" + name + "\" not found");
			}
			return exercises[ name ];
		},
		checkInputs: function() {

			var errors = [];

			for ( var exerciseKey in exercises ) {
				var exercise = exercises[ exerciseKey ];
				var lookupType = [ "weight", "reps", "sets" ];

				for ( var i in lookupType ) {
					pushValue( 
						checkForNaN( 
							exercise[ lookupType[ i ] ], 
							"[" + exercise.type + "] " + lookupType[ i ],
							true 
						),
						errors 
					);
				}
			}

			return errors;
		},
		checkOptions: function() {
			var errors = [];

			for ( var optionKey in optionsData ) {
				pushValue( 
					checkForNaN( 
						optionsData[ optionKey ],
						optionKey,
						true
					),
					errors
				);
			}

			if ( errors.length ) {
				return errors;
			}		

			if ( optionsData["Ramping %"] /100 > 0.20 || optionsData["Ramping %"] /100 < 0.001) {
				errors.push( "Using that value as a ramping percentage is highly unrecommended!" );
				return errors;
			}

			if ( optionsData["Smallest Plate"] > 25 ) {
				$('#errorOutput').html("The smallest plate you have is a " + optionsData["Smallest Plate"] + "?");
				return errors;
			} else {
				optionsData["Smallest Plate"] *= 2 ;
			}

			if (digitRound( optionsData["Program Length"] , 0) > 18) {
				$('#errorOutput').html("Running this program for more than 18 weeks without a reset is very ambitious.");
				return errors;
			}

			if ( optionsData["Increase %"] > 1.10) {
				$('#errorOutput').html("Using that value as an increase percentage is highly unrecommended!");
				return errors;
			}

			return errors;
		},
		calcRepMaxes: function() {
			function calcOneRM ( exercise ) {
				var max = exercise.weight/(1.0278-(0.0278*exercise.reps));
				max = max*(1+((exercise.sets-1)*0.0235));
				max = max.toFixed(1);
				return max;
			};

			function calcxRM (weight, reps) {
				return weight*(1.0278-(0.0278*reps));
			};

			function calcFiveRM ( exercise ) {
				return calcxRM( exercise.weight, 5 );
			};

			var repMaxes = {}

			for ( var exerciseKey in exercises ) {
				var exercise = exercises[ exerciseKey ];

				repMaxes[exerciseKey] = {
					oneRep : calcOneRM( exercise ),
					fiveRep : calcFiveRM( exercise )
				}
			}

			return repMaxes;
		} 
	}
});