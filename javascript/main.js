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
					monday: new Day('Monday'),
					wednesday: new Day('Wednesday'),
					friday: new Day('Friday')
				};
				weeks[i].Week.monday = {
					squat: new Lift('Squat'),
					bench: new Lift('Bench'),
					row: new Lift('Row'),
					reps: new Array()
				};
				weeks[i].Week.wednesday = {
					squat: new Lift('Squat'),
					incline: new Lift('Incline'),
					dead: new Lift('Deadlift'),
					reps: new Array()
				};
				weeks[i].Week.friday = {
					squat: new Lift('Squat'),
					bench: new Lift('Bench'),
					row: new Lift('Row'),
					reps: new Array()
				};
			};

			weeks[0].Week.monday.squat.set = fillDownSets(calcxRM(squatMax,5)*0.925, 5);
			weeks[0].Week.monday.bench.set = fillDownSets(calcxRM(benchMax,5)*0.925, 5);
			weeks[0].Week.monday.row.set = fillDownSets(calcxRM(rowMax,5)*0.925, 5);
			weeks[0].Week.monday.reps = [5,5,5,5,5];

			weeks[0].Week.wednesday.squat.set = fillDownSets(weeks[0].Week.monday.squat.set[2], 3);
			weeks[0].Week.wednesday.squat.set[3] = weeks[0].Week.monday.squat.set[2];
			weeks[0].Week.wednesday.incline.set = fillDownSets(calcxRM(incMax,5)*0.925, 4);
			weeks[0].Week.wednesday.dead.set = fillDownSets(calcxRM(deadMax,5)*0.925, 4);
			weeks[0].Week.wednesday.reps = [5,5,5,5];

			weeks[0].Week.friday.squat.set = fillDownSets(weeks[0].Week.monday.squat.set[4]*increasePercent, 5);
			weeks[0].Week.friday.squat.set[5] = weeks[0].Week.monday.squat.set[2];
			weeks[0].Week.friday.bench.set = fillDownSets(weeks[0].Week.monday.bench.set[4]*increasePercent, 5);
			weeks[0].Week.friday.bench.set[5] = weeks[0].Week.monday.bench.set[2];
			weeks[0].Week.friday.row.set = fillDownSets(weeks[0].Week.monday.row.set[4]*increasePercent, 5);
			weeks[0].Week.friday.row.set[5] = weeks[0].Week.monday.row.set[2];
			weeks[0].Week.friday.reps = [5,5,5,5,3,8];

			for (week=1; week<programLength; week++) {
				weeks[week].Week.monday.squat.set = fillDownSets(weeks[week-1].Week.monday.squat.set[4]*increasePercent, 5);
				weeks[week].Week.monday.bench.set = fillDownSets(weeks[week-1].Week.monday.bench.set[4]*increasePercent, 5);
				weeks[week].Week.monday.row.set = fillDownSets(weeks[week-1].Week.monday.row.set[4]*increasePercent, 5);
				weeks[week].Week.monday.reps = [5,5,5,5,5];

				weeks[week].Week.wednesday.squat.set = fillDownSets(weeks[week-1].Week.wednesday.squat.set[2]*increasePercent, 3);
				weeks[week].Week.wednesday.squat.set[3] = weeks[week].Week.wednesday.squat.set[2];
				weeks[week].Week.wednesday.incline.set = fillDownSets(weeks[week-1].Week.wednesday.incline.set[3]*increasePercent, 4);
				weeks[week].Week.wednesday.dead.set = fillDownSets(weeks[week-1].Week.wednesday.dead.set[3]*increasePercent, 4);
				weeks[week].Week.wednesday.reps = [5,5,5,5];

				weeks[week].Week.friday.squat.set = fillDownSets(weeks[week-1].Week.friday.squat.set[4]*increasePercent, 5);
				weeks[week].Week.friday.squat.set[5] = weeks[week].Week.wednesday.squat.set[3];
				weeks[week].Week.friday.bench.set = fillDownSets(weeks[week-1].Week.friday.bench.set[4]*increasePercent, 5);
				weeks[week].Week.friday.bench.set[5] = weeks[week].Week.friday.bench.set[3];
				weeks[week].Week.friday.row.set = fillDownSets(weeks[week-1].Week.friday.row.set[4]*increasePercent, 5);
				weeks[week].Week.friday.row.set[5] = weeks[week].Week.friday.row.set[3];
				weeks[week].Week.friday.reps = [5,5,5,5,3,8];
			}

			$('#tables').html('<p>');
			printAll();
			$('html, body').animate({scrollTop: $('#results').offset().top}, 1000);
			$('#results').fadeIn('2000');


		} else {
			console.log("BAD INPUT");
		};
	};
} );

