/*--- GLOBAL VARIABLES ---*/

var rampingPercent = 0.125;
var smallestIncrement = 5;
var programLength = 10;
var weeks = new Array();

$(document).ready(function() {
	console.log('Document Ready');
	$('#results').hide(); //Hide the results box
	$('#error').hide();

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