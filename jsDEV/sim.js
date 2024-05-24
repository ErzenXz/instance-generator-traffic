let startBtn = document.getElementById("start");
let canvas = document.getElementById("canvas");

let fileInput = document.getElementById("file");

let selectOption = document.getElementById("menu");

let data = [];

startBtn.addEventListener("click", () => {
   try {
      let file = fileInput.files[0];
      let reader = new FileReader();

      reader.onload = function (e) {
         let text = reader.result;
         // Parse the JSON string into a JS object
         let json = JSON.parse(text);

         // Parse the data into a list of cars

         let carData = parseCars(json);

         data = carData;

         createTable(carData);
      };

      reader.readAsText(file);
   } catch (error) {
      alert("Please choose a file!");
   }
});

function parseCars(json) {
   try {
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
   } catch (error) {
      alert("An error occured while parsing the file!\nIs the file in the correct format?");
   }
}

function countCarsByStreetAndTime(cars) {
   try {
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
   } catch (error) {
      alert("An error occured while counting the cars!\nIs the file in the correct format?");
   }
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

// Function to create a table with the data

function createTable(data) {
   try {
      // Get the table element
      var table = document.getElementById("table");

      for (let i = 0; i < data.length; i++) {
         console.log(data[i]);
         let car = data[i];

         let status = [];
         let times = [];
         let streetNames = [];
         let currentTime = 0;

         let lastAction = car[0].action;
         let lastStreet = car[0].streetName;

         let totaoTime = car.length;

         let time = 1;
         let bonus = 0;

         for (let j = 1; j < car.length; j++) {
            let action = car[j].action;

            if (action === lastAction && car[j].streetName === lastStreet) {
               lastAction = action;
               time++;

               if (j === car.length - 1) {
                  if (lastAction === "waiting") {
                     status.push(`W`);
                  } else {
                     status.push(`M`);
                  }

                  times.push(time);
                  streetNames.push(lastStreet);
               }

               continue;
            } else {
               if (lastAction === "waiting") {
                  status.push(`W`);
               } else {
                  status.push(`M`);
               }
               times.push(time);
               streetNames.push(lastStreet);

               lastAction = action;
               time = 1;
               lastStreet = car[j].streetName;
            }
         }

         if (times[0] < 10) {
            bonus = 10 - times[0];
         }

         if (i === 0) {
            let header = document.createElement("tr");
            let cell = document.createElement("th");
            cell.textContent = "Car number";
            header.appendChild(cell);

            for (let k = 0; k < status.length; k++) {
               let cell = document.createElement("th");
               cell.textContent = "Status / Total time";
               header.appendChild(cell);
            }

            let cell3 = document.createElement("th");
            cell3.textContent = "Total time";
            header.appendChild(cell3);

            table.appendChild(header);
         }

         // Create a new row element
         let row = document.createElement("tr");
         // Create a new cell element for the car number
         let cell = document.createElement("td");
         // Set the cell text to the car number
         cell.textContent = i + 1;
         // Append the cell to the row
         row.appendChild(cell);

         for (let k = 0; k < status.length; k++) {
            let cell = document.createElement("td");

            // Calculating the score for each car, if the car arrives before the bonus time, give it bonus po ints
            if (status[k] === "M") {
               cell.style.backgroundColor = "#4a8e46";
            } else {
               cell.style.backgroundColor = "#e8876d";
            }

            cell.textContent = status[k] + " " + times[k] + "s " + streetNames[k];
            row.appendChild(cell);
         }

         let cell3 = document.createElement("td");
         cell3.textContent = "Total time: " + totaoTime + " seconds";
         row.appendChild(cell3);

         let cell4 = document.createElement("td");
         cell4.textContent = "Bonus: " + bonus + " points";
         row.appendChild(cell4);
         // Append the row to the table
         table.appendChild(row);
      }

      // Info about the results

      let p = document.getElementById("info");

      p.textContent = " Total cars: " + data.length;

      let total = 0;

      for (let i = 0; i < data.length; i++) {
         total += data[i].length;
      }

      p.textContent += "\n Total time: " + total + " seconds";

      let average = total / data.length;

      p.textContent += "\n Average time: " + average + " seconds";

      let max = 0;

      for (let i = 0; i < data.length; i++) {
         if (data[i].length > max) {
            max = data[i].length;
         }
      }

      p.textContent += "\n Max time: " + max + " seconds";

      let min = max;

      for (let i = 0; i < data.length; i++) {
         if (data[i].length < min) {
            min = data[i].length;
         }
      }

      p.textContent += "\n Min time: " + min + " seconds";

      let totalWaiting = 0;

      for (let i = 0; i < data.length; i++) {
         let car = data[i];

         let lastAction = car[0].action;

         let time = 0;

         for (let j = 1; j < car.length; j++) {
            let action = car[j].action;

            if (action === lastAction) {
               lastAction = action;
               time++;

               if (j === car.length - 1) {
                  totalWaiting += time;
               }

               continue;
            } else {
               lastAction = action;
               time = 0;
            }
         }
      }

      p.textContent += "\n Total waiting time: " + totalWaiting + " seconds";

      let averageWaiting = totalWaiting / data.length;

      p.textContent += "\n Average waiting time: " + Math.round(averageWaiting) + " seconds";

      let maxWaiting = 0;

      for (let i = 0; i < data.length; i++) {
         let car = data[i];

         let lastAction = car[0].action;

         let time = 0;

         for (let j = 1; j < car.length; j++) {
            let action = car[j].action;

            if (action === lastAction) {
               lastAction = action;
               time++;

               if (j === car.length - 1) {
                  if (time > maxWaiting) {
                     maxWaiting = time;
                  }
               }

               continue;
            } else {
               lastAction = action;
               time = 0;
            }
         }
      }

      p.textContent += "\n Max waiting time: " + maxWaiting + " seconds";

      let minWaiting = maxWaiting;

      for (let i = 0; i < data.length; i++) {
         let car = data[i];

         let lastAction = car[0].action;

         let time = 0;

         for (let j = 1; j < car.length; j++) {
            let action = car[j].action;

            if (action === lastAction) {
               lastAction = action;
               time++;

               if (j === car.length - 1) {
                  if (time < minWaiting) {
                     minWaiting = time;
                  }
               }

               continue;
            } else {
               lastAction = action;
               time = 0;
            }
         }
      }

      p.textContent += "\n Min waiting time: " + minWaiting + " seconds.";

      // let counts = countCarsByStreetAndTime(data);

      // let streets = Object.keys(counts);

      // let table2 = document.getElementById("table2");

      // let header = document.createElement("tr");
      // let cell = document.createElement("th");
      // cell.textContent = "Street name";
      // header.appendChild(cell);

      // for (let i = 0; i < 50; i++) {
      //    let cell = document.createElement("th");
      //    cell.textContent = i;
      //    header.appendChild(cell);
      // }

      // table2.appendChild(header);

      // for (let i = 0; i < streets.length; i++) {
      //    let street = streets[i];

      //    let row = document.createElement("tr");
      //    let cell = document.createElement("td");
      //    cell.textContent = street;
      //    row.appendChild(cell);

      //    let streetCounts = counts[street];

      //    for (let j = 0; j < 50; j++) {
      //       let cell = document.createElement("td");

      //       if (streetCounts[j]) {
      //          cell.textContent = streetCounts[j];
      //       } else {
      //          cell.textContent = 0;
      //       }

      //       row.appendChild(cell);
      //    }

      //    table2.appendChild(row);
      // }

      // Calculate the average time for each street

      let table3 = document.getElementById("table3");

      let header = document.createElement("tr");
      let cell = document.createElement("th");
      cell.textContent = "Street name";
      header.appendChild(cell);

      let cell2 = document.createElement("th");
      cell2.textContent = "Average time";
      header.appendChild(cell2);

      table3.appendChild(header);

      let counts = countCarsByStreetAndTime(data);

      let streets = Object.keys(counts);

      for (let i = 0; i < streets.length; i++) {
         let street = streets[i];

         let streetCounts = counts[street];

         let total = 0;
         let count = 0;

         for (let j = 0; j < 50; j++) {
            if (streetCounts[j]) {
               total += streetCounts[j] * j;
               count += streetCounts[j];
            }
         }

         let row = document.createElement("tr");
         let cell = document.createElement("td");
         cell.textContent = street;
         row.appendChild(cell);

         let cell2 = document.createElement("td");
         cell2.textContent = Math.round(total / count) + " seconds";
         row.appendChild(cell2);

         table3.appendChild(row);
      }

      // Calculate the average waiting time for each street

      let table4 = document.getElementById("table4");

      let header2 = document.createElement("tr");
      let cell3 = document.createElement("th");
      cell3.textContent = "Street name";
      header2.appendChild(cell3);

      let cell4 = document.createElement("th");
      cell4.textContent = "Average waiting time";
      header2.appendChild(cell4);

      table4.appendChild(header2);

      for (let i = 0; i < streets.length; i++) {
         let street = streets[i];

         let streetCounts = counts[street];

         let total = 0;
         let count = 0;

         for (let j = 0; j < 50; j++) {
            if (streetCounts[j]) {
               total += streetCounts[j] * j;
               count += streetCounts[j];
            }
         }

         let row = document.createElement("tr");
         let cell = document.createElement("td");
         cell.textContent = street;
         row.appendChild(cell);

         let cell2 = document.createElement("td");
         cell2.textContent = Math.round(total / count) + " seconds";
         row.appendChild(cell2);

         table4.appendChild(row);
      }
   } catch (error) {
      alert("An error occured while creating the table!\nIs the file in the correct format?");
   }
}

// Function to download the table as txt file

function downloadTable() {
   let table = document.getElementById("table");

   let text = "";

   for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i];

      for (let j = 0; j < row.cells.length; j++) {
         let cell = row.cells[j];

         text += cell.textContent + " ";
      }

      text += "\n";
   }

   let filename = "table.txt";

   download(filename, text);
}

function download(filename, text) {
   var element = document.createElement("a");
   element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
   element.setAttribute("download", filename);

   element.style.display = "none";
   document.body.appendChild(element);

   element.click();

   document.body.removeChild(element);
}

let downloadBtn = document.getElementById("download-btn");

downloadBtn.addEventListener("click", () => {
   downloadTable();
});
