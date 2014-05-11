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
		}
	}
});