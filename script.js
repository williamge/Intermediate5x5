/*--- GLOBAL VARIABLES ---*/

var rampingPercent = 0.125;
var smallestIncrement = 5;
var programLength = 10;
var weeks = new Array();

$(document).ready(function() {
	console.log('Document Ready');
	$('#results').hide(); //Hide the results box
	$("#advanced").hide();
	$('#error').hide();

	$('#advancedOptions').click(function() {
		$("#advanced").toggle();
	})

	$("#submit").click(function(){
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

			printMaxes(oneRM);
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
	});
});

/*------------------- CONSTRUCTORS ----------------------------*/

function Lift(liftName) {
	this.liftName=liftName;
	this.set = new Array();
	this.set = [0,0,0,0];
};

function Day(dayName) {
	this.dayName=dayName;
};

function Week(number) {
	this.number=number;
};

/*------------------- FUNCTIONS ----------------------------*/

function fillDownSets(topSet, sets) {
	var setArray = new Array();
	for (i=sets-1; i>-1; i--) {
		setArray[i] = topSet * (1 - (rampingPercent*(sets-i-1)));
	};
	return setArray;
};

function calc1RM (weight, reps, sets) {
	var max = weight/(1.0278-(0.0278*reps));
	max = max*(1+((sets-1)*0.0235));
	max = max.toFixed(1);
	return max;
};

function calcxRM (weight, reps) {
	return weight*(1.0278-(0.0278*reps));
};

function xRound (num, digit) {
	return (num % digit) >= (digit/2) ? parseInt(num / digit) * digit + digit : parseInt(num / digit) * digit;
};

function digitRound(num, digit) {
	digit = Math.pow(10, digit);
	return Math.round(num / digit) * digit;
}

function checkInput(name, weight, reps, sets) {
	if (!isNaN(weight) == true) {
		console.info(name + " weight is a number");
	} else {
		console.warn(name + " weight is not a number");
		$('#output').removeClass('output');
		$('#output').addClass('error');
		$('#output').html(name + " weight is not a number!");
		return(false);
	};
	if (!isNaN(reps) == true) {
		console.info(name + " reps is a number");
	} else {
		console.warn(name + " reps is not a number");
		$('#output').removeClass('output');
		$('#output').addClass('error');
		$('#output').html(name + " reps is not a number!");
		return(false);
	};
	if (!isNaN(sets) == true) {
		console.info(name + " sets is a number");
	} else {
		console.warn(name + " sets is not a number");
		$('#output').removeClass('output');
		$('#output').addClass('error');
		$('#output').html(name + " sets is not a number!");
		return(false);
	};
};

function checkSmallVars(smallest, ramp, length, increase) {
	if (!isNaN(smallest) == true) {
		console.info("Smallest weight is a number");
	} else {
		console.warn("Smallest weight is not a number");
		$('#errorOutput').html("Smallest weight is not a number!");
		$('#error').fadeIn('slow');
		return(false);
	};
	if (!isNaN(ramp) == true) {
		console.info("Ramping percent is a number");
	} else {
		console.warn("Ramping percent is not a number");
		$('#errorOutput').html("Ramping percent is not a number!");
		$('#error').fadeIn('slow');
		return(false);
	};
	if (!isNaN(length) == true) {
		console.info("Program length is a number");
	} else {
		console.warn("Program length is not a number");
		$('#errorOutput').html("Program length is not a number!");
		$('#error').fadeIn('slow');
		return(false);
	};
	if (!isNaN(increase) == true) {
		console.info("Increase percent is a number");
	} else {
		console.warn("Increase percent is not a number");
		$('#errorOutput').html("Increase percent is not a number!");
		$('#error').fadeIn('slow');
		return(false);
	};

	if (ramp > 0.20 || ramp < 0.001) {
		$('#errorOutput').html("Using that value as a ramping percentage is highly unrecommended!");
		$('#error').fadeIn('slow');
		return(false);
	}

	if (smallest > 25) {
		$('#errorOutput').html("The smallest plate you have is a " + smallest + "?");
		$('#error').fadeIn('slow');
		return(false);
	} else {
		smallestIncrement = smallestIncrement*2;
	}

	if (length > 18) {
		$('#errorOutput').html("Running this program for more than 18 weeks without a reset is very ambitious.");
		$('#error').fadeIn('slow');
		return(false);
	}

	if (increase > 1.10) {
		$('#errorOutput').html("Using that value as an increase percentage is highly unrecommended!");
		$('#error').fadeIn('slow');
		return(false);
	}
}

function printMaxes(oneRM) {
	$('#output').html(
						'<table class="excerciseTable"><tr class="outputHeaders"><td class="wide">Lift</td>'
						+ '<td class="">One Rep Max</td><td class="">Five Rep Max</td></tr>'
						+ '<tr class="outputRow"><td>Squat</td><td class="">' + digitRound(oneRM[0], 0) + '</td>'
						+ '<td>' + digitRound(calcxRM(oneRM[0], 5), 0) + '</td></tr>' 
						+ '<tr class="outputRow"><td>Bench</td><td>' + digitRound(oneRM[1], 0) + '</td>' 
						+ '<td>' + digitRound(calcxRM(oneRM[1], 5), 0) + '</td></tr>'
						+ '<tr class="outputRow"><td>Deadlift</td><td>' + digitRound(oneRM[2], 0)  + '</td>'
						+ '<td>' + digitRound(calcxRM(oneRM[2], 5), 0)  + '</td></tr>'
						+ '<tr class="outputRow"><td>Row</td><td>' + digitRound(oneRM[3], 0)  + '</td>'
						+ '<td>' + digitRound(calcxRM(oneRM[3], 5), 0)  + '</td></tr>'
						+ '<tr class="outputRow"><td>Incline</td><td>' + digitRound(oneRM[4], 0)  + '</td>'
						+ '<td>' + digitRound(calcxRM(oneRM[4], 5), 0)  + '</td>'
						+ '</tr></table>'
					 );
};

function printExcerciseTables(week, day, exercise) {
	var output = '<table class="excerciseTable"><tr><td class="liftType" colspan="2">' 
				 + weeks[week].Week[day][exercise].liftName 
				 + '</td></tr><tr><td class="repsCell">Reps</td><td class="weightCell">' 
				 + 'Weight</td></tr>';

	for (i=0; i<weeks[week].Week[day][exercise].set.length; i++) {
		output = output + '<tr><td class="repsCell">' + weeks[week].Week[day].reps[i] + '</td><td class="weightCell">' + xRound(weeks[week].Week[day][exercise].set[i], smallestIncrement) + "</td></tr>";
	};
	output = output + "</table>";
	return(output);
};

function printMonday(week) {
	return	(
				'<div class="tableDivider"><table class="dayTable monday">'
				+ '<tr><td class="title labelText" colspan="3">Monday</td></tr><tr><td class="ex1">' 
				+ printExcerciseTables(week, "monday", "squat") + '</td><td class="ex2">'
				+ printExcerciseTables(week, "monday", "bench") + '</td><td class="ex3">'
				+ printExcerciseTables(week, "monday", "row") + '</td></tr>'
				+ '<tr><td colspan="3" class="assistanceWork tableSpacer">'
				+ 'Weighted Hyperextensions - 2 sets of 8-12 reps<br>'
				+ 'Weighted Decline Situps - 4 sets of 8-15 reps</td></tr>'
				+ '</table></div>'
			);
};

function printWednesday(week) {
	return	(
				'<div class="tableDivider"><table class="dayTable wednesday">'
				+ '<tr><td class="title labelText" colspan="3">Wednesday</td></tr><tr><td class="ex1">' 
				+ printExcerciseTables(week, "wednesday", "squat") + '</td><td class="ex2">' 
				+ printExcerciseTables(week, "wednesday", "incline") + '</td><td class="ex3">'
				+ printExcerciseTables(week, "wednesday", "dead") + '</td></tr>'
				+ '<tr><td colspan="3" class="assistanceWork tableSpacer">'
				+ 'Situps - 3 sets of 8-15 reps</td></tr>'
				+ '</table></div>'
			);
};

function printFriday(week) {
	return	(
				'<div class="tableDivider"><table class="dayTable friday">'
				+ '<tr><td class="title labelText" colspan="3">Friday</td></tr><tr><td class="ex1">'
				+ printExcerciseTables(week, "friday", "squat") + '</td><td class="ex2">' 
				+ printExcerciseTables(week, "friday", "bench") + '</td><td class="ex3">'
				+ printExcerciseTables(week, "friday", "row") + '</td></tr>'
				+ '<tr><td colspan="3" class="assistanceWork tableSpacer">'
				+ 'Weighted Dips - 3 sets of 5-8 reps<br>'
				+ 'Barbell curls - 3 sets of 8-12 reps<br>'
				+ 'Triceps Extensions - 3 sets of 8-12 reps</td></tr>'
				+ '</table></div>'
			);
};

function printWeek(week) {
	return('<div class="bubble"><div id="header">Week ' + (week+1) + '</div><div class="dayContainer">' + printMonday(week) + printWednesday(week) + printFriday(week) + '</div><div id="footer"></div></div>');
};

function printAll() {
	for (var i=0; i<programLength; i++) {
		console.info(i);
		$('#tables').append(printWeek(i));
	};
};