let startBtn = document.getElementById("start");
let canvas = document.getElementById("canvas");

let fileInput = document.getElementById("file");

let selectOption = document.getElementById("menu");

let data = [];

startBtn.addEventListener("click", () => {
   let file = fileInput.files[0];
   let reader = new FileReader();

   reader.onload = function (e) {
      let text = reader.result;
      // Parse the JSON string into a JS object
      let json = JSON.parse(text);

      // Parse the data into a list of cars

      let carData = parseCars(json);

      data = carData;

      let choosenOption = selectOption.options[selectOption.selectedIndex].value;

      // Destroy the previous chart

      let chart = Chart.getChart("chart");
      if (chart) {
         chart.destroy();
      }

      switch (choosenOption) {
         case "1":
            createLineChart(carData);
            break;
         case "2":
            createLineChart2(carData);
            break;
         default:
            createLineChart3(carData);
      }
   };

   reader.readAsText(file);
});

function parseCars(json) {
   let cars = [];

   // Loop through all the cars, they are in an object of objects
   for (let car in json) {
      let carData = json[car];

      let car1 = [];

      // Loop through carData its object
      for (let data of Object.values(carData)) {
         let car = data;

         car1.push(car);
      }

      cars.push(car1);
   }

   return cars;
}

function createLineChart3(cars) {
   // Get the canvas element where the chart will be rendered
   var ctx = document.getElementById("chart").getContext("2d");
   // Create an array of labels for the x-axis (time)
   var labels = [];
   // Create an array of datasets, one for each car
   var datasets = [];
   // Loop through the cars array
   for (var i = 0; i < cars.length; i++) {
      // Get the current car array
      var car = cars[i];
      // Create an array of data points for the y-axis (number of cars)
      var data = [];
      // Loop through the car array
      for (var j = 0; j < car.length; j++) {
         // Get the current car object
         var obj = car[j];
         // If this is the first car, add the secondsToFinish to the labels array
         if (i === 0) {
            labels.push(obj.secondsToFinish);
         }
         // Add the streetId to the data array
         data.push(obj.streetId);
      }
      // Create a dataset object for the current car
      var dataset = {
         label: "Car " + (i + 1),
         data: data,
         fill: false,
         borderColor:
            "rgba(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ",1)",
      };
      // Add the dataset object to the datasets array
      datasets.push(dataset);
   }
   // Create a new chart instance
   var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
      // The data for our dataset
      data: {
         labels: labels,
         datasets: datasets,
      },
      // Configuration options go here
      options: {
         title: {
            display: true,
            text: "Cars by street and time",
         },
         scales: {
            yAxes: [
               {
                  scaleLabel: {
                     display: true,
                     labelString: "Street ID",
                  },
               },
            ],
            xAxes: [
               {
                  scaleLabel: {
                     display: true,
                     labelString: "Time (seconds)",
                  },
               },
            ],
         },
      },
   });
   // Return the chart instance
   return chart;
}

function countCarsByStreetAndTime(cars) {
   // An object to store the counts for each street and time
   var counts = {};
   // Loop through the cars array
   for (var i = 0; i < cars.length; i++) {
      // Get the current car array
      var car = cars[i];
      // Loop through the car array
      for (var j = 0; j < car.length; j++) {
         // Get the current car object
         var obj = car[j];
         // Get the street name and the seconds to finish of the car
         var street = obj.streetName;
         var time = obj.secondsToFinish;
         // If the street name is not in the counts object, initialize it to an empty object
         if (!counts[street]) {
            counts[street] = {};
         }
         // If the time is not in the counts object for the street, initialize it to zero
         if (!counts[street][time]) {
            counts[street][time] = 0;
         }
         // Increment the count for the street and time by one
         counts[street][time]++;
      }
   }
   // Return the counts object
   return counts;
}

// A function to create a line chart with graph.js
function createLineChart(cars) {
   // Get the canvas element where the chart will be rendered
   var ctx = document.getElementById("chart").getContext("2d");
   // Get the counts of cars by street and time
   var counts = countCarsByStreetAndTime(cars);
   // Create an array of street names for the labels
   var labels = Object.keys(counts);
   // Create an array of datasets, one for each time
   var datasets = [];
   // Loop through the possible times from 1 to 3
   for (var t = 1; t <= 3; t++) {
      // Create an array of data points for the y-axis (number of cars)
      var data = [];
      // Loop through the labels array
      for (var k = 0; k < labels.length; k++) {
         // Get the current street name
         var street = labels[k];
         // Get the count for the street and time, or zero if not found
         var count = counts[street][t] || 0;
         // Add the count to the data array
         data.push(count);
      }
      // Create a dataset object for the current time
      var dataset = {
         label: "Time " + t,
         data: data,
         fill: false,
         borderColor:
            "rgba(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ",1)",
      };
      // Add the dataset object to the datasets array
      datasets.push(dataset);
   }
   // Create a new chart instance
   var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
      // The data for our dataset
      data: {
         labels: labels,
         datasets: datasets,
      },
      // Configuration options go here
      options: {
         title: {
            display: true,
            text: "Cars by street and time",
         },
         scales: {
            yAxes: [
               {
                  scaleLabel: {
                     display: true,
                     labelString: "Number of cars",
                  },
               },
            ],
            xAxes: [
               {
                  scaleLabel: {
                     display: true,
                     labelString: "Street name",
                  },
               },
            ],
         },
      },
   });
   // Return the chart instance
   return chart;
}

// A function to create a line chart with graph.js
function createLineChart2(cars) {
   // Get the canvas element where the chart will be rendered
   var ctx = document.getElementById("chart").getContext("2d");
   // Create an array of labels for the x-axis (time)
   var labels = [];
   // Create an array of datasets, one for each car
   var datasets = [];
   // Loop through the cars array
   for (var i = 0; i < cars.length; i++) {
      // Get the current car array
      var car = cars[i];
      // Create an array of data points for the y-axis (action)
      var data = [];
      // Create an array of colors for the line (street name)
      var colors = [];
      // Loop through the car array
      for (var j = 0; j < car.length; j++) {
         // Get the current car object
         var obj = car[j];
         // If this is the first car, add the secondsToFinish to the labels array
         if (i === 0) {
            labels.push(obj.secondsToFinish);
         }
         // Add the action to the data array
         data.push(obj.action);
         // Add the color based on the street name to the colors array
         if (obj.streetName === "Derriopes") {
            colors.push("red");
         } else if (obj.streetName === "Lipjan") {
            colors.push("green");
         } else if (obj.streetName === "Lipjan1") {
            colors.push("blue");
         } else {
            colors.push("black");
         }
      }
      // Create a dataset object for the current car
      var dataset = {
         label: "Car " + (i + 1),
         data: data,
         fill: false,
         borderColor: colors,
         pointBackgroundColor: colors,
      };
      // Add the dataset object to the datasets array
      datasets.push(dataset);
   }
   // Create a new chart instance
   var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
      // The data for our dataset
      data: {
         labels: labels,
         datasets: datasets,
      },
      // Configuration options go here
      options: {
         title: {
            display: true,
            text: "Cars by action and street",
         },
         scales: {
            y: {
               // instead of yAxes: [{
               type: "category",
               labels: ["moving", "waiting"],
               scaleLabel: {
                  display: true,
                  labelString: "Action",
               },
            }, // remove the closing bracket here
            x: {
               // instead of xAxes: [{
               type: "time",
               ticks: {
                  autoSkip: true,
                  maxTicksLimit: 20,
               },
               display: true,
               scaleLabel: {
                  display: true,
                  labelString: "Time (seconds)",
               },
            }, // remove the closing bracket here
         },
      },
   });
   // Return the chart instance
   return chart;
}

const body = document.querySelector("body"),
   modeToggle = body.querySelector("#theme-switcher");

let getMode = localStorage.getItem("mode");

if (getMode && getMode === "dark") {
   body.classList.toggle("dark");
}

modeToggle.addEventListener("click", () => {
   body.classList.toggle("dark");
   if (body.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
   } else {
      localStorage.setItem("mode", "light");
   }
});
