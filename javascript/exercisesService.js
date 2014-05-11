squatApp.factory( "exercisesService", function() {

	//Data needs to be loaded in the page for this service to function
	var exerciseData = window._squatData.exercise;

	var exerciseTypes = [];

	for ( var i = 0; i < exerciseData.length; i++ ) {
		exerciseTypes.push( exerciseData[i].type );
	}

	return {
		exercises: exerciseData,
		exerciseTypes: exerciseTypes
	}
});