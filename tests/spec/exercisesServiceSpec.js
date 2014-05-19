define( [
  "angular",
  "angular-mocks",
  "app",
  "exercisesService"
],  function( angular, app ) {


      describe("Exercises Service", function() {

        var mock, exercisesService;

        beforeEach( function() {

          module("squatApp");

          module(function($provide) {
              $provide.value("exerciseData",  [
                {
                    "type" : "Squat",
                    "key" : "squat",
                    "prefix" : "s",
                    "weight" : 225,
                    "reps": 5,
                    "sets": 1
                },
                {
                    "type" : "Bench Press",
                    "key" : "bench",
                    "prefix" : "b",
                    "weight" : 185,
                    "reps": 5,
                    "sets": 1
                },
                {
                    "type" : "Deadlift",
                    "key" : "dead",
                    "prefix" : "d",
                    "weight" : 315,
                    "reps": 5,
                    "sets": 1
                },      
                {
                    "type" : "Barbell Row",
                    "key" : "row",
                    "prefix" : "r",
                    "weight" : 135,
                    "reps": 5,
                    "sets": 1
                },
                {
                    "type" : "Incline Bench",
                    "key" : "incline",
                    "prefix" : "i",
                    "weight" : 95,
                    "reps": 5,
                    "sets": 1
                }
              ]);

              $provide.value( "exerciseOptions", {
                  "Smallest Plate" : 2.5,
                  "Ramping %" : 12.5,
                  "Program Length" : 12,
                  "Increase %" : 2.5
              } );
            });

          inject( function( $injector ) {
            exercisesService = $injector.get( "exercisesService" );
          } );
        } );

        it("should throw an error if it can't find an exercise", function() {

          expect( 
            function() {
              exercisesService.getExercise( "exercise that is clearly not in there" )
            } 
          ).toThrowError();

          expect( 
            function() {
              exercisesService.getExerciseName( "exercise that is clearly not in there" )
            } 
          ).toThrowError();

        });

        it("should return an exercise if it can find an exercise", function() {

          expect( exercisesService.getExercise( "Squat" ).type )
          .toEqual( "Squat" );

          expect( exercisesService.getExercise( "Incline Bench" ).type )
          .toEqual( "Incline Bench" );

          expect( exercisesService.getExercise( "Incline Bench" ).weight )
          .toEqual( 95 );

        });

        it("should return an exercise name if it can find an exercise", function() {

          expect( exercisesService.getExerciseName( "squat" ) )
          .toEqual( "Squat" );

          expect( exercisesService.getExerciseName( "incline" ) )
          .toEqual( "Incline Bench" );
        });

        describe("should return errors if the exercise inputs are bad ", function() {

          it("should return errors if a number is too high", function() {
            exercisesService.getExercise( "Squat" ).weight = "string";

            expect( exercisesService.checkInputs().length )
            .toEqual(1);

            expect( exercisesService.checkData().length )
            .toEqual(1);
          });

        });

        it("should not return errors if the exercise inputs are good ", function() {

          expect( exercisesService.checkInputs().length )
          .not.toBeTruthy();

          expect( exercisesService.checkData().length )
          .not.toBeTruthy();
          
        });

        describe("should return errors if the exercise options are bad ", function() {

          it("should return errors if a number is too high", function() {
            exercisesService.options[ "Ramping %" ] = 50;

            expect( exercisesService.checkOptions().length )
            .toEqual(1);

            expect( exercisesService.checkData().length )
            .toEqual(1);
          });

          it("should return errors if an option is NaN", function() {
            exercisesService.options[ "Program Length" ] = "string";
            exercisesService.options[ "Ramping %" ] = "string";
            exercisesService.options[ "Program Length" ] = "string";
            exercisesService.options[ "Increase %" ] = "string";

            expect( exercisesService.checkOptions().length )
            .toEqual(3);

            expect( exercisesService.checkData().length )
            .toEqual(3);
          });

        });

        it("should not return errors if the exercise options are good ", function() {

          expect( exercisesService.checkInputs().length )
          .not.toBeTruthy();

          expect( exercisesService.checkData().length )
          .not.toBeTruthy();
          
        });

        describe("should return the correct amounts for rep maximums", function() {

          it("for squats", function() {

            var repMaxes = exercisesService.calcRepMaxes();
            console.log(repMaxes);

            expect( repMaxes["Squat"].oneRep )
            .toBeCloseTo(253.2, 1);

            expect( repMaxes["Squat"].fiveRep )
            .toBeCloseTo(199.98, 1);

          });

          it("for bench presses", function() {

            var repMaxes = exercisesService.calcRepMaxes();
            console.log(repMaxes);

            expect( repMaxes["Bench Press"].oneRep )
            .toBeCloseTo(208.1, 1);

            expect( repMaxes["Bench Press"].fiveRep )
            .toBeCloseTo(164.4, 1);

          });

          it("for deadlifts", function() {

            var repMaxes = exercisesService.calcRepMaxes();
            console.log(repMaxes);

            expect( repMaxes["Deadlift"].oneRep )
            .toBeCloseTo(354.4, 1);

            expect( repMaxes["Deadlift"].fiveRep )
            .toBeCloseTo(280, 1);

          });

          it("for barbell rows", function() {

            var repMaxes = exercisesService.calcRepMaxes();
            console.log(repMaxes);

            expect( repMaxes["Barbell Row"].oneRep )
            .toBeCloseTo(151.9, 1);

            expect( repMaxes["Barbell Row"].fiveRep )
            .toBeCloseTo(120, 1);

          });

          it("for incline benches", function() {

            var repMaxes = exercisesService.calcRepMaxes();
            console.log(repMaxes);

            expect( repMaxes["Incline Bench"].oneRep )
            .toBeCloseTo(106.9, 1);

            expect( repMaxes["Incline Bench"].fiveRep )
            .toBeCloseTo(84.4, 1);

          });
          
        });


      });

    } 
);
