
squatApp.controller( "exercises", [ "$scope", "$http", "exercisesService",
    function( $scope, $http, exercisesService ) {

        $scope.exercisesList = exercisesService.exercises;
    }
]);

squatApp.controller( "options", [ "$scope", "$http", "exercisesService", 
    function( $scope, $http, exercisesService ) {

        $scope.showOptions = false;

        $scope.options = exercisesService.options;

        $scope.toggleOptions = function() {
            $scope.showOptions = !$scope.showOptions;
        };
    }
]);

squatApp.controller( "mainCtrl", [ "$scope", "$http", "exercisesService", 
    function( $scope, $http, exercisesService ) {
        $scope.resultsRows = [];
        $scope.tables = [];

        /*  Sets the $scope.resultsRow object for max reps given the object 
            returned by exercisesService.calcRepMaxes().
         */
        $scope.setMaxes = function( repMaxes ) {
            $scope.resultsRows = [];

            for (var exRepKey in repMaxes) {
                var exRep = repMaxes[ exRepKey ];

                $scope.resultsRows.push(
                    {
                        lift : exRepKey,
                        oneRep : digitRound(  exRep.oneRep , 0 ),
                        fiveRep : digitRound( exRep.fiveRep , 0 )
                    }
                );      
            }

        };

        /*  Performs calculations of workout schedule based off of user input from exercisesService,
            gets the complete program through exercisesService.getProgram() and formats the data to 
            a more usable state for the view, storing the data in "$scope.tables".
        */
        $scope.submit = function() {
            console.info('Submit button clicked'); // logging

            $scope.tables = [];
            $scope.resultsRows = [];

            $scope.errors = exercisesService.checkInputs();
            $scope.errors = $scope.errors.concat( exercisesService.checkOptions() );

            // Validate all user input  
            if ( $scope.errors.length ) {
                console.log("BAD INPUT");
            } else {

                var repMaxes = exercisesService.calcRepMaxes();

                $scope.setMaxes( repMaxes );

                //TODO: bring this back but angularized
                //$('#results').fadeIn('slow');


                //TODO: find out what this even does or why you would want this
                var empty = [[1,1],[1,1],[1,1],[1,1],[1,1]];

                var weeks = exercisesService.getProgram();

                /*  Helper functions to bring the 'weeks' object returned by exercisesService.getProgram()
                    in to a better format for rendering in AngularJS.
                    
                    Arguments: (Object) weeks: a weeks object returned by exercisesService.getProgram()

                    Returns: An Array of weeks (as specified by the Object returned by "formatWeek")
                 */ 
                function formatWeeks( weeks ) {

                    /*  Formats a week in to a more convenient form.
                        
                        Arguments: (Object) week: a Week object returned by exercisesService.getProgram().weeks[i]

                        Returns: An Array of days (as specified by the Object returned by "formatDay")
                     */ 
                    function formatWeek( week ) {
                        var week$ = {
                            days: [],
                            number: parseInt( weekNum ) + 1
                        };

                        for ( var dayKey in week ) {
                            var day = week[ dayKey ];

                            

                            week$.days.push( formatDay( day, dayKey ) );
                        }

                        return week$;
                    }

                    /*  Formats a day in to a more convenient form.
                        
                        Arguments:  (Object) day: a Day object returned by 
                                        exercisesService.getProgram().weeks[i].Week["Monday" through "Friday"]
                                    (String) dayKey: a string that serves as the key for which day it is in the 
                                        getProgram() returned Object, also serves as the name of the day

                        Returns: An Object of the form: 
                        {
                            name: (String) name of the day,
                            exercises: (List of [Exercise]) list of exercises as defined by formatExercises
                            assistanceWork: (List of [String]) list of strings for assistance work for a day
                        }
                     */ 
                    function formatDay( day, dayKey ) {
                        var day$ = {
                            name: dayKey,
                            exercises: [],
                            assistanceWork: day.asstWork
                        };

                        day$.exercises = formatExercises( day.exercises, day );

                        return day$;
                    }

                    /*  Formats a list of exercises in to a more convenient form.
                        
                        Arguments:  (Array) exercises: a List of exercises as returned by
                                        exercisesService.getProgram().weeks[i].Week[...].exercises
                                    (Object) day: the day for the exercises in 'exercises', as defined by
                                        exercisesService.getProgram().weeks[i].Week["Monday" through "Friday"]

                        Returns: An Array of Objects of the form: 
                        {
                            name: (String) name of the exercise,
                            sets: (Array) [
                                {
                                    weight: (Number) weight to be lifted,
                                    reps: (Number) number of reps for that weight for this exercise
                                }
                            ]
                        }
                     */ 
                    function formatExercises( exercises, day ) {
                        var exercisesFormatted = [];

                        for ( exKey_ in exercises ) {
                            var ex_ = exercises[ exKey_ ];

                            var exercise$ = {
                                name: exercisesService.getExerciseName( exKey_ ),
                                sets: []
                            };

                            for ( setNum in ex_.set ) {
                                var set$ = {
                                    weight: xRound( ex_.set[setNum], exercisesService.options["Smallest Plate"] ),
                                    reps: day.reps[setNum]
                                }

                                exercise$.sets.push( set$ );
                            }

                            exercisesFormatted.push( exercise$ );
                        }

                        return exercisesFormatted;
                    }

                    var weeks$ = [];

                    for (var weekNum in weeks) {
                        var week = weeks[weekNum].Week;

                        weeks$.push( formatWeek( week ) );
                    }

                    return weeks$;
                }

                $scope.tables = formatWeeks( weeks );

                //TODO: Re-implement this functionality but angularized
                //$('html, body').animate({scrollTop: $('#results').offset().top}, 1000);
                //$('#results').fadeIn('2000');


            };
        };
    }
]);

