var squatApp = angular.module( "squatApp", [] );

squatApp.value( "exerciseData", [
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
] );

squatApp.value( "exerciseOptions", {
    "Smallest Plate" : 2.5,
    "Ramping %" : 12.5,
    "Program Length" : 12,
    "Increase %" : 2.5
} );