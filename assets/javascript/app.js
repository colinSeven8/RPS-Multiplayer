// Colin Reesor
// Firebase homework
// Train Scheduler

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAn4Gm-shFkFQ6TaSPVQcTmhJNOoUKOyUc",
    authDomain: "rpsmultiplayer-6e63d.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-6e63d.firebaseio.com",
    projectId: "rpsmultiplayer-6e63d",
    storageBucket: "",
    messagingSenderId: "276930039409",
    appId: "1:276930039409:web:d0039e3ad93dbe8f3795d0"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// Database reference
let database = firebase.database();

// Fires when the user adds a new train
$("#add-train").on("click", function (event) {

    //Handle the Submit button
    event.preventDefault();

    // Get the user input
    let trainName = $("#train-name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let firstTrainTime = $("#first-train-time-input").val().trim();
    let frequency = $("#frequency-input").val().trim();

    // Pass values to database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
    });
});

// Fires whenever a new train is added
database.ref().on("child_added", function (snapshot) {

    // Get the values in the snapshot
    let snap = snapshot.val();

    // The current time and the time for the first train, which is set to 1 year previous
    let currentTime = moment();
    let firstTime = moment(snap.firstTrainTime, "HH:mm").subtract(1, 'years');
    let trainFrequency = snap.frequency;

    // Difference between current time and first time in minutes
    let timeDifference = moment().diff(moment(firstTime), "minutes");

    // Actual time between trains
    let timeBetween = timeDifference % trainFrequency;

    // Minutes until next train
    let timeUntilNextTrain = trainFrequency - timeBetween;

    // Next Train and formatted arrival time
    let nextTrain = moment().add(timeUntilNextTrain, "minutes");
    let nextArrival = moment(nextTrain).format("h:mm a");

    // Database array from snapshot
    let dbArray = [snap.trainName, snap.destination, snap.frequency, nextArrival, timeUntilNextTrain];

    // Row element
    let tr = $("<tr>");

    //Loop through database arrray, appending new data to the DOM
    for (let i = 0; i < dbArray.length; i++) {

        let td = $('<td>');
        td.append(dbArray[i]);
        $(tr).append(td);
    }

    // Append new rows to the table body
    $('tbody').append(tr);

    // Error handling
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});