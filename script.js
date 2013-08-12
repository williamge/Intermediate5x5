$(document).ready(function() {
	console.log('Document Ready');
	$('#results').hide();

	$("#submit").click(function(){
		console.info('Submit button clicked');

		var weight = $('input:text[name=weight]').val();
		var reps = $('input:text[name=reps]').val();
		var sets = $('input:text[name=sets]').val();

		var inputIsClean = true;

		if (checkInput(weight, reps, sets) == false) {
			inputIsClean = false;
		};

		if (weight > 1000) {
			inputIsClean = false;
			$('#output').removeClass('output');
			$('#output').addClass('error');
			$('#output').html(weight + "? Really?");
		} else if (reps > 20 || reps <= 0) {
			inputIsClean = false;
			$('#output').removeClass('output');
			$('#output').addClass('error');
			$('#output').html(reps + " reps? Really?");
		} else if (sets > 10 || sets < 1 || sets % 1 != 0) {
			inputIsClean = false;
			$('#output').removeClass('output');
			$('#output').addClass('error');
			$('#output').html(sets + " sets? Really?");
		}

		if (inputIsClean == true) {
			var oneRM = calc1RM(weight, reps, sets);	
			$('#output').addClass('output');
			$('#output').removeClass('error');
			$('#output').html('<p>' + oneRM + '</p><br>');
		};



		$('#results').fadeIn('fast');
	});
});

function calc1RM (weight, reps, sets) {
	var max = weight/(1.0278-(0.0278*reps));
	max = max*(1+((sets-1)*0.0235));
	max = max.toFixed(1);
	console.log(max);
	return max;
};

function calcxRM (weight, reps) {
	return weight*(1.0278-(0.0278*reps));
};

function checkInput(weight, reps, sets) {
	if (!isNaN(weight) == true) {
		console.info("Weight is a number");
	} else {
		console.warn("Weight is not a number");
		$('#output').removeClass('output');
		$('#output').addClass('error');
		$('#output').html("Weight is not a number!");
		return(false);
	};
	if (!isNaN(reps) == true) {
		console.info("Reps is a number");
	} else {
		console.warn("Reps is not a number");
		$('#output').removeClass('output');
		$('#output').addClass('error');
		$('#output').html("Reps is not a number!");
		return(false);
	};
	if (!isNaN(sets) == true) {
		console.info("Sets is a number");
	} else {
		console.warn("Sets is not a number");
		$('#output').removeClass('output');
		$('#output').addClass('error');
		$('#output').html("Sets is not a number!");
		return(false);
	};
};

