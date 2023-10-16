let data = [5, 4, 3, 5, 6, 7, 2, 5, 8, 8, 9];

console.log(data);

function mergeSort(arr) {
    if (arr.length < 2)
        return arr;

    var middle = parseInt(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}


function insertionSort(inputArr) {
    let n = inputArr.length;
    for (let i = 1; i < n; i++) {
        // Choosing the first element in our unsorted subarray
        let current = inputArr[i];
        // The last element of our sorted subarray
        let j = i - 1;
        while ((j > -1) && (current < inputArr[j])) {
            inputArr[j + 1] = inputArr[j];
            j--;
        }
        inputArr[j + 1] = current;
    }
    return inputArr;
}


let DATA = [];

function testAl(items) {

    DATA = [];

    for (let i = 0; i < items; i++) {
        DATA.push(Math.floor(Math.random() * 1000000));
    }

    let start = new Date().getTime();

    // mergeSort(DATA);
    // DATA.sort((a, b) => a - b);
    insertionSort(DATA);

    let end = new Date().getTime();

    console.log(`Time: ${end - start} ms`);

}

