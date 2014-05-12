
squatApp.controller( "exercises", [ "$scope", "$http", "exercisesService",
	function( $scope, $http, exercisesService ) {

		$scope.exercisesList = exercisesService.exercises;
	}
]);

squatApp.controller( "options", [ "$scope", "$http", "exercisesService", 
	function( $scope, $http, exercisesService ) {

		$scope.showOptions = false;

		$scope.options = exercisesService.options;

		$scope.toggleOptions = function() {
			$scope.showOptions = !$scope.showOptions;
		};
	}
]);

squatApp.controller( "mainCtrl", [ "$scope", "$http", "exercisesService", 
	function( $scope, $http, exercisesService ) {
		$scope.resultsRows = [];
		$scope.tables = [];

		//TODO: replace this with a $resource call
		var daysPromise = $http.get('json/days.json')

		$scope.printMaxes = function( repMaxes ) {
			$scope.resultsRows = [];

			var exercises = exercisesService.exerciseTypes;

			for (var exRepKey in repMaxes) {
				var exRep = repMaxes[ exRepKey ];

				$scope.resultsRows.push(
					{
						lift : exRepKey,
						oneRep : digitRound(  exRep.oneRep , 0 ),
						fiveRep : digitRound( exRep.fiveRep , 0 )
					}
				);		
			}

		};

		//TODO: this is ridiculous, the output for this needs to be simplified
		/*	Calculates the exercise data for a given week
			Arguments: 	(int) week: numbered week to calculate
						(List of [Object]) days: data for given week's exercises, in form:
							{
								name : [name of the day]
								exercises : [list of names of exercises]
								assistanceWork: [list of additional exercises not to be calculated]
							},
						(Program) weeks_: program to list the weeks of exercise for
			Returns: Object of form {
				number: [number of the calculated week],
				exerciseDays: [
					{
						name: [name of exercise],
						exercises: [
							class: [name of CSS class],
							exercise: {
								liftName: [exercise name],
								sets: [
									reps: [number of reps for this exercise],
									weight: [weight to use for this exercise]
								]
							}
						],
						assistanceWork: [list of exercises in addition to the calculated ones]
					}
				]
			} 
		 */ 
		$scope.getWeek = function( week, days, weeks_ ) {

			//TODO: this is ridiculous, the output for this needs to be simplified
			/* 	Private helper function to form a final list of exercises for a day.

				Arguments: 	(int) week: numbered week to calculate
							(string) dayName: name of the day to calculate
							(list of [string]) exercises: list of name of exercises for that day
							(list of [string]) assistanceWork: list of additional work for that
							 day, no calculations will be made for these workouts
							(Program) weeks_: program to list the weeks of exercise for
				
				Returns: Object of form {
					name: [name of exercise],
					exercises: [
						class: [name of CSS class],
						exercise: {
							liftName: [exercise name],
							sets: [
								reps: [number of reps for this exercise],
								weight: [weight to use for this exercise]
							]
						}
					],
					assistanceWork: [list of exercises in addition to the calculated ones]
				}
			 */
			var getDayExercise = function( week, dayName, exercises, assistanceWork, weeks_) {
				var exercisesList = [];

				for (var i = 0; i < exercises.length; i++) {
					exercisesList.push( 
						{
							class : "ex" + i,
							exercise : $scope.exerciseData(week, dayName, exercises[i], weeks_)
						}
					);
				}

				return {
					name : dayName,
					exercises : exercisesList,
					assistanceWork : assistanceWork
				}
			};

			var weekData = [];

			for (var i = 0; i < days.length; i++) {
				weekData.push( 
					getDayExercise(	week, days[i].name, days[i].exercises, days[i].assistanceWork, weeks_ )
				);
			}

			return {
				number : (week+1),
				exerciseDays : weekData
			};
		}

		/*	Calculates sets (reps and weight) for an exercise.
			Arguments: 	(int) week: numbered week to calculate
						(string) day: name of day to calculate
						(string) exercise: name of exercise to calculate
						(Program) weeks_: program to list the weeks of exercise for
			Returns: Object of form {
				liftName: [name of exercise],
				sets: [
					{
						reps: [number of reps for the exercise]
						weight: [weight for the exercise]
					}
				]
			} 
		 */
		$scope.exerciseData = function( week, day, exercise, weeks_ ) {
			var sets = [];

			for (i=0; i<weeks_[week].Week[day][exercise].set.length; i++) {
				sets.push( 
					{
						reps: weeks_[week].Week[day].reps[i],
						weight: xRound(weeks_[week].Week[day][exercise].set[i], exercisesService.options["Smallest Plate"])
					}
				)
			};

			return {
				liftName : weeks_[week].Week[day][exercise].liftName,
				sets : sets
			};
		};

		/*	Returns list of weeks of exercise and their associated data to be rendered.
			Arguments: 	(List of [Object]) days: data for given week's exercises, in form:
							{
								name : [name of the day]
								exercises : [list of names of exercises]
								assistanceWork: [list of additional exercises not to be calculated]
							}
						(Program) weeks_: program to list the weeks of exercise for
			Returns: List of Objects of form {
					number: [number of the calculated week],
					exerciseDays: [
						{
							name: [name of exercise],
							exercises: [
								class: [name of CSS class],
								exercise: {
									liftName: [exercise name],
									sets: [
										reps: [number of reps for this exercise],
										weight: [weight to use for this exercise]
									]
								}
							],
							assistanceWork: [list of exercises in addition to the calculated ones]
						}
					]
				} 
		 */
		$scope.getTables = function( days, weeks_ ) {
			var tables = [];
			for (var i=0; i < exercisesService.options["Program Length"]; i++) {
				console.info(i);
				tables.push( $scope.getWeek( i, days, weeks_ ) );
			};

			return tables;
		};

		//TODO: it takes no arguments and returns nothing, this should probably be refactored
		//		to be more clear of what it's doing
		/* 	Performs calculations of workout schedule based off of user input and stores data in "$scope.tables"
			Arguments: None
			Returns: None
		*/
		$scope.submit = function() {
			console.info('Submit button clicked'); // logging

			$scope.tables = [];
			$scope.resultsRows = [];

			$scope.errors = exercisesService.checkInputs();
			$scope.errors = $scope.errors.concat( exercisesService.checkOptions() );

			// Validate all user input	
			if ( $scope.errors.length ) {
				console.log("BAD INPUT");
			} else {

				var repMaxes = exercisesService.calcRepMaxes();

				$scope.printMaxes( repMaxes );

				//TODO: bring this back but angularized
				//$('#results').fadeIn('slow');


				//TODO: find out what this even does or why you would want this
				var empty = [[1,1],[1,1],[1,1],[1,1],[1,1]];

				var weeks = exercisesService.getProgram();


				daysPromise.success( function( data ) {
					$scope.tables = $scope.getTables( data, weeks );
				});


				//TODO: Re-implement this functionality but angularized
				//$('html, body').animate({scrollTop: $('#results').offset().top}, 1000);
				//$('#results').fadeIn('2000');


			};
		};
	}
]);

