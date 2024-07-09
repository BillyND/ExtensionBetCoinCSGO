(function () {
  setTimeout(() => {
    if (window?.location?.href !== "https://csgoempire.com/roulette") return;

    // Check if no bonus coin is present in the previous rolls
    const isNoHasBonusCoin = () => {
      const previousRolls = Array.from(
        document.querySelectorAll(".previous-rolls-item")
      );

      const itemHasBonusCoin = previousRolls.filter((i) =>
        i.children[0].className.includes("coin-bonus")
      );

      return !itemHasBonusCoin.length;
    };

    let isRunning = false;
    let betCounter = 0;
    let isExpanded = true;
    let isHandled = false;
    let betAmount = 0;
    let preBetAmount = betAmount;
    let isBetted = false;
    let counterDelayPlay = isNoHasBonusCoin() ? 10 : 0;
    const counterToStart = localStorage.getItem("counterToStartBetting") || 20; // Default value
    const counterToStop = localStorage.getItem("counterToStopBetting") || 40; // Default value

    let counterWin = 0,
      totalProfit = 0;

    const elementsToHide = [
      ".bet-containers",
      ".pt-lg",
      "#empire-footer",
      ".chat--open",
      ".vfm__container",
      ".vfm__overlay",
      ".vfm.vfm--inset.vfm--fixed",
      ".chat-tab--chat-open",
      ".mb-lg.px-lg.-mx-lg.mt-xxl",
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
      `transition: 0.2s; position: fixed; background-color: rgb(206, 206, 206); top: 10px; left: 10px; z-index: 999; padding: 10px;padding-bottom:30px; width: 230px; height: fit-content; border: 1px solid black; border-radius: 10px; display: grid; gap: 20px; color: black;`
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
    const wrapStartInput = createElement(
      "div",
      "display: flex; gap: 12px; align-items: center;"
    );
    const wrapStopInput = createElement(
      "div",
      "display: flex; gap: 12px; align-items: center;"
    );
    const startBetButton = createButton("Start", handleToggleBet);
    const betSelect = createSelect(betOptions);
    const labelSelect = createElement("div", "", "Coin to betting");
    const counterToStartInput = createInput("Counter to Start", counterToStart);
    const labelStartInput = createElement("div", "", "Times wait to start");

    const counterToStopInput = createInput("Counter to Stop", counterToStop);
    const labelStopInput = createElement("div", "", "Times wait to stop");

    const betStatusLabel = createElement("label", "width: 100%; color: black;");

    wrapSelect.append(betSelect, labelSelect);
    wrapStartInput.append(counterToStartInput, labelStartInput);
    wrapStopInput.append(counterToStopInput, labelStopInput);

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
      "margin-right:10px;margin-bottom:10px;position: absolute; bottom: 3px; right: 4px; width: auto; height: auto; min-width: unset;scale:1.1"
    );

    betContainer.append(
      wrapSelect,
      wrapStartInput,
      wrapStopInput,
      wrapTestMode,
      startBetButton,
      betStatusLabel,
      toggleSizeButton
    );
    document.body.appendChild(betContainer);

    counterToStartInput.addEventListener("input", function () {
      localStorage.setItem(
        "counterToStartBetting",
        counterToStartInput.value.trim()
      );
    });

    counterToStopInput.addEventListener("input", function () {
      localStorage.setItem(
        "counterToStopBetting",
        counterToStopInput.value.trim()
      );
    });

    const isBonusCoin = () => {
      const previousRolls = Array.from(
        document.querySelectorAll(".previous-rolls-item")
      );
      return previousRolls[
        previousRolls.length - 1
      ].children[0].className.includes("coin-bonus");
    };

    // Log betting info to the console
    function logInfo() {
      console.log("===>counterDelayPlay:", counterDelayPlay);
      console.log("===>counterWin", counterWin);
      console.log("===>totalProfit", totalProfit);
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
      const betOptionIndex =
        betOptions.findIndex((opt) => opt === betAmount) + 1;
      const clearButton = document.querySelector(".button-pill");

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
            (currentTimeText?.includes("10,") ||
              currentTimeText?.includes("10.")) &&
            !isHandled
          ) {
            console.clear();
            handleBet();
            hideElements(elementsToHide);
            isHandled = true;
          } else if (
            !currentTimeText?.includes("10,") &&
            !currentTimeText?.includes("10.")
          ) {
            isHandled = false;
          }
        }, 300);
      } else {
        window.location.reload();
      }

      // Handle the betting logic
      function handleBet() {
        clearButton?.click();

        const betControls = Array.from(
          document.querySelectorAll(".bet-input__controls-inner button")
        );

        const betX14Button = testModeCheckbox.checked
          ? document.querySelector(".wheel__item.absolute")
          : document.querySelectorAll(".bet-btn")[1];
        const x2Button = betControls[7];

        const counterToStart = parseInt(counterToStartInput.value, 10) || 20;
        const counterToStop = parseInt(counterToStopInput.value, 10) || 40;

        if (counterDelayPlay >= counterToStop) {
          counterDelayPlay = 0;
          betCounter = 0;
          console.log("===>STOP");
        }

        if (isBonusCoin()) {
          if (isBetted) {
            console.log("===>win x14", betCounter);
            totalProfit += preBetAmount * 14;
            counterWin++;
          }

          isBetted = false;
          counterDelayPlay = 0;
          betCounter = 0;
        } else {
          counterDelayPlay++;
          isBetted = false;

          if (counterDelayPlay < counterToStart) {
            logInfo();
            return;
          }

          isBetted = true;

          if (betCounter < 13) {
            betControls[betOptionIndex]?.click();
            preBetAmount = betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 20) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            preBetAmount = 2 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 27) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 4 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 34) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 8 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 41) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 16 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 49) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 32 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 55) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 64 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 62) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 128 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 69) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 256 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 76) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 512 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 83) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 1024 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 90) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 2048 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 97) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 4096 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 104) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 8192 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 111) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 16384 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 118) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 32768 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          } else if (betCounter < 125) {
            betControls[betOptionIndex]?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            x2Button?.click();
            preBetAmount = 65536 * betAmount;
            totalProfit -= preBetAmount;
            betCounter++;
            console.log("===>bet x14", betCounter);
            betX14Button?.click();
          }
        }

        totalProfit = parseFloat(totalProfit.toFixed(5));

        logInfo();
      }
    }

    // Toggle the size of the betting container
    function handleToggleSize() {
      isExpanded = !isExpanded;
      betContainer.style.width = isExpanded ? "230px" : "57px";
      betContainer.style.height = isExpanded ? "275px" : "30px";

      toggleSizeButton.textContent = isExpanded ? "Close" : "Open";

      [
        wrapSelect,
        wrapTestMode,
        wrapStartInput,
        wrapStopInput,
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
    }, 10000);
  }, 2000);
})();
