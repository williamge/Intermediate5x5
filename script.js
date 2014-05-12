/*------------------- CONSTRUCTORS ----------------------------*/

function Lift( liftName ) {
	this.liftName = liftName;
	this.set = new Array();
	this.set = [0,0,0,0];
};

function Day( dayName, lifts ) {
	this.dayName = dayName;
	this.lift = lifts;
};

function Week( number, days ) {
	this.number = number;
	this.days = days;
};

function Program( weeks ) {
	this.weeks = weeks;
}

/*------------------- FUNCTIONS ----------------------------*/

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