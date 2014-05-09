var squatApp = angular.module( "squatApp", [] );

squatApp.controller( "exercises", function( $scope, $http ) {
	$scope.exercisesList = [
		{
			type : "Squat",
			prefix : "s",
			defaultWeight : 225,
			defaultReps: 5,
			defaultSets: 1
		},
		{
			type : "Bench Press",
			prefix : "b",
			defaultWeight : 185,
			defaultReps: 5,
			defaultSets: 1
		},
		{
			type : "Deadlift",
			prefix : "d",
			defaultWeight : 315,
			defaultReps: 5,
			defaultSets: 1
		},		
		{
			type : "Barbell Row",
			prefix : "r",
			defaultWeight : 135,
			defaultReps: 5,
			defaultSets: 1
		},
		{
			type : "Incline Bench",
			prefix : "i",
			defaultWeight : 95,
			defaultReps: 5,
			defaultSets: 1
		},
	];
} );

squatApp.controller( "options", function( $scope, $http ) {
	$scope.showOptions = false;

	$scope.toggleOptions = function() {
		$scope.showOptions = !$scope.showOptions;
	};

} );

