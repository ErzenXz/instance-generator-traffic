let startBtn = document.getElementById("start"),
   canvas = document.getElementById("canvas"),
   fileInput = document.getElementById("file"),
   selectOption = document.getElementById("menu"),
   data = [];
function parseCars(e) {
   try {
      let t = [];
      for (let a in e) {
         let n = e[a],
            l = [];
         for (let r of Object.values(n)) {
            let o = r;
            l.push(o);
         }
         t.push(l);
      }
      return t;
   } catch (s) {
      alert("An error occured while parsing the file!\nIs the file in the correct format?");
   }
}
function createLineChart3(e) {
   try {
      for (
         var t = document.getElementById("chart").getContext("2d"), a = [], n = [], l = 0;
         l < e.length;
         l++
      ) {
         for (var r = e[l], o = [], s = [], i = [], c = 0; c < r.length; c++) {
            var d = r[c];
            !1 === a.includes(c) && a.push(c),
               s.push(d.secondsToFinish),
               i.push(d.action),
               o.push(d.streetId);
         }
         var h = {
            label: "Car " + (l + 1),
            data: o,
            fill: !1,
            borderColor:
               "rgba(" +
               Math.floor(256 * Math.random()) +
               "," +
               Math.floor(256 * Math.random()) +
               "," +
               Math.floor(256 * Math.random()) +
               ",1)",
            times: s,
            status: i,
         };
         n.push(h);
      }
      return new Chart(t, {
         type: "line",
         data: {
            labels: a,
            datasets: n.map((e) => ({
               label: e.label,
               data: e.data,
               fill: !1,
               borderColor: e.status.map((e) => ("waiting" === e ? "red" : "green")),
               times: e.times,
               status: e.status,
            })),
         },
         options: {
            title: { display: !0, text: "Cars by street and time" },
            scales: {
               yAxes: [{ scaleLabel: { display: !0, labelString: "Car" } }],
               xAxes: [{ scaleLabel: { display: !0, labelString: "Time (seconds)" } }],
            },
            tooltips: {
               callbacks: {
                  label: function (e, t) {
                     var a,
                        n = t.datasets[e.datasetIndex],
                        l = n.times[e.index];
                     return `Time: ${l}s, Status: ${n.status[e.index]}, Street ID: ${
                        n.data[e.index]
                     }`;
                  },
               },
            },
         },
      });
   } catch (g) {
      alert("An error occured while creating the chart!\nIs the file in the correct format?");
   }
}
function countCarsByStreetAndTime(e) {
   try {
      for (var t = {}, a = 0; a < e.length; a++)
         for (var n = e[a], l = 0; l < n.length; l++) {
            var r = n[l],
               o = r.streetName,
               s = r.secondsToFinish;
            t[o] || (t[o] = {}), t[o][s] || (t[o][s] = 0), t[o][s]++;
         }
      return t;
   } catch (i) {
      alert("An error occured while counting the cars!\nIs the file in the correct format?");
   }
}
function createLineChart(e) {
   try {
      for (
         var t = document.getElementById("chart").getContext("2d"),
            a = countCarsByStreetAndTime(e),
            n = Object.keys(a),
            l = [],
            r = 1;
         r <= 3;
         r++
      ) {
         for (var o = [], s = 0; s < n.length; s++) {
            var i = a[n[s]][r] || 0;
            o.push(i);
         }
         var c = {
            label: "Time " + r,
            data: o,
            fill: !1,
            borderColor:
               "rgba(" +
               Math.floor(256 * Math.random()) +
               "," +
               Math.floor(256 * Math.random()) +
               "," +
               Math.floor(256 * Math.random()) +
               ",1)",
         };
         l.push(c);
      }
      return new Chart(t, {
         type: "line",
         data: { labels: n, datasets: l },
         options: {
            title: { display: !0, text: "Cars by street and time" },
            scales: {
               yAxes: [{ scaleLabel: { display: !0, labelString: "Number of cars" } }],
               xAxes: [{ scaleLabel: { display: !0, labelString: "Street name" } }],
            },
         },
      });
   } catch (d) {
      alert("An error occured while creating the chart!\nIs the file in the correct format?");
   }
}
function createLineChart2(e) {
   try {
      for (
         var t = document.getElementById("chart").getContext("2d"), a = [], n = [], l = 0;
         l < e.length;
         l++
      ) {
         for (var r = e[l], o = [], s = [], i = 0; i < r.length; i++) {
            var c = r[i];
            !1 === a.includes(i) && a.push(i),
               o.push(c.action),
               "Derriopes" === c.streetName
                  ? s.push("red")
                  : "Lipjan" === c.streetName
                  ? s.push("green")
                  : "Lipjan1" === c.streetName
                  ? s.push("blue")
                  : s.push("black");
         }
         var d = {
            label: "Car " + (l + 1),
            data: o,
            fill: !1,
            borderColor: s,
            pointBackgroundColor: s,
         };
         n.push(d);
      }
      return new Chart(t, {
         type: "line",
         data: { labels: a, datasets: n },
         options: {
            title: { display: !0, text: "Cars by action and street" },
            scales: {
               y: {
                  type: "category",
                  labels: ["moving", "waiting"],
                  scaleLabel: { display: !0, labelString: "Action" },
               },
               x: {
                  type: "time",
                  ticks: { autoSkip: !0, maxTicksLimit: 20 },
                  display: !0,
                  scaleLabel: { display: !0, labelString: "Time (seconds)" },
               },
            },
         },
      });
   } catch (h) {
      alert("An error occured while creating the chart!\nIs the file in the correct format?");
   }
}
startBtn.addEventListener("click", () => {
   try {
      let e = fileInput.files[0],
         t = new FileReader();
      (t.onload = function (e) {
         let a = t.result,
            n = JSON.parse(a),
            l = parseCars(n);
         data = l;
         let r = selectOption.options[selectOption.selectedIndex].value,
            o = Chart.getChart("chart");
         switch ((o && o.destroy(), r)) {
            case "1":
               createLineChart(l);
               break;
            case "2":
               createLineChart2(l);
               break;
            default:
               createLineChart3(l);
         }
         createTable(l);
      }),
         t.readAsText(e);
   } catch (a) {
      alert("Please choose a file!");
   }
});
const body = document.querySelector("body"),
   modeToggle = body.querySelector("#theme-switcher");
let getMode = localStorage.getItem("mode");
function createTable(e) {
   try {
      var t = document.getElementById("table");
      for (let a = 0; a < e.length; a++) {
         let n = e[a],
            l = [],
            r = [],
            o = [],
            s = n[0].action,
            i = n[0].streetName,
            c = n.length,
            d = 1;
         for (let h = 1; h < n.length; h++) {
            let g = n[h].action;
            if (g === s && n[h].streetName === i) {
               (s = g), d++, h === n.length - 1 && (l.push(`${s}`), r.push(d), o.push(i));
               continue;
            }
            l.push(`${s}`), r.push(d), o.push(i), (s = g), (d = 1), (i = n[h].streetName);
         }
         let u = document.createElement("tr"),
            f = document.createElement("td");
         (f.textContent = "Car " + (a + 1)), u.appendChild(f);
         for (let m = 0; m < l.length; m++) {
            let p = document.createElement("td");
            (p.textContent = l[m] + " for " + r[m] + " seconds on " + o[m]), u.appendChild(p);
         }
         let y = document.createElement("td");
         (y.textContent = "Total time: " + c + " seconds"), u.appendChild(y), t.appendChild(u);
      }
      let b = document.getElementById("info");
      b.textContent = "Total cars: " + e.length;
      let $ = 0;
      for (let C = 0; C < e.length; C++) $ += e[C].length;
      b.textContent += ", Total time: " + $ + " seconds";
      let x = $ / e.length;
      b.textContent += ", Average time: " + x + " seconds";
      let v = 0;
      for (let I = 0; I < e.length; I++) e[I].length > v && (v = e[I].length);
      b.textContent += ", Max time: " + v + " seconds";
      let w = v;
      for (let _ = 0; _ < e.length; _++) e[_].length < w && (w = e[_].length);
      b.textContent += ", Min time: " + w + " seconds";
      let L = 0;
      for (let T = 0; T < e.length; T++) {
         let A = e[T],
            k = A[0].action,
            E = 0;
         for (let B = 1; B < A.length; B++) {
            let S = A[B].action;
            if (S === k) {
               (k = S), E++, B === A.length - 1 && (L += E);
               continue;
            }
            (k = S), (E = 0);
         }
      }
      b.textContent += ", Total waiting time: " + L + " seconds";
      let N = L / e.length;
      b.textContent += ", Average waiting time: " + Math.round(N) + " seconds";
      let M = 0;
      for (let O = 0; O < e.length; O++) {
         let j = e[O],
            q = j[0].action,
            D = 0;
         for (let F = 1; F < j.length; F++) {
            let P = j[F].action;
            if (P === q) {
               (q = P), D++, F === j.length - 1 && D > M && (M = D);
               continue;
            }
            (q = P), (D = 0);
         }
      }
      b.textContent += ", Max waiting time: " + M + " seconds";
      let z = M;
      for (let G = 0; G < e.length; G++) {
         let H = e[G],
            J = H[0].action,
            K = 0;
         for (let Q = 1; Q < H.length; Q++) {
            let R = H[Q].action;
            if (R === J) {
               (J = R), K++, Q === H.length - 1 && K < z && (z = K);
               continue;
            }
            (J = R), (K = 0);
         }
      }
      b.textContent += ", Min waiting time: " + z + " seconds.";
   } catch (U) {
      alert("An error occured while creating the table!\nIs the file in the correct format?");
   }
}
function downloadTable() {
   let e = document.getElementById("table"),
      t = "";
   for (let a = 0; a < e.rows.length; a++) {
      let n = e.rows[a];
      for (let l = 0; l < n.cells.length; l++) t += n.cells[l].textContent + " ";
      t += "\n";
   }
   download("table.txt", t);
}
function download(e, t) {
   var a = document.createElement("a");
   a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(t)),
      a.setAttribute("download", e),
      (a.style.display = "none"),
      document.body.appendChild(a),
      a.click(),
      document.body.removeChild(a);
}
getMode && "dark" === getMode && body.classList.toggle("dark"),
   modeToggle.addEventListener("click", () => {
      body.classList.toggle("dark"),
         body.classList.contains("dark")
            ? localStorage.setItem("mode", "dark")
            : localStorage.setItem("mode", "light");
   });
