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

	var fillDownSets = function( topSet, sets, rampingPercent ) {
		var setArray = new Array();
		for (i=sets-1; i>-1; i--) {
			setArray[i] = topSet * (1 - (rampingPercent*(sets-i-1)));
		};
		return setArray;
	};

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
				errors.push( "The smallest plate you have is a " + optionsData["Smallest Plate"] + "?" );
				return errors;
			} else {
				optionsData["Smallest Plate"] *= 2 ;
			}

			if (digitRound( optionsData["Program Length"] , 0) > 18) {
				errors.push( "Running this program for more than 18 weeks without a reset is very ambitious." );
				return errors;
			}

			if ( optionsData["Increase %"] > 1.10) {
				errors.push( "Using that value as an increase percentage is highly unrecommended!" );
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
		},
		getProgram: function() {

			var weeks = [];

			var repMaxes = this.calcRepMaxes();

			var squatMax = repMaxes[ "Squat" ].oneRep;
			var benchMax = repMaxes[ "Bench Press" ].oneRep;
			var deadMax = repMaxes[ "Deadlift" ].oneRep;
			var rowMax = repMaxes[ "Barbell Row" ].oneRep;
			var incMax = repMaxes[ "Incline Bench" ].oneRep;

			var rampingPercent = optionsData["Ramping %"] / 100;
			var increasePercent = optionsData["Increase %"];
			var programLength = optionsData["Program Length"];

			for (var i = 0; i < programLength; i++) {
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

			weeks[0].Week.Monday.squat.set = fillDownSets( calcxRM( squatMax , 5) * 0.925, 5, rampingPercent );
			weeks[0].Week.Monday.bench.set = fillDownSets( calcxRM( benchMax , 5) * 0.925, 5, rampingPercent );
			weeks[0].Week.Monday.row.set = fillDownSets( calcxRM( rowMax, 5) * 0.925, 5, rampingPercent );
			weeks[0].Week.Monday.reps = [5,5,5,5,5];

			weeks[0].Week.Wednesday.squat.set = fillDownSets( weeks[0].Week.Monday.squat.set[2], 3, rampingPercent );
			weeks[0].Week.Wednesday.squat.set[3] = weeks[0].Week.Monday.squat.set[2];
			weeks[0].Week.Wednesday.incline.set = fillDownSets( calcxRM( incMax, 5 ) * 0.925, 4, rampingPercent );
			weeks[0].Week.Wednesday.dead.set = fillDownSets( calcxRM( deadMax, 5) * 0.925, 4, rampingPercent );
			weeks[0].Week.Wednesday.reps = [5,5,5,5];

			weeks[0].Week.Friday.squat.set = fillDownSets( weeks[0].Week.Monday.squat.set[4] * increasePercent, 5, rampingPercent );
			weeks[0].Week.Friday.squat.set[5] = weeks[0].Week.Monday.squat.set[2];
			weeks[0].Week.Friday.bench.set = fillDownSets( weeks[0].Week.Monday.bench.set[4] * increasePercent, 5, rampingPercent );
			weeks[0].Week.Friday.bench.set[5] = weeks[0].Week.Monday.bench.set[2];
			weeks[0].Week.Friday.row.set = fillDownSets( weeks[0].Week.Monday.row.set[4] * increasePercent, 5, rampingPercent );
			weeks[0].Week.Friday.row.set[5] = weeks[0].Week.Monday.row.set[2];
			weeks[0].Week.Friday.reps = [5,5,5,5,3,8];

			for ( week = 1; week < programLength; week++) {
				weeks[week].Week.Monday.squat.set = fillDownSets( weeks[week-1].Week.Monday.squat.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Monday.bench.set = fillDownSets( weeks[week-1].Week.Monday.bench.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Monday.row.set = fillDownSets( weeks[week-1].Week.Monday.row.set[4] * increasePercent, 5, rampingPercent);
				weeks[week].Week.Monday.reps = [5,5,5,5,5];

				weeks[week].Week.Wednesday.squat.set = fillDownSets( weeks[week-1].Week.Wednesday.squat.set[2] * increasePercent, 3, rampingPercent );
				weeks[week].Week.Wednesday.squat.set[3] = weeks[week].Week.Wednesday.squat.set[2];
				weeks[week].Week.Wednesday.incline.set = fillDownSets( weeks[week-1].Week.Wednesday.incline.set[3] * increasePercent, 4, rampingPercent );
				weeks[week].Week.Wednesday.dead.set = fillDownSets( weeks[week-1].Week.Wednesday.dead.set[3]*increasePercent, 4, rampingPercent );
				weeks[week].Week.Wednesday.reps = [5,5,5,5];

				weeks[week].Week.Friday.squat.set = fillDownSets( weeks[week-1].Week.Friday.squat.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Friday.squat.set[5] = weeks[week].Week.Wednesday.squat.set[3];
				weeks[week].Week.Friday.bench.set = fillDownSets( weeks[week-1].Week.Friday.bench.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Friday.bench.set[5] = weeks[week].Week.Friday.bench.set[3];
				weeks[week].Week.Friday.row.set = fillDownSets( weeks[week-1].Week.Friday.row.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Friday.row.set[5] = weeks[week].Week.Friday.row.set[3];
				weeks[week].Week.Friday.reps = [5,5,5,5,3,8];
			}

			return weeks;
		} 
	}
});