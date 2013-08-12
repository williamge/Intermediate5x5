$(document).ready(function() {
	console.log('Document Ready');
	$('#results').hide();

	$("#submit").click(function(){
		console.info('Submit button clicked');

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

		var oneRM = new Array;

		var increment = 0.125;

		var inputIsClean = true;

		if (checkInput(squatInput[0], squatInput[1], squatInput[2], squatInput[3]) == false || checkInput(benchInput[0], benchInput[1], benchInput[2], benchInput[3]) == false || checkInput(deadInput[0], deadInput[1], deadInput[2], deadInput[3]) == false || checkInput(rowInput[0], rowInput[1], rowInput[2], rowInput[3]) == false ||	checkInput(inclineInput[0], inclineInput[1], inclineInput[2], inclineInput[3]) == false) {
			inputIsClean = false;
		};

		if (inputIsClean == true) {
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
		};


		var empty = [[1,1],[1,1],[1,1],[1,1],[1,1]];

		var weeks = new Array();

		for (week=0; week<10; week++) {
			weeks[week] = new Week(week);
			weeks[week].Week = {
				monday: new Day('Monday'),
				wednesday: new Day('Wednesday'),
				friday: new Day('Friday')
			};
			weeks[week].Week.monday = {
				squat: new Lift('Squat'),
				bench: new Lift('Bench'),
				row: new Lift('Row')
			};
			weeks[week].Week.wednesday = {
				squat: new Lift('Squat'),
				incline: new Lift('Incline'),
				dead: new Lift('Deadlift')
			};
			weeks[week].Week.friday = {
				squat: new Lift('Squat'),
				bench: new Lift('Bench'),
				row: new Lift('Row')
			};
		};

		weeks[0].Week.monday.squat.set = fillDownSets(calcxRM(squatMax,5)*0.925, 5);
		weeks[0].Week.monday.bench.set = fillDownSets(calcxRM(benchMax,5)*0.925, 5);
		weeks[0].Week.monday.row.set = fillDownSets(calcxRM(rowMax,5)*0.925, 5);

		for (week=1; week<10; week++) {
			weeks[week].Week.monday.squat.set = fillDownSets(weeks[week-1].Week.monday.squat.set[4]*1.025, 5);
			weeks[week].Week.monday.row.set = fillDownSets(weeks[week-1].Week.monday.row.set[4]*1.025, 5);
			weeks[week].Week.monday.bench.set = fillDownSets(weeks[week-1].Week.monday.bench.set[4]*1.025, 5);

		}

		weeks[0].Week.wednesday.squat.set = fillDownSets(weeks[0].Week.monday.squat.set[2], 3);
		weeks[0].Week.wednesday.squat.set[3] = weeks[0].Week.monday.squat.set[2];
		weeks[0].Week.wednesday.incline.set = fillDownSets(calcxRM(incMax,5)*0.925, 4);
		weeks[0].Week.wednesday.dead.set = fillDownSets(calcxRM(deadMax,5)*0.925, 4);

		weeks[0].Week.friday.squat.set = fillDownSets(weeks[0].Week.monday.squat.set[4]*1.025, 5);
		weeks[0].Week.friday.squat.set[5] = weeks[0].Week.monday.squat.set[2];

		console.log(weeks);
		printMaxes(oneRM);
		$('#results').fadeIn('slow');
	});
});

function fillDownSets(topSet, sets) {
	var setArray = new Array();
	for (i=sets-1; i>-1; i--) {
		setArray[i] = topSet * (1 - (0.125*(sets-i-1)));
	};
	return setArray;
};

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
	digit = Math.pow(10, digit);
	return Math.round(num / digit) * digit;
};

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

function printMaxes(oneRM) {
	$('#output').html('Squat 1RM = ' + xRound(oneRM[0], 0) + ' 5RM = ' + xRound(calcxRM(oneRM[0], 5), 0) + '<br>' +  'Bench 1RM = ' + xRound(oneRM[1], 0) + ' 5RM = ' + xRound(calcxRM(oneRM[1], 5), 0) + '<br>' + 'Deadlift 1RM = ' + xRound(oneRM[2], 0) + ' 5RM = ' + xRound(calcxRM(oneRM[2], 5), 0) + '<br>' + 'Row 1RM = ' + xRound(oneRM[3], 0) + ' 5RM = ' + xRound(calcxRM(oneRM[3], 5), 0) + '<br>' + 'Incline 1RM = ' + xRound(oneRM[4], 0) + ' 5RM = ' + xRound(calcxRM(oneRM[4], 5), 0) + '<br>');
};