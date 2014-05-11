
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
							}
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
		$scope.getWeek = function( week, days ) {

			//TODO: this is ridiculous, the output for this needs to be simplified
			/* 	Private helper function to form a final list of exercises for a day.

				Arguments: 	(int) week: numbered week to calculate
							(string) dayName: name of the day to calculate
							(list of [string]) exercises: list of name of exercises for that day
							(list of [string]) assistanceWork: list of additional work for that
							 day, no calculations will be made for these workouts
				
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
			var getDayExercise = function( week, dayName, exercises, assistanceWork) {
				var exercisesList = [];

				for (var i = 0; i < exercises.length; i++) {
					exercisesList.push( 
						{
							class : "ex" + i,
							exercise : $scope.exerciseData(week, dayName, exercises[i])
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
					getDayExercise(	week, days[i].name, days[i].exercises, days[i].assistanceWork )
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
		$scope.exerciseData = function( week, day, exercise ) {
			var sets = [];

			for (i=0; i<weeks[week].Week[day][exercise].set.length; i++) {
				sets.push( 
					{
						reps: weeks[week].Week[day].reps[i],
						weight: xRound(weeks[week].Week[day][exercise].set[i], smallestIncrement)
					}
				)
			};

			return {
				liftName : weeks[week].Week[day][exercise].liftName,
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
		$scope.getTables = function( days ) {
			var tables = [];
			for (var i=0; i<programLength; i++) {
				console.info(i);
				tables.push( $scope.getWeek( i, days ) );
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

			var exerciseTypes = exercisesService.exerciseTypes;

			var exerciseInputs = {};

			exerciseInputs["Squat"] = exercisesService.getExercise( "Squat" );

			exerciseInputs["Bench Press"] = exercisesService.getExercise( "Bench Press" );

			exerciseInputs["Deadlift"] = exercisesService.getExercise( "Deadlift" );

			exerciseInputs["Barbell Row"] = exercisesService.getExercise( "Barbell Row" );

			exerciseInputs["Incline Bench"] = exercisesService.getExercise( "Incline Bench" );

			smallestIncrement = exercisesService.options["Smallest Plate"];
			rampingPercent = exercisesService.options["Ramping %"]/100;
			programLength = exercisesService.options["Program Length"];
			increasePercent = exercisesService.options["Increase %"];

			increasePercent = (increasePercent/100)+1;
			
			console.log(increasePercent);

			var inputIsClean = true;   // Flag that's tripped if user input isn't valid

			$scope.errors = exercisesService.checkInputs();

			// Validate all user input	
			if (checkSmallVars(smallestIncrement, rampingPercent, digitRound(programLength, 0), increasePercent) == false 
				|| $scope.errors.length ) {
					inputIsClean = false;
			};

			if (inputIsClean == true) {
				$('#error').hide();

				repMaxes = exercisesService.calcRepMaxes();

				var squatMax = repMaxes[ "Squat" ].oneRep;
				var benchMax = repMaxes[ "Bench Press" ].oneRep;
				var deadMax = repMaxes[ "Deadlift" ].oneRep;
				var rowMax = repMaxes[ "Barbell Row" ].oneRep;
				var incMax = repMaxes[ "Incline Bench" ].oneRep;

				$scope.printMaxes( repMaxes );
				$('#results').fadeIn('slow');


				//TODO: find out what this even does or why you would want this
				var empty = [[1,1],[1,1],[1,1],[1,1],[1,1]];

				for (var i=0; i<programLength; i++) {
					weeks[i] = new Week(i);
					weeks[i].Week = {
						Monday: new Day('Monday'),
						Wednesday: new Day('Wednesday'),
						Friday: new Day('Friday')
					};
					weeks[i].Week.Monday = {
						squat: new Lift('Squat'),
						bench: new Lift('Bench'),
						row: new Lift('Row'),
						reps: new Array()
					};
					weeks[i].Week.Wednesday = {
						squat: new Lift('Squat'),
						incline: new Lift('Incline'),
						dead: new Lift('Deadlift'),
						reps: new Array()
					};
					weeks[i].Week.Friday = {
						squat: new Lift('Squat'),
						bench: new Lift('Bench'),
						row: new Lift('Row'),
						reps: new Array()
					};
				};

				weeks[0].Week.Monday.squat.set = fillDownSets(calcxRM(squatMax,5)*0.925, 5);
				weeks[0].Week.Monday.bench.set = fillDownSets(calcxRM(benchMax,5)*0.925, 5);
				weeks[0].Week.Monday.row.set = fillDownSets(calcxRM(rowMax,5)*0.925, 5);
				weeks[0].Week.Monday.reps = [5,5,5,5,5];

				weeks[0].Week.Wednesday.squat.set = fillDownSets(weeks[0].Week.Monday.squat.set[2], 3);
				weeks[0].Week.Wednesday.squat.set[3] = weeks[0].Week.Monday.squat.set[2];
				weeks[0].Week.Wednesday.incline.set = fillDownSets(calcxRM(incMax,5)*0.925, 4);
				weeks[0].Week.Wednesday.dead.set = fillDownSets(calcxRM(deadMax,5)*0.925, 4);
				weeks[0].Week.Wednesday.reps = [5,5,5,5];

				weeks[0].Week.Friday.squat.set = fillDownSets(weeks[0].Week.Monday.squat.set[4]*increasePercent, 5);
				weeks[0].Week.Friday.squat.set[5] = weeks[0].Week.Monday.squat.set[2];
				weeks[0].Week.Friday.bench.set = fillDownSets(weeks[0].Week.Monday.bench.set[4]*increasePercent, 5);
				weeks[0].Week.Friday.bench.set[5] = weeks[0].Week.Monday.bench.set[2];
				weeks[0].Week.Friday.row.set = fillDownSets(weeks[0].Week.Monday.row.set[4]*increasePercent, 5);
				weeks[0].Week.Friday.row.set[5] = weeks[0].Week.Monday.row.set[2];
				weeks[0].Week.Friday.reps = [5,5,5,5,3,8];

				for (week=1; week<programLength; week++) {
					weeks[week].Week.Monday.squat.set = fillDownSets(weeks[week-1].Week.Monday.squat.set[4]*increasePercent, 5);
					weeks[week].Week.Monday.bench.set = fillDownSets(weeks[week-1].Week.Monday.bench.set[4]*increasePercent, 5);
					weeks[week].Week.Monday.row.set = fillDownSets(weeks[week-1].Week.Monday.row.set[4]*increasePercent, 5);
					weeks[week].Week.Monday.reps = [5,5,5,5,5];

					weeks[week].Week.Wednesday.squat.set = fillDownSets(weeks[week-1].Week.Wednesday.squat.set[2]*increasePercent, 3);
					weeks[week].Week.Wednesday.squat.set[3] = weeks[week].Week.Wednesday.squat.set[2];
					weeks[week].Week.Wednesday.incline.set = fillDownSets(weeks[week-1].Week.Wednesday.incline.set[3]*increasePercent, 4);
					weeks[week].Week.Wednesday.dead.set = fillDownSets(weeks[week-1].Week.Wednesday.dead.set[3]*increasePercent, 4);
					weeks[week].Week.Wednesday.reps = [5,5,5,5];

					weeks[week].Week.Friday.squat.set = fillDownSets(weeks[week-1].Week.Friday.squat.set[4]*increasePercent, 5);
					weeks[week].Week.Friday.squat.set[5] = weeks[week].Week.Wednesday.squat.set[3];
					weeks[week].Week.Friday.bench.set = fillDownSets(weeks[week-1].Week.Friday.bench.set[4]*increasePercent, 5);
					weeks[week].Week.Friday.bench.set[5] = weeks[week].Week.Friday.bench.set[3];
					weeks[week].Week.Friday.row.set = fillDownSets(weeks[week-1].Week.Friday.row.set[4]*increasePercent, 5);
					weeks[week].Week.Friday.row.set[5] = weeks[week].Week.Friday.row.set[3];
					weeks[week].Week.Friday.reps = [5,5,5,5,3,8];
				}

				daysPromise.success( function( data ) {
					$scope.tables = $scope.getTables( data );
				});


				//TODO: Re-implement this functionality but angularized
				//$('html, body').animate({scrollTop: $('#results').offset().top}, 1000);
				//$('#results').fadeIn('2000');


			} else {
				console.log("BAD INPUT");
			};
		};
	}
]);

