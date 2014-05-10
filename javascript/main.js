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

squatApp.controller( "mainCtrl", function( $scope, $http ) {
	$scope.resultsRows = [];
	$scope.tables = [];

	$scope.printMaxes = function(oneRM) {
		var exercises = [ "Squat", "Bench", "Deadlift", "Row", "Incline" ];

		for (var i=0; i < exercises.length; i++){
			$scope.resultsRows.push(
				{
					lift : exercises[i],
					oneRep : digitRound(oneRM[i], 0),
					fiveRep : digitRound(calcxRM(oneRM[i], 5), 0)
				}
			);			
		}

	};

	$scope.returnWeek = function( week ) {

		var getDayExercise = function( week, dayInfo) {
			var exercisesList = [];

			for (var i = 0; i < dayInfo.exercises.length; i++) {
				exercisesList.push( 
					{
						class : "ex" + i,
						exercise : $scope.exerciseData(week, dayInfo.name, dayInfo.exercises[i])
					}
				);
			}

			return {
				name : dayInfo.name,
				exercises : exercisesList,
				assistanceWork : dayInfo.assistanceWork
			}
		};

		var mondayJSON = {
			name: "Monday",
			exercises: [ "squat", "bench", "row" ],
			assistanceWork: [
				"Weighted Hyperextensions - 2 sets of 8-12 reps",
				"Weighted Decline Situps - 4 sets of 8-15 reps"
			]
		};

		var wednesdayJSON = {
			name: "Wednesday",
			exercises: [  "squat", "incline", "dead" ],
			assistanceWork: [
				"Situps - 3 sets of 8-15 reps"
			]
		};

		var fridayJSON = {
			name: "Friday",
			exercises: [ "squat", "bench", "row" ],
			assistanceWork: [
				"Weighted Dips - 3 sets of 5-8 reps",
				"Barbell curls - 3 sets of 8-12 reps",
				"Triceps Extensions - 3 sets of 8-12 reps"
			]
		};

		var weekData = [
			getDayExercise(	week, mondayJSON ), 
			getDayExercise(	week, wednesdayJSON ),
			getDayExercise(	week, fridayJSON ) 
		];
		return {
			number : (week+1),
			exerciseDays : weekData
		};
	}

	$scope.exerciseData = function( week, day, exercise ) {
		var output = {
			liftName : weeks[week].Week[day][exercise].liftName,
			sets : []
		};

		for (i=0; i<weeks[week].Week[day][exercise].set.length; i++) {
			output.sets.push( 
				{
					reps: weeks[week].Week[day].reps[i],
					weight: xRound(weeks[week].Week[day][exercise].set[i], smallestIncrement)
				}
			)
		};

		return output;
	};

	$scope.printAll = function() {
		var tables = [];
		for (var i=0; i<programLength; i++) {
			console.info(i);
			tables.push( $scope.returnWeek(i) );
		};

		$scope.tables = tables;
	};

	$scope.submit = function() {
		console.info('Submit button clicked'); // logging

		/* Create Arrays to hold all the variables from the input boxes and pull the variables from the boxes */

		var squatInput = new Array;
		squatInput[0] = 'Squat';
		squatInput[1] = $('input:text[name=sWeight]').val();
		squatInput[2] = $('input:text[name=sReps]').val();
		squatInput[3] = $('input:text[name=sSets]').val();

		var benchInput = new Array;
		benchInput[0] = 'Bench';
		benchInput[1] = $('input:text[name=bWeight]').val();
		benchInput[2] = $('input:text[name=bReps]').val();
		benchInput[3] = $('input:text[name=bSets]').val();

		var deadInput = new Array;
		deadInput[0] = 'Deadlift';
		deadInput[1] = $('input:text[name=dWeight]').val();
		deadInput[2] = $('input:text[name=dReps]').val();
		deadInput[3] = $('input:text[name=dSets]').val();

		var rowInput = new Array;
		rowInput[0] = 'Row';
		rowInput[1] = $('input:text[name=rWeight]').val();
		rowInput[2] = $('input:text[name=rReps]').val();
		rowInput[3] = $('input:text[name=rSets]').val();

		var inclineInput = new Array;
		inclineInput[0] = 'Incline';
		inclineInput[1] = $('input:text[name=iWeight]').val();
		inclineInput[2] = $('input:text[name=iReps]').val();
		inclineInput[3] = $('input:text[name=iSets]').val();

		smallestIncrement = $('input:text[name=sIncrease]').val();
		rampingPercent = $('input:text[name=sRamp]').val()/100;
		programLength = $('input:text[name=pLength]').val();
		increasePercent = $('input:text[name=wIncrease]').val();

		increasePercent = (increasePercent/100)+1;
		
		console.log(increasePercent);

		var oneRM = new Array;   // Create array to hold 1 rep maxes once calculated

		var inputIsClean = true;   // Flag that's tripped if user input isn't valid

		// Validate all user input	
		if (checkSmallVars(smallestIncrement, rampingPercent, digitRound(programLength, 0), increasePercent) == false || checkInput(squatInput[0], squatInput[1], squatInput[2], squatInput[3]) == false || checkInput(benchInput[0], benchInput[1], benchInput[2], benchInput[3]) == false || checkInput(deadInput[0], deadInput[1], deadInput[2], deadInput[3]) == false || checkInput(rowInput[0], rowInput[1], rowInput[2], rowInput[3]) == false ||	checkInput(inclineInput[0], inclineInput[1], inclineInput[2], inclineInput[3]) == false) {
			inputIsClean = false;
		};

		if (inputIsClean == true) {
			$('#error').hide();
			oneRM[0] = calc1RM(squatInput[1], squatInput[2], squatInput[3]); //squat
			oneRM[1] = calc1RM(benchInput[1], benchInput[2], benchInput[3]); //bench
			oneRM[2] = calc1RM(deadInput[1], deadInput[2], deadInput[3]); //dead
			oneRM[3] = calc1RM(rowInput[1], rowInput[2], rowInput[3]); //row
			oneRM[4] = calc1RM(inclineInput[1], inclineInput[2], inclineInput[3]); //incline

			console.info("Maxes = " + oneRM);
			var squatMax = oneRM[0];
			var benchMax = oneRM[1];
			var deadMax = oneRM[2];
			var rowMax = oneRM[3];
			var incMax = oneRM[4];

			$scope.printMaxes(oneRM);
			$('#results').fadeIn('slow');



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

			$scope.printAll();

			$('html, body').animate({scrollTop: $('#results').offset().top}, 1000);
			$('#results').fadeIn('2000');


		} else {
			console.log("BAD INPUT");
		};
	};
} );

