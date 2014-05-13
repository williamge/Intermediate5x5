squatApp.factory( "exercisesService", function() {

	//Data needs to be loaded in the page for this service to function
	var exerciseData = window._squatData.exercise;
	var optionsData = window._squatData.options;

	var exerciseTypes = [];
	var exerciseKeyToType = {};
	var exercises = {};

	for ( var i = 0; i < exerciseData.length; i++ ) {
		exerciseTypes.push( exerciseData[i].type );
		exercises[ exerciseData[i].type ] = exerciseData[i];
		exerciseKeyToType[ exerciseData[i].key ] = exerciseData[i].type;
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
		getExerciseName: function( exerciseKey ) {
			if ( !exerciseKeyToType[ exerciseKey ] ) {
				throw new Error("Exercise key \"" + exerciseKey + "\" not found");
			}
			return exerciseKeyToType[ exerciseKey ];
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

			if ( optionsData["Increase %"] /100 > 1.10) {
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
			var increasePercent = optionsData["Increase %"] /100 + 1;
			var programLength = optionsData["Program Length"];

			for (var i = 0; i < programLength; i++) {
				weeks[i] = new Week(i);
				weeks[i].Week = {
					Monday: new Day('Monday'),
					Wednesday: new Day('Wednesday'),
					Friday: new Day('Friday')
				};
				weeks[i].Week.Monday = {
					exercises: {
						squat: new Lift('Squat'),
						bench: new Lift('Bench'),
						row: new Lift('Row'),
					},
					reps: new Array(),
					asstWork: [
						"Weighted Hyperextensions - 2 sets of 8-12 reps",
						"Weighted Decline Situps - 4 sets of 8-15 reps"
					]
				};
				weeks[i].Week.Wednesday = {
					exercises: {
						squat: new Lift('Squat'),
						incline: new Lift('Incline'),
						dead: new Lift('Deadlift'),
					},
					reps: new Array(),
					asstWork: [
						"Situps - 3 sets of 8-15 reps"
					]
				};
				weeks[i].Week.Friday = {
					exercises: {
						squat: new Lift('Squat'),
						bench: new Lift('Bench'),
						row: new Lift('Row'),
					},
					reps: new Array(),
					asstWork: [
						"Weighted Dips - 3 sets of 5-8 reps",
						"Barbell curls - 3 sets of 8-12 reps",
						"Triceps Extensions - 3 sets of 8-12 reps"
					]
				};
			};

			weeks[0].Week.Monday.exercises.squat.set = fillDownSets( calcxRM( squatMax , 5) * 0.925, 5, rampingPercent );
			weeks[0].Week.Monday.exercises.bench.set = fillDownSets( calcxRM( benchMax , 5) * 0.925, 5, rampingPercent );
			weeks[0].Week.Monday.exercises.row.set = fillDownSets( calcxRM( rowMax, 5) * 0.925, 5, rampingPercent );
			weeks[0].Week.Monday.reps = [5,5,5,5,5];

			weeks[0].Week.Wednesday.exercises.squat.set = fillDownSets( weeks[0].Week.Monday.exercises.squat.set[2], 3, rampingPercent );
			weeks[0].Week.Wednesday.exercises.squat.set[3] = weeks[0].Week.Monday.exercises.squat.set[2];
			weeks[0].Week.Wednesday.exercises.incline.set = fillDownSets( calcxRM( incMax, 5 ) * 0.925, 4, rampingPercent );
			weeks[0].Week.Wednesday.exercises.dead.set = fillDownSets( calcxRM( deadMax, 5) * 0.925, 4, rampingPercent );
			weeks[0].Week.Wednesday.reps = [5,5,5,5];

			weeks[0].Week.Friday.exercises.squat.set = fillDownSets( weeks[0].Week.Monday.exercises.squat.set[4] * increasePercent, 5, rampingPercent );
			weeks[0].Week.Friday.exercises.squat.set[5] = weeks[0].Week.Monday.exercises.squat.set[2];
			weeks[0].Week.Friday.exercises.bench.set = fillDownSets( weeks[0].Week.Monday.exercises.bench.set[4] * increasePercent, 5, rampingPercent );
			weeks[0].Week.Friday.exercises.bench.set[5] = weeks[0].Week.Monday.exercises.bench.set[2];
			weeks[0].Week.Friday.exercises.row.set = fillDownSets( weeks[0].Week.Monday.exercises.row.set[4] * increasePercent, 5, rampingPercent );
			weeks[0].Week.Friday.exercises.row.set[5] = weeks[0].Week.Monday.exercises.row.set[2];
			weeks[0].Week.Friday.reps = [5,5,5,5,3,8];

			for ( week = 1; week < programLength; week++) {
				weeks[week].Week.Monday.exercises.squat.set = fillDownSets( weeks[week-1].Week.Monday.exercises.squat.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Monday.exercises.bench.set = fillDownSets( weeks[week-1].Week.Monday.exercises.bench.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Monday.exercises.row.set = fillDownSets( weeks[week-1].Week.Monday.exercises.row.set[4] * increasePercent, 5, rampingPercent);
				weeks[week].Week.Monday.reps = [5,5,5,5,5];

				weeks[week].Week.Wednesday.exercises.squat.set = fillDownSets( weeks[week-1].Week.Wednesday.exercises.squat.set[2] * increasePercent, 3, rampingPercent );
				weeks[week].Week.Wednesday.exercises.squat.set[3] = weeks[week].Week.Wednesday.exercises.squat.set[2];
				weeks[week].Week.Wednesday.exercises.incline.set = fillDownSets( weeks[week-1].Week.Wednesday.exercises.incline.set[3] * increasePercent, 4, rampingPercent );
				weeks[week].Week.Wednesday.exercises.dead.set = fillDownSets( weeks[week-1].Week.Wednesday.exercises.dead.set[3]*increasePercent, 4, rampingPercent );
				weeks[week].Week.Wednesday.reps = [5,5,5,5];

				weeks[week].Week.Friday.exercises.squat.set = fillDownSets( weeks[week-1].Week.Friday.exercises.squat.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Friday.exercises.squat.set[5] = weeks[week].Week.Wednesday.exercises.squat.set[3];
				weeks[week].Week.Friday.exercises.bench.set = fillDownSets( weeks[week-1].Week.Friday.exercises.bench.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Friday.exercises.bench.set[5] = weeks[week].Week.Friday.exercises.bench.set[3];
				weeks[week].Week.Friday.exercises.row.set = fillDownSets( weeks[week-1].Week.Friday.exercises.row.set[4] * increasePercent, 5, rampingPercent );
				weeks[week].Week.Friday.exercises.row.set[5] = weeks[week].Week.Friday.exercises.row.set[3];
				weeks[week].Week.Friday.reps = [5,5,5,5,3,8];
			}

			return weeks;
		} 
	}
});