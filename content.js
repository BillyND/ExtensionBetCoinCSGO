(function () {
  window.addEventListener("load", () => {
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
      let betAmount = 1;
      let preBetAmount = betAmount;
      let isBetted = false;
      let counterDelayPlay = isNoHasBonusCoin() ? 10 : 0;
      const counterToStart = 20; // Default value
      const counterToStop = 40; // Default value

      let counterPlay = 0,
        counterWin = 0,
        maxCounter = betCounter,
        totalProfit = 0,
        currentProfit = 0;

      const initAmount = document.querySelector(
        '[data-testid="currency-amount"]'
      )?.textContent;

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
      const createElement = (tag, cssText, textContent = "") => {
        const el = document.createElement(tag);
        el.style.cssText = cssText;
        el.textContent = textContent;
        return el;
      };

      const betOptions = [0.01, 0.1, 1];
      const betContainer = createElement(
        "div",
        `position: fixed; background-color: rgb(206, 206, 206); top: 10px; left: 10px; z-index: 999; padding: 10px; width: 220px; height: fit-content; border: 1px solid black; border-radius: 10px; display: grid; gap: 20px; color: black;`
      );

      // Function to create a button with specified text, click handler, and styles
      const createButton = (text, onClick, styles = "") => {
        const button = createElement(
          "button",
          `width: 100%; min-width: 200px; padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer; border-radius: 10px; ${styles}`,
          text
        );
        button.addEventListener("click", onClick);
        return button;
      };

      // Function to create a select element with specified options
      const createSelect = (options) => {
        const select = createElement(
          "select",
          `padding: 5px 10px; width: 100%; min-width: 200px; border-radius: 10px;`
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
          `padding: 5px 10px; width: 100%; min-width: 200px; border-radius: 10px;`,
          ""
        );
        input.placeholder = placeholder;
        input.value = defaultValue;
        return input;
      };

      const startBetButton = createButton("Start", handleToggleBet);
      const betSelect = createSelect(betOptions);
      const counterToStartInput = createInput(
        "Counter to Start",
        counterToStart
      );
      const counterToStopInput = createInput("Counter to Stop", counterToStop);

      const betStatusLabel = createElement(
        "label",
        "width: 100%; color: black;"
      );
      const betInfoLabel = createElement(
        "label",
        "width: 100%; color: black;",
        "No data available"
      );

      const toggleSizeButton = createButton(
        "x",
        handleToggleSize,
        "position: absolute; bottom: 10px; right: 10px; width: auto; height: auto; min-width: unset;"
      );

      betContainer.append(
        betSelect,
        counterToStartInput,
        counterToStopInput,
        startBetButton,
        betStatusLabel,
        betInfoLabel,
        toggleSizeButton
      );
      document.body.appendChild(betContainer);

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
        console.log("===>counterPlay", counterPlay);
        console.log("===>counterWin", counterWin);
        console.log("===>maxCounter", maxCounter);
        console.log("===>currentProfit", currentProfit);
        console.log("===>totalProfit", totalProfit);
      }

      // Toggle the betting process
      function handleToggleBet() {
        hideElements(elementsToHide);
        isRunning = !isRunning;
        betAmount = parseFloat(betSelect.value);
        const betOptionIndex =
          betOptions.findIndex((opt) => opt === betAmount) + 1;
        const clearButton = document.querySelector(".button-pill");

        startBetButton.textContent = isRunning ? "Stop" : "Start";

        if (isRunning) {
          const interval = setInterval(() => {
            if (!isRunning) {
              clearInterval(interval);
              return;
            }
            betStatusLabel.textContent =
              "Running" + ".".repeat((Date.now() / 100) % 4);
          }, 500);

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
              hideElements(elementsToHide);
              handleBet();
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

          const currentAmount = document.querySelector(
            '[data-testid="currency-amount"]'
          )?.textContent;

          const betControls = Array.from(
            document.querySelectorAll(".bet-input__controls-inner button")
          );

          const betX14Button = document.querySelector(".wheel__item absolute");
          // const betX14Button = document.querySelectorAll(".bet-btn")[1];
          const x2Button = betControls[7];

          const counterToStart = parseInt(counterToStartInput.value, 10) || 20;
          const counterToStop = parseInt(counterToStopInput.value, 10) || 40;

          if (counterDelayPlay >= counterToStop) {
            counterDelayPlay = 0;
            betCounter = 0;
            console.log("===>stop");
          }

          if (isBonusCoin()) {
            console.log("===>win x14", betCounter);

            if (isBetted) {
              totalProfit += preBetAmount * 14;
              counterWin++;
            }

            isBetted = false;
            counterDelayPlay = 0;
            betCounter = 0;
          } else {
            counterDelayPlay++;

            console.log("===>counterDelayPlay:", counterDelayPlay);

            if (counterDelayPlay < counterToStart) {
              logInfo();
              return;
            }

            counterPlay++;
            isBetted = true;
            preBetAmount = betAmount;

            if (betCounter < 13) {
              betControls[betOptionIndex]?.click();
              totalProfit -= preBetAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button?.click();
            } else if (betCounter < 20) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              totalProfit -= 2 * preBetAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button?.click();
            } else if (betCounter < 27) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 4 * preBetAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button?.click();
            } else if (betCounter < 34) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 8 * preBetAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button?.click();
            } else if (betCounter < 41) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 16 * preBetAmount;
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
              totalProfit -= 32 * preBetAmount;
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
              totalProfit -= 64 * preBetAmount;
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
              totalProfit -= 128 * preBetAmount;
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
              totalProfit -= 256 * preBetAmount;
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
              totalProfit -= 512 * preBetAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button?.click();
            }
          }

          totalProfit = parseFloat(totalProfit.toFixed(5));
          maxCounter = Math.max(counterDelayPlay, maxCounter);
          currentProfit = parseFloat(
            (Number(currentAmount) - Number(initAmount)).toFixed(5)
          );

          logInfo();
        }
      }

      // Toggle the size of the betting container
      function handleToggleSize() {
        isExpanded = !isExpanded;
        betContainer.style.width = isExpanded ? "220px" : "30px";
        betContainer.style.height = isExpanded ? "fit-content" : "30px";
        [
          betSelect,
          counterToStartInput,
          counterToStopInput,
          startBetButton,
          betStatusLabel,
          betInfoLabel,
        ].forEach((el) => (el.style.display = isExpanded ? "block" : "none"));
      }

      hideElements(elementsToHide);

      setInterval(() => {
        fetch(window.location.href).catch(console.error);
      }, 10000);
    }, 1000);
  });
})();
