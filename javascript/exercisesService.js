define( [
    "app",
    "helpers"
],  function( squatApp, helpers ) {

        squatApp.factory( "exercisesService", [ "exerciseData", "exerciseOptions",
            function( exerciseData, optionsData ) {

                var exerciseTypes = [];
                var exerciseKeyToType = {};
                var exercises = {};

                for ( var i = 0; i < exerciseData.length; i++ ) {
                    exerciseTypes.push( exerciseData[i].type );
                    exercises[ exerciseData[i].type ] = exerciseData[i];
                    exerciseKeyToType[ exerciseData[i].key ] = exerciseData[i].type;
                }

                /*------------------- CONSTRUCTORS ----------------------------*/

                function Lift( liftName ) {
                    this.liftName = liftName;
                    this.set = [];
                    this.set = [0,0,0,0];
                }

                function Day( dayName, lifts ) {
                    this.dayName = dayName;
                    this.lift = lifts;
                }

                function Week( number, days ) {
                    this.number = number;
                    this.days = days;
                }

                function Program( weeks ) {
                    this.weeks = weeks;
                }


                function calcOneRM ( exercise ) {
                    var max = exercise.weight/(1.0278-(0.0278*exercise.reps));
                    max = max*(1+((exercise.sets-1)*0.0235));
                    max = max.toFixed(1);
                    return max;
                }

                function calcFiveRM ( exercise ) {
                    return helpers.calcxRM( exercise.weight, 5 );
                }

                /*  Performs calculations of set weights based off of a previous set and the ramping percentage.
                    
                    Arguments:  (Array) topSet: previous set full of weights
                                (Number) sets: number of sets to fill out from topSet
                                (Number) rampingPercent: the ramping percentage to use
                    
                    Returns:    (Array) of filled out sets calculated from topSet and rampingPercent
                */
                var fillDownSets = function( topSet, sets, rampingPercent ) {
                    var setArray = [];
                    for (i=sets-1; i>-1; i--) {
                        setArray[i] = topSet * (1 - (rampingPercent*(sets-i-1)));
                    }
                    return setArray;
                };

                return {
                    exercises: exerciseData,
                    exerciseTypes: exerciseTypes,
                    options: optionsData,

                    /*  Returns the exercise object given the name of the exercise
                        
                        Arguments:  (String) name: name of the exercise to return
                        
                        Returns:    (Object) of the exercise taken from window._squatData.exercise

                        Throws:     (Error) when name is not found in the loaded exercises
                    */
                    getExercise: function( name ) {
                        if ( !exercises[ name ] ) {
                            throw new Error("Exercise \"" + name + "\" not found");
                        }
                        return exercises[ name ];
                    },

                    /*  Returns the exercise name for an object based off of its key
                        
                        Arguments:  (String) exerciseKey: key of the exercise to return
                        
                        Returns:    (String) name of the exercise with key 'exerciseKey'

                        Throws:     (Error) when exerciseKey is not found in the loaded exercises
                    */
                    getExerciseName: function( exerciseKey ) {
                        if ( !exerciseKeyToType[ exerciseKey ] ) {
                            throw new Error("Exercise key \"" + exerciseKey + "\" not found");
                        }
                        return exerciseKeyToType[ exerciseKey ];
                    },

                    /*  Returns an Array of any errors in the inputs given to the service
                         
                        Arguments:  None (given implicitly in the service object)
                        
                        Returns:    (Array) of strings for any errors in the inputs that are found
                    */
                    checkInputs: function() {

                        var errors = [];

                        for ( var exerciseKey in exercises ) {
                            var exercise = exercises[ exerciseKey ];
                            var lookupType = [ "weight", "reps", "sets" ];

                            for ( var i in lookupType ) {
                                helpers.pushValue( 
                                    helpers.checkForNaN( 
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

                    /*  Returns an Array of any errors in the options given to the service
                        
                        Arguments:  None (given implicitly in the service object)
                        
                        Returns:    (Array) of strings for any errors in the options that are found
                    */
                    checkOptions: function() {
                        var errors = [];

                        //check each option to ensure they are numbers
                        for ( var optionKey in optionsData ) {
                            helpers.pushValue( 
                                helpers.checkForNaN( 
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

                        if (helpers.digitRound( optionsData["Program Length"] , 0) > 18) {
                            errors.push( "Running this program for more than 18 weeks without a reset is very ambitious." );
                            return errors;
                        }

                        if ( optionsData["Increase %"] /100 > 1.10) {
                            errors.push( "Using that value as an increase percentage is highly unrecommended!" );
                            return errors;
                        }

                        return errors;
                    },
                    checkData: function() {
                        return this.checkInputs().concat( this.checkOptions() );
                    },

                    /*  Returns an Object of the max reps for the given inputs and options in the service.
                        
                        Arguments:  None (given implicitly in the service object)
                        
                        Returns:    (Object) of form: 
                        {
                            [exerciseKey]: {
                                oneRep: (Number) max weight for one rep,
                                fiveRep: (Number) max weight for five reps
                            }
                        }
                    */
                    calcRepMaxes: function() {

                        var repMaxes = {};

                        for ( var exerciseKey in exercises ) {
                            var exercise = exercises[ exerciseKey ];

                            repMaxes[exerciseKey] = {
                                oneRep : calcOneRM( exercise ),
                                fiveRep : calcFiveRM( exercise )
                            };
                        }

                        return repMaxes;
                    },

                    /*  Returns an Object corresponding to a complete program based off of the given inputs and 
                        options to the service.
                        
                        Arguments:  None (given implicitly in the service object)
                        
                        Returns:    (Object) of form: [Nope I'm not describing it, too big of a mess, sorry]
                    */
                    getProgram: function() {

                        var output = {
                            errors: this.checkData(),
                            program: []
                        };

                        if ( output.errors.length ) {
                            return output;
                        } else {
                            
                            //TODO: clean this out, this is way too complicated of everything

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
                                    reps: [],
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
                                    reps: [],
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
                                    reps: [],
                                    asstWork: [
                                        "Weighted Dips - 3 sets of 5-8 reps",
                                        "Barbell curls - 3 sets of 8-12 reps",
                                        "Triceps Extensions - 3 sets of 8-12 reps"
                                    ]
                                };
                            }

                            //TODO: move this to a class, this is really stupid needing this when it's used elsewhere
                            //just a helper function to construct an exercise object
                            var makeExercise = function ( weight ) {
                                return {
                                    weight: weight
                                };
                            };

                            weeks[0].Week.Monday.exercises.squat.set = fillDownSets( calcFiveRM( makeExercise(squatMax) ) * 0.925, 5, rampingPercent );
                            weeks[0].Week.Monday.exercises.bench.set = fillDownSets( calcFiveRM( makeExercise(benchMax) ) * 0.925, 5, rampingPercent );
                            weeks[0].Week.Monday.exercises.row.set = fillDownSets( calcFiveRM( makeExercise(rowMax)) * 0.925, 5, rampingPercent );
                            weeks[0].Week.Monday.reps = [5,5,5,5,5];

                            weeks[0].Week.Wednesday.exercises.squat.set = fillDownSets( weeks[0].Week.Monday.exercises.squat.set[2], 3, rampingPercent );
                            weeks[0].Week.Wednesday.exercises.squat.set[3] = weeks[0].Week.Monday.exercises.squat.set[2];
                            weeks[0].Week.Wednesday.exercises.incline.set = fillDownSets( calcFiveRM( makeExercise(incMax) ) * 0.925, 4, rampingPercent );
                            weeks[0].Week.Wednesday.exercises.dead.set = fillDownSets( calcFiveRM( makeExercise(deadMax) ) * 0.925, 4, rampingPercent );
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

                            output.program = weeks;

                        }
                        return output;
                    } 
                };
            }
        ]);

    }
);