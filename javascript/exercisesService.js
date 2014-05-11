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

				if ( isNaN( exercise.weight ) ) {
					errors.push( exercise.type + " weight is not a number!" );
					console.warn( exercise.type + " weight is not a number" );
				}
				if ( isNaN( exercise.reps ) ) {
					errors.push( exercise.type + " reps is not a number!" );
					console.warn( exercise.type + " reps is not a number" );
				}
				if ( isNaN( exercise.sets ) ) {
					errors.push( exercise.type + " sets is not a number!" );
					console.warn( exercise.type + " sets is not a number" );
				}
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