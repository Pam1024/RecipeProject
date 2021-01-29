'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}
// Complete the findNumber function below.
function findNumber(arr, k) {
 
    arr.forEach(function(e,i){
        if(i!=0&& e==k ){
            return "YES";
        }
    });
    return "NO";

}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const arrCount = parseInt(readLine().trim(), 10);

    let arr = [];

    for (let i = 0; i < arrCount; i++) {
        const arrItem = parseInt(readLine().trim(), 10);
        arr.push(arrItem);
    }

    const k = parseInt(readLine().trim(), 10);

    const res = findNumber(arr, k);

    ws.write(res + '\n');

    ws.end();
}