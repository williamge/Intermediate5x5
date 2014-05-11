squatApp.factory( "exercisesService", function() {

	//Data needs to be loaded in the page for this service to function
	var exerciseData = window._squatData.exercise;

	var exerciseTypes = [];
	var exercises = {};

	for ( var i = 0; i < exerciseData.length; i++ ) {
		exerciseTypes.push( exerciseData[i].type );
		exercises[ exerciseData[i].type ] = exerciseData[i];
	}

	return {
		exercises: exerciseData,
		exerciseTypes: exerciseTypes,
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
		}
	}
});