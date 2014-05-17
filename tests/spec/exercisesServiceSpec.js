describe("Exercises Service", function() {

  var mock, exercisesService;

  beforeEach( function() {

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

    module("squatApp");

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

});
