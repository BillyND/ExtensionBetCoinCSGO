(function () {
  if (window?.location?.href !== "https://csgoempire.com/roulette") return;

  let isRunning = false;
  let isExpanded = true;
  let isHandled = false;
  let betAmount = 0;
  let previousBetType = "";
  let previousBetAmount = 0;
  let isBetted = false;

  let counterWin = 0,
    totalProfit = 0;

  const stopProfitLost = localStorage.getItem("stopProfitLost") || 10;

  const elementsToHide = [
    ".pt-lg",
    "#empire-footer",
    ".chat--open",
    ".vfm__container",
    ".vfm__overlay",
    ".vfm.vfm--inset.vfm--fixed",
    ".chat-tab--chat-open",
    ".mb-lg.px-lg.-mx-lg.mt-xxl",
    ".duration-300.mt-xl",
    ".support-wrap",
  ];

  // Function to hide specified elements
  const hideElements = (selectors) => {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.remove();
    });
  };

  // Function to create an HTML element with specified tag, CSS, and text content
  const createElement = (tag, cssText, textContent = "", attribute) => {
    const el = document.createElement(tag);
    el.style.cssText = cssText;
    el.textContent = textContent;
    if (attribute) {
      el.setAttribute(attribute.name, attribute.value);
    }
    return el;
  };

  const betOptions = [0.01, 0.1, 1];
  const betContainer = createElement(
    "div",
    `transition: 0.2s; position: fixed; background-color: rgb(206, 206, 206); top: 50px; left: 10px; z-index: 999; padding: 10px;padding-bottom:30px; width: 230px; height: fit-content; border: 1px solid black; border-radius: 10px; display: grid; gap: 20px; color: black;`
  );

  // Function to create a button with specified text, click handler, and styles
  const createButton = (text, onClick, styles = "") => {
    const button = createElement(
      "button",
      `width: 100%; min-width: 200px; padding: 1px 6px; background-color: #007bff; color: #fff; border: none; cursor: pointer; border-radius: 10px; ${styles}`,
      text
    );
    button.addEventListener("click", onClick);
    return button;
  };

  // Function to create a select element with specified options
  const createSelect = (options) => {
    const select = createElement(
      "select",
      `padding: 5px 10px; width: 100%; width: 70px; border-radius: 10px;`
    );
    options.forEach((value) => {
      const option = createElement("option", "", value.toString());
      option.value = value.toString();
      select.appendChild(option);
    });
    return select;
  };

  // Function to create an input element with specified placeholder and default value
  const createInput = (placeholder, defaultValue) => {
    const input = createElement(
      "input",
      `padding: 5px 10px; width: 70px; border-radius: 10px;`,
      ""
    );
    input.placeholder = placeholder;
    input.value = defaultValue.toString();
    return input;
  };

  const wrapTestMode = createElement(
    "div",
    "display: flex; gap: 12px; align-items: center;"
  );
  const wrapSelect = createElement(
    "div",
    "display: flex; gap: 12px; align-items: center;"
  );
  const wrapStopProfitLost = createElement(
    "div",
    "display: flex; gap: 12px; align-items: center;"
  );
  const startBetButton = createButton("Start", handleToggleBet);
  const betSelect = createSelect(betOptions);
  const labelSelect = createElement("div", "", "Coin to betting");
  const betStatusLabel = createElement("label", "width: 100%; color: black;");

  const stopProfitLostInput = createInput("Stop profit lost", stopProfitLost);
  const labelStopInput = createElement("div", "", "Stop profit lost");

  stopProfitLostInput.addEventListener("input", function () {
    localStorage.setItem("stopProfitLost", stopProfitLostInput.value.trim());
  });

  wrapStopProfitLost.append(stopProfitLostInput, labelStopInput);
  wrapSelect.append(betSelect, labelSelect);

  const testModeCheckbox = createElement(
    "input",
    "width: auto; height: auto; min-width: unset;",
    "",
    { name: "id", value: "test-mode-check-box" }
  );
  testModeCheckbox.type = "checkbox";
  testModeCheckbox.checked = true;

  const testModeLabel = createElement(
    "label",
    `width: auto; height: auto; min-width: unset; color: black; cursor: pointer; -webkit-user-select: none; /* Safari */
          -ms-user-select: none; /* IE 10 and IE 11 */
          user-select: none; /* Standard syntax */`,
    "Test mode",
    { name: "for", value: "test-mode-check-box" }
  );

  wrapTestMode.append(testModeCheckbox, testModeLabel);

  const toggleSizeButton = createButton(
    "Close",
    handleToggleSize,
    "margin-right:10px;margin-bottom:1px;position: absolute; bottom: 3px; right: 4px; width: auto; height: auto; min-width: unset;scale:1.1"
  );

  betContainer.append(
    wrapSelect,
    wrapStopProfitLost,
    wrapTestMode,
    betStatusLabel,
    startBetButton,
    toggleSizeButton
  );

  document.body.appendChild(betContainer);

  const getPreviousRollType = () => {
    const previousRolls = Array.from(
      document.querySelectorAll(".previous-rolls-item")
    );

    if (
      previousRolls[previousRolls.length - 1].children[0].className.includes(
        "coin-ct"
      )
    ) {
      return "coin-ct";
    }

    if (
      previousRolls[previousRolls.length - 1].children[0].className.includes(
        "coin-t"
      )
    ) {
      return "coin-t";
    }
  };

  function saveDataIntoLocalStorage() {
    const keyLog = `log-betting-amount-${betAmount}`;
    const logs = JSON.parse(localStorage.getItem(keyLog) || "[]") || [];

    const now = new Date();
    const formattedTime = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;

    logs.push({
      time: formattedTime,
      counterWin,
      totalProfit,
    });

    localStorage.setItem(keyLog, JSON.stringify(logs));
  }

  // Log betting info to the console
  function logInfo() {
    const border = "=============================";
    console.log("counterWin:", counterWin);
    console.log("totalProfit:", totalProfit);
    console.log(border);
  }

  // Toggle the betting process
  function handleToggleBet() {
    hideElements(elementsToHide);

    if (!isRunning) {
      const isConfirmStart = confirm("Want to start?");
      if (!isConfirmStart) return;
    }

    isRunning = !isRunning;
    betAmount = parseFloat(betSelect.value);
    const betOptionIndex = betOptions.findIndex((opt) => opt === betAmount) + 1;
    const clearButton = document.querySelector(".button-pill");
    clearButton?.click();

    startBetButton.textContent = isRunning ? "Stop" : "Start";

    if (isRunning) {
      betStatusLabel.textContent = "Running...";

      const intervalBetCoin = setInterval(() => {
        if (!isRunning) {
          clearInterval(intervalBetCoin);
          return;
        }

        const currentTimeText = JSON.stringify(
          document.querySelectorAll(".text-2xl")[0]?.outerText
        );

        if (
          (currentTimeText?.includes("2,") ||
            currentTimeText?.includes("2.")) &&
          !currentTimeText?.includes("12,") &&
          !currentTimeText?.includes("12.") &&
          !isHandled
        ) {
          handleBet();
          hideElements(elementsToHide);
          isHandled = true;
        } else if (
          (!currentTimeText?.includes("2,") &&
            !currentTimeText?.includes("2.")) ||
          currentTimeText?.includes("12,") ||
          currentTimeText?.includes("12.")
        ) {
          isHandled = false;
        }
      }, 300);
    } else {
      window.location.reload();
    }

    // Handle the betting logic
    function handleBet() {
      const betControls = Array.from(
        document.querySelectorAll(".bet-input__controls-inner button")
      );
      const x2Button = betControls[7];
      const currencyAmounts = document.querySelectorAll(
        '[data-testid="currency-amount"]'
      );

      const ctAmount = Number(currencyAmounts[2]?.textContent);
      const tAmount = Number(currencyAmounts[4]?.textContent);

      const betCtButton = testModeCheckbox.checked
        ? document.querySelector(".wheel__item.absolute")
        : document.querySelectorAll(".bet-btn")[0];

      const betTButton = testModeCheckbox.checked
        ? document.querySelector(".wheel__item.absolute")
        : document.querySelectorAll(".bet-btn")[2];

      // Stop if the difference < 100
      // Or each type < 50
      //   if (Math.abs(ctAmount - tAmount) < 100 || ctAmount < 50 || tAmount < 50) {
      //     return;
      //   }

      if (previousBetType === getPreviousRollType()) {
        if (isBetted) {
          totalProfit += previousBetAmount * 2;
          counterWin++;
          console.log("===> Win, totalProfit", totalProfit);
          saveDataIntoLocalStorage();
        }

        // Reset validation state
        previousBetAmount = 0;
        previousBetType = "";
        isBetted = false;
        clearButton?.click();
      } else {
        if (isBetted) {
          previousBetAmount = previousBetAmount * 2;
          x2Button?.click();
          console.log("===> Lose, totalProfit", totalProfit);
          saveDataIntoLocalStorage();

          if (totalProfit < -stopProfitLost) {
            window.location.reload();
            return;
          }
        }
      }

      if (ctAmount > tAmount) {
        previousBetType = "coin-t";
        isBetted = true;

        if (!previousBetAmount) {
          previousBetAmount = betAmount;
          betControls[betOptionIndex]?.click();
        }

        totalProfit -= previousBetAmount;
        betTButton?.click();
      } else {
        previousBetType = "coin-ct";
        isBetted = true;

        if (!previousBetAmount) {
          previousBetAmount = betAmount;
          betControls[betOptionIndex]?.click();
        }

        totalProfit -= previousBetAmount;
        betCtButton?.click();
      }

      totalProfit = parseFloat(totalProfit.toFixed(5));
      logInfo();
    }
  }

  // Toggle the size of the betting container
  function handleToggleSize() {
    isExpanded = !isExpanded;
    betContainer.style.width = isExpanded ? "230px" : "77px";
    betContainer.style.height = isExpanded ? "157.5px" : "30px";
    betContainer.style.paddingTop = isExpanded ? "10px" : "0";
    toggleSizeButton.textContent = isExpanded ? "Close" : "Open";

    [
      wrapSelect,
      wrapTestMode,
      wrapTestMode,
      startBetButton,
      betStatusLabel,
    ].forEach(
      (el) => (el.style.visibility = isExpanded ? "visible" : "hidden")
    );
  }

  hideElements(elementsToHide);

  setInterval(() => {
    fetch(window.location.href).catch(console.error);
  }, 60000);
})();
