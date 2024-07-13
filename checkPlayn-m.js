// Retrieve an array of children elements from a specified grid in the page layout
const startBetting = 10;
const stopBetting = 60;
const keyProfit = `${startBetting}${stopBetting}`;
let gridItems = Array.from(
  document.querySelector(".page-layout__inner > div > .grid").children
);
let noBonusItemCount = 0;
let consecutiveCount = 0;
let countTimeBetting = 0;
let totalProfit = Number(localStorage?.getItem(keyProfit)) || 0;

const amountIfWon = [
  0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14, 0.14,
  0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.28, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56,
  0.56, 1.12, 1.12, 1.12, 1.12, 1.12, 1.12, 1.12, 2.24, 2.24, 2.24, 2.24, 2.24,
  2.24, 2.24, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 4.48, 8.96, 8.96, 8.96, 8.96,
  8.96, 8.96, 8.96, 17.92, 17.92, 17.92, 17.92, 17.92, 17.92, 17.92, 35.84,
  35.84, 35.84, 35.84, 35.84, 35.84, 35.84, 71.68, 71.68, 71.68, 71.68, 71.68,
  71.68, 71.68, 143.36, 143.36, 143.36, 143.36, 143.36, 143.36, 143.36, 286.72,
  286.72, 286.72, 286.72, 286.72, 286.72, 286.72, 573.44, 573.44, 573.44,
  573.44, 573.44, 573.44, 573.44, 1146.88, 1146.88, 1146.88,
];

const betValues = [
  0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01,
  0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04,
  0.04, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.16, 0.16, 0.16, 0.16, 0.16,
  0.16, 0.16, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.64, 0.64, 0.64, 0.64,
  0.64, 0.64, 0.64, 1.28, 1.28, 1.28, 1.28, 1.28, 1.28, 1.28, 2.56, 2.56, 2.56,
  2.56, 2.56, 2.56, 2.56, 5.12, 5.12, 5.12, 5.12, 5.12, 5.12, 5.12, 10.24,
  10.24, 10.24, 10.24, 10.24, 10.24, 10.24, 20.48, 20.48, 20.48, 20.48, 20.48,
  20.48, 20.48, 40.96, 40.96, 40.96, 40.96, 40.96, 40.96, 40.96,
];

// Initialize an array to store distances between 'bonus' items
const bonusDistances = [];

// Iterate over each item in the grid
gridItems.forEach((item) => {
  // Check if the item is a 'bonus' item
  if (item.children[0].alt.includes("bonus")) {
    if (noBonusItemCount >= startBetting && noBonusItemCount <= stopBetting) {
      totalProfit += amountIfWon[countTimeBetting];
    }

    // If it is a 'bonus' item, push the current count to the distances array
    bonusDistances.push(noBonusItemCount);

    // Reset the counter
    noBonusItemCount = 0;
    countTimeBetting = 0;
  } else {
    // If it is not a 'bonus' item, increment the counter
    noBonusItemCount++;

    if (noBonusItemCount >= startBetting && noBonusItemCount <= stopBetting) {
      countTimeBetting++;
      totalProfit -= betValues[countTimeBetting];
    } else {
      countTimeBetting = 0;
    }
  }
});

// localStorage?.setItem(keyProfit, totalProfit)
totalProfit = parseFloat(totalProfit.toFixed(5));

bonusDistances.sort((a, b) => b - a);

bonusDistances.forEach((distance) => {
  console.log(distance);
});

console.log("===>bonusDistances:", bonusDistances.length);
console.log("===>totalProfit:", totalProfit);
