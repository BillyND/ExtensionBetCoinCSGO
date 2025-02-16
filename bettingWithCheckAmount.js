(function () {
  if (window?.location?.href !== "https://csgoempire.com/roulette") return;

  let isRunning = false;
  let isExpanded = true;
  let isHandled = false;
  let betAmount = 0;
  let previousBetType = "";
  let previousBetAmount = 0;
  let isBetted = false;
  let counterWin = 0;
  let totalProfit = 0;
  let totalLost = 0;
  let isPlayLessSide = true;
  let counterLose = 0;
  let maxCounterLose = 0;
  let timeStart = 0;
  let isClickNavigate = false;

  const stopTotalCoinsLost = localStorage.getItem("stopTotalCoinsLost") || 10;
  const betOptions = [0.01, 0.1, 1];
  const elementsToHide = [
    ".fixed.bottom-0.right-0.z-50,mb-lg,mr-lg",
    ".nav-a.relative.ml-sm.flex.gap-xl",
    '[href="/withdraw"]',
    '[href="/deposit"]',
    ".duration-300 mt-xl",
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

  function sleep(time = 1000) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // Toggle the betting process
  const handleToggleBet = () => {
    hideElements(elementsToHide);
    timeStart = Date.now();

    if (!isRunning) {
      const isConfirmStart = confirm("Want to start?");
      if (!isConfirmStart) return;
    }

    isRunning = !isRunning;
    betAmount = parseFloat(betSelect.value);
    const betOptionIndex = betOptions.findIndex((opt) => opt === betAmount) + 1;
    const clearButton = document.querySelector(".button-pill");
    clearButton?.click();

    // Function to inject keyframes for wave animation into the document
    function addWaveAnimation() {
      const styleSheet = document.styleSheets[0];
      const keyframes = `@keyframes wave {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
      }
      70% {
        box-shadow: 0 0 0 20px rgba(0, 123, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
      }
    }`;

      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }

    // Function to update the background color and add wave animation to the startBetButton
    function updateStartBetButtonColor(isRunning) {
      startBetButton.style.setProperty(
        "background-color",
        isRunning ? "red" : "rgb(0, 123, 255)",
        "important"
      );

      // Create and apply the wave animation class if it doesn't already exist
      if (!document.querySelector(".wave-animation")) {
        const style = document.createElement("style");
        style.innerHTML = `
      .wave-animation {
        animation: wave 1s infinite;
      }
    `;
        style.classList.add("wave-animation");
        document.head.appendChild(style);
        addWaveAnimation();
      }

      // Apply or remove the wave animation based on isRunning status
      if (isRunning) {
        startBetButton.classList.add("wave-animation");
      } else {
        startBetButton.classList.remove("wave-animation");
      }
    }

    updateStartBetButtonColor(isRunning);

    startBetButton.textContent = isRunning ? "Stop" : "Start";
    startBetButton.style.setProperty(
      "background-color",
      isRunning ? "red" : "rgb(0, 123, 255)",
      "important"
    );

    const toggleNavigate = async () => {
      const referralButton = document.querySelector('[href="/referrals"]');
      const rouletteButton = document.querySelector('[href="/"]');

      referralButton?.click();
      await sleep(500);
      rouletteButton?.click();
    };

    if (isRunning) {
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
          isHandled = true;

          setTimeout(() => {
            handleBet();
            hideElements(elementsToHide);
          }, 500);
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
    const handleBet = async () => {
      console.clear();

      const betControls = Array.from(
        document.querySelectorAll(".bet-input__controls-inner button")
      );
      const x2Button = betControls[7];
      const currencyAmounts = document.querySelectorAll(
        '[data-testid="currency-amount"]'
      );

      const ctAmount = Number(
        currencyAmounts[2]?.textContent?.replace(",", "")
      );
      const tAmount = Number(currencyAmounts[4]?.textContent?.replace(",", ""));

      const realBetCtButton = document.querySelectorAll(".bet-btn")[0];
      const realBetTButton = document.querySelectorAll(".bet-btn")[2];

      const betCtButton = testModeCheckbox.checked
        ? document.querySelector(".wheel__item.absolute")
        : document.querySelectorAll(".bet-btn")[0];

      const betTButton = testModeCheckbox.checked
        ? document.querySelector(".wheel__item.absolute")
        : document.querySelectorAll(".bet-btn")[2];

      if (isBetted) {
        previousBetAmount = previousBetAmount * 2;

        if (previousBetType === getPreviousRollType()) {
          clearButton?.click();
          counterWin++;
          totalProfit += previousBetAmount;
          saveDataIntoLocalStorage();

          // Reset validation state
          counterLose = 0;
          totalLost = 0;
          previousBetAmount = 0;
          previousBetType = "";
          isBetted = false;

          // Log profit
          console.log("Win, totalProfit: ", totalProfit);
        } else {
          x2Button?.click();
          counterLose++;
          maxCounterLose = Math.max(counterLose, maxCounterLose);
          saveDataIntoLocalStorage();

          if (totalLost <= -stopTotalCoinsLostInput.value) {
            previousBetAmount = 0;
            totalLost = 0;
            clearButton?.click();
          }

          if (totalProfit <= -2 * stopTotalCoinsLostInput.value) {
            clearButton?.click();
            window.location.reload();
            return;
          }

          // Log profit
          console.log("Lose, totalProfit: ", totalProfit);
        }

        // await sleep(2000);
        // toggleNavigate();
      }

      if (isPlayLessSide ? ctAmount > tAmount : ctAmount < tAmount) {
        previousBetType = "coin-t";
        isBetted = true;

        if (!previousBetAmount) {
          previousBetAmount = betAmount;
          betControls[betOptionIndex]?.click();
        }

        totalProfit -= previousBetAmount;
        totalLost -= previousBetAmount;
        betTButton?.click();
        realBetCtButton.style.boxShadow = "";
        realBetTButton.style.boxShadow =
          "rgba(0, 0, 0, 0.16) 0px 1px 11px, rgb(190 106 106) 0px 0px 0px 3px";

        console.log("ctAmount", ctAmount);
        console.log("tAmount", tAmount);
      } else {
        previousBetType = "coin-ct";
        isBetted = true;

        if (!previousBetAmount) {
          previousBetAmount = betAmount;
          betControls[betOptionIndex]?.click();
        }

        totalProfit -= previousBetAmount;
        totalLost -= previousBetAmount;
        betCtButton?.click();
        realBetTButton.style.boxShadow = "";
        realBetCtButton.style.boxShadow =
          "rgba(0, 0, 0, 0.16) 0px 1px 11px, rgb(190 106 106) 0px 0px 0px 3px";

        console.log("ctAmount", ctAmount);
        console.log("tAmount", tAmount);
      }

      totalProfit = parseFloat(totalProfit.toFixed(5));
      totalLost = parseFloat(totalLost.toFixed(5));
      logInfo();
    };
  };

  // Toggle the size of the betting container
  const handleToggleSize = () => {
    isExpanded = !isExpanded;
    betContainer.style.width = isExpanded ? "230px" : "60px";
    betContainer.style.height = isExpanded ? "297.5px" : "30px";
    betContainer.style.paddingTop = isExpanded ? "30px" : "0";
    toggleSizeButton.textContent = isExpanded ? "Close" : "Open";

    [
      wrapSelect,
      wrapTestMode,
      wrapStopProfitLost,
      wrapLessSide,
      wrapTestMode,
      startBetButton,
    ].forEach(
      (el) => (el.style.visibility = isExpanded ? "visible" : "hidden")
    );
  };

  const turnOffSound = () => {
    localStorage?.setItem("fxOn", false);
  };

  // Hide specified elements
  const hideElements = (selectors) => {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.remove();
    });
  };

  // Create an HTML element with specified tag, CSS, and text content
  const createElement = (tag, cssText, textContent = "", attribute) => {
    const el = document.createElement(tag);
    el.style.cssText = cssText;
    el.textContent = textContent;
    if (attribute) {
      el.setAttribute(attribute.name, attribute.value);
    }
    return el;
  };

  // Create a button with specified text, click handler, and styles
  const createButton = (text, onClick, styles = "") => {
    const button = createElement(
      "button",
      `width: 100%; min-width: 200px; padding: 1px 6px; background-color: #007bff; color: #fff; border: none; cursor: pointer; border-radius: 10px; ${styles}`,
      text
    );
    button.addEventListener("click", onClick);
    return button;
  };

  // Create a select element with specified options
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

  // Create an input element with specified placeholder and default value
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

  // Update local storage with stop total coins lost input value
  const updateLocalStorage = () => {
    localStorage.setItem(
      "stopTotalCoinsLost",
      stopTotalCoinsLostInput.value.trim()
    );
  };

  const betContainer = createElement(
    "div",
    `transition: 0.2s; position: fixed; background-color: rgb(206, 206, 206); top: 50px; left: 10px; z-index: 999; padding: 10px; padding-top: 30px; width: 230px; height: fit-content; border: 1px solid black; border-radius: 10px; display: grid; gap: 20px; color: black;`
  );

  const wrapTestMode = createElement(
    "div",
    "display: flex; gap: 12px; align-items: center;"
  );
  const wrapLessSide = createElement(
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
  const labelSelect = createElement("div", "", "C to start");

  const stopTotalCoinsLostInput = createInput(
    "Stop when total coins lost",
    stopTotalCoinsLost
  );
  const labelStopInput = createElement("div", "", "Stop when total C lost");
  stopTotalCoinsLostInput.addEventListener("input", updateLocalStorage);

  wrapStopProfitLost.append(stopTotalCoinsLostInput, labelStopInput);
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
    `width: auto; height: auto; min-width: unset; color: black; cursor: pointer; -webkit-user-select: none; -ms-user-select: none; user-select: none;`,
    "Test mode",
    { name: "for", value: "test-mode-check-box" }
  );

  wrapTestMode.append(testModeCheckbox, testModeLabel);

  const playLessSide = createElement(
    "input",
    "width: auto; height: auto; min-width: unset;",
    "",
    { name: "id", value: "less-side-check-box" }
  );
  playLessSide.type = "checkbox";
  playLessSide.checked = true;

  const playLessSideLabel = createElement(
    "label",
    `width: auto; height: auto; min-width: unset; color: black; cursor: pointer; -webkit-user-select: none; -ms-user-select: none; user-select: none;`,
    "Play less side",
    { name: "for", value: "less-side-check-box" }
  );

  playLessSide.addEventListener("change", (e) => {
    isPlayLessSide = e.target.checked;
  });

  wrapLessSide.append(playLessSide, playLessSideLabel);

  const toggleSizeButton = createButton(
    "Close",
    handleToggleSize,
    "margin-right: 10px; margin-bottom: 1px; position: absolute; top: 3px; left: 4px; width: auto; height: auto; min-width: unset; scale: 1.1"
  );

  betContainer.append(
    wrapSelect,
    wrapStopProfitLost,
    wrapTestMode,
    wrapLessSide,
    startBetButton,
    toggleSizeButton
  );

  document.body.appendChild(betContainer);

  // Get the type of the previous roll
  const getPreviousRollType = () => {
    const previousRolls = Array.from(
      document.querySelectorAll(".previous-rolls-item")
    );
    const lastRoll =
      previousRolls[previousRolls.length - 1]?.children[0].className;

    if (lastRoll.includes("coin-ct")) {
      return "coin-ct";
    }

    if (lastRoll.includes("coin-t")) {
      return "coin-t";
    }
  };

  // Save betting data into local storage
  const saveDataIntoLocalStorage = () => {
    const keyLog = `log-betting-amount-${betAmount}`;
    const now = new Date();

    const formattedTime = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;

    // Calculate timePlay in minutes
    const timePlayMinutes = Math.floor((Date.now() - timeStart) / 60000) || 1;

    // Save data to localStorage
    localStorage.setItem(
      keyLog,
      JSON.stringify({
        time: formattedTime,
        counterWin,
        totalProfit,
        profitPerMinute: totalProfit / timePlayMinutes,
        totalLost,
        maxCounterLose,
        timePlay: `${timePlayMinutes} minutes`,
      })
    );
  };

  // Log betting info to the console
  const logInfo = () => {
    // Calculate timePlay in minutes
    const timePlayMinutes = Math.floor((Date.now() - timeStart) / 60000) || 1;
    const border = "=============================";
    console.log("counterWin:", counterWin);
    console.log("maxCounterLose:", maxCounterLose);
    console.log("totalProfit:", totalProfit);
    console.log("totalLost previous round:", totalLost);
    console.log("timePlay:", `${timePlayMinutes} minutes`);
    console.log("profit per minute:", totalProfit / timePlayMinutes);
    console.log(border);
  };

  hideElements(elementsToHide);
  turnOffSound();
  console.clear();
})();
