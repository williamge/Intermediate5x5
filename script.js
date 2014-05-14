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


/*  Helper function to check if a given number is NaN
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

/*  Helper function to push a value in to an array only if the value is not null/undefined
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