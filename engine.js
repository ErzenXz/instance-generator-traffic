// Version 2.0

let running = false;

function getRandomInt(min, max) {
   let minB, maxB;
   minB = Math.ceil(Number(min));
   maxB = Math.floor(Number(max));
   return Math.floor(Math.random() * (maxB - minB + 1)) + minB;
}

let INPUT = "";
let graph = [];

const roads = [
   "main-st",
   "broadwy",
   "park-av",
   "5th-av",
   "lombard",
   "rodeo-dr",
   "abbey-r",
   "champs",
   "la-ramb",
   "oxford",
];

function getData() {
   // Check if the engine is alerdy running

   if (running) {
      alert("The engine is alerdy running, please wait...");
      return false;
   }

   // Get all the data from the input fields

   let duration = document.getElementById("duration").value;
   let intersections = document.getElementById("intersections").value;
   let streets = document.getElementById("streets").value;
   let totalCars = document.getElementById("totalCars").value;
   let bonusPoints = document.getElementById("bonusPoints").value;

   // Validate the data

   if (duration <= 1 || duration > 10000 || duration == "") {
      duration = getRandomInt(1, 10000);
   }
   if (intersections <= 2 || intersections > 100000 || intersections == "") {
      intersections = getRandomInt(2, 100000);
   }
   if (streets <= 2 || streets > 100000 || streets == "") {
      streets = getRandomInt(2, 100000);
   }
   if (totalCars <= 1 || totalCars > 1000 || totalCars == "") {
      totalCars = getRandomInt(1, 1000);
   }
   if (bonusPoints <= 1 || bonusPoints > 1000 || bonusPoints == "") {
      bonusPoints = getRandomInt(1, 1000);
   }

   // document.getElementById("data").classList.add("hidden");
   // document.getElementById("running").classList.remove("hidden");

   // Start the generation process
   // document.getElementById("loading").classList.remove("hidden");

   console.time("Generation time");

   setTimeout(() => {
      generateInputFile(duration, intersections, streets, totalCars, bonusPoints);
   }, 500);

}





function generateInputFile(D, I, S, V, F) {
   running = true;

   let inputFile = "";
   inputFile += `${D} ${I} ${S} ${V} ${F}\n`;

   // generate streets
   let g = 0;
   let set = new Set(); // use a set instead of an array
   for (let i = 0; i < S; i++) {
      let c = i % I;
      if (c == 0) {
         g = g + 1;
      }
      let street = `${i % I} ${(i % I + g) % I} street${i} ${getRandomInt(1, 4)}`; // create a street string
      let reversed = reverseStreet(street); // reverse the street string
      if (!set.has(street) && !set.has(reversed)) { // check if the street or its reverse is not already in the set
         set.add(street); // add the street to the set
         //inputFile += street + "\n"; // uncomment this line if you want to write to the input file
      }
   }

   // a function that reverses a street string
   function reverseStreet(street) {
      let parts = street.split(" "); // split the string by spaces
      let reversed = parts[1] + " " + parts[0] + " " + parts[2] + " " + parts[3]; // swap the first two parts and keep the rest
      return reversed; // return the reversed string
   }


   let arr = Array.from(set); // convert the set to an array

   // Shuffle the array
   arr.sort(() => Math.random() - 0.5);


   // Add the array to the input file
   arr.forEach((element) => {
      inputFile += `${element}\n`;
      graph.push(element);
   });

   if (I < 250 && S < 1000) {
      let graph2 = graph.join("\n");
      createGraph(graph2, "network");
   }

   let carsArr = [];

   // generate cars
   for (let i = 0; i < V; i++) {
      const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
      const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * S)}`);

      let set = new Set(path);
      let clo = [...set]; // Change to path to allow duplicates

      inputFile += `${clo.length} ${clo.join(" ")}\n`;
      carsArr.push(`${clo.length} ${clo.join(" ")}`);
   }

   if (I < 250 && S < 1000) {
      let graph2 = carsArr.join("\n");
      createGraph2(graph2);
   }

   const DATE = new Date();
   let formattedTime =
      DATE.getFullYear() +
      "-" +
      (DATE.getMonth() + 1) +
      "-" +
      DATE.getDate() +
      "-" +
      DATE.getHours() +
      ":" +
      DATE.getMinutes();

   // Create download link for the file
   INPUT = inputFile;
   const blob = new Blob([inputFile], { type: "text/plain" });
   const url = URL.createObjectURL(blob);
   const downloadLink = document.createElement("a");
   downloadLink.href = url;
   downloadLink.download = `D:${formattedTime}.txt`;
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.body.removeChild(downloadLink);

   console.timeEnd("Generation time");

   // if (checkBOXSTATUS) {
   //    solve(INPUT);
   //    // document.getElementById("charts").classList.remove("hidden");
   //    // document.getElementById("loading").classList.add("hidden");
   // } else {
   //    // document.getElementById("data").classList.remove("hidden");
   //    // document.getElementById("running").classList.add("hidden");
   //    // document.getElementById("loading").classList.add("hidden");
   // }

   running = false;

   //return inputFile;
}

// Code for selecting the style of the website


// const select = document.getElementById("css-select");
// const cssLink = document.getElementById("css-file");

// select.addEventListener("change", () => {
//    const selectedValue = select.value;
//    cssLink.href = selectedValue;
// });

// var kinet = new Kinet({ acceleration: 0.07, friction: 0.20, names: ["x", "y"], }); var circle = document.getElementById('circle'); kinet.on('tick', function (instances) { circle.style.transform = `translate3d(${(instances.x.current)}px, ${(instances.y.current)}px, 0) rotateX(${(instances.x.velocity / 2)}deg) rotateY(${(instances.y.velocity / 2)}deg)`; }); document.addEventListener('mousemove', function (event) { kinet.animate('x', event.clientX - window.innerWidth / 2); kinet.animate('y', event.clientY - window.innerHeight / 2); }); kinet.on('start', function () { }); kinet.on('end', function () { });

