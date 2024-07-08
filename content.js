(function () {
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (window?.location?.href !== "https://csgoempire.com/roulette") return;

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
      let totalProfit = 0;
      let betAmount = 1;
      let counterPlay = 0;
      let counterWin = 0;
      let maxCounter = betCounter;
      let isBetted = false;
      let counterDelayPlay = isNoHasBonusCoin() ? 10 : 0;
      const counterToStart = 20;

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

      const hideElements = (selectors) => {
        selectors.forEach((selector) => {
          const element = document.querySelector(selector);
          if (element) element.remove();
        });
      };

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

      const createButton = (text, onClick, styles = "") => {
        const button = createElement(
          "button",
          `width: 100%; min-width: 200px; padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer; border-radius: 10px; ${styles}`,
          text
        );
        button.addEventListener("click", onClick);
        return button;
      };

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

      const startBetButton = createButton("Start", handleToggleBet);
      const betSelect = createSelect(betOptions);

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

      function logInfo() {
        const dataLocalStorage = JSON.parse(
          localStorage?.getItem(`dataBetting`) || "{}"
        );

        console.log("===>counterPlay", dataLocalStorage.counterPlay);
        console.log("===>counterWin", dataLocalStorage.counterWin);
        console.log("===>maxCounter", dataLocalStorage.maxCounter);
        console.log("===>currentProfit", dataLocalStorage.currentProfit);
        console.log("===>totalProfit", dataLocalStorage.totalProfit);
      }

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

        function handleBet() {
          clearButton?.click();

          const currentAmount = document.querySelector(
            '[data-testid="currency-amount"]'
          )?.textContent;

          const betControls = Array.from(
            document.querySelectorAll(".bet-input__controls-inner button")
          );

          const betX14Button = document.querySelectorAll(".bet-btn")[1];
          const x2Button = betControls[7];

          if (isBonusCoin()) {
            console.log("===>win x14", betCounter);

            if (isBetted) {
              totalProfit += betAmount * 14;
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

            if (betCounter < 13) {
              betControls[betOptionIndex]?.click();
              totalProfit -= betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 20) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              totalProfit -= 2 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 27) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 4 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 34) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 8 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 41) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 16 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 49) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 32 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 55) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 64 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            } else if (betCounter < 62) {
              betControls[betOptionIndex]?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              x2Button?.click();
              totalProfit -= 128 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
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
              totalProfit -= 256 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
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
              totalProfit -= 512 * betAmount;
              betCounter++;
              console.log("===>bet x14", betCounter);
              betX14Button.click();
            }
          }

          totalProfit = parseFloat(totalProfit.toFixed(5));
          maxCounter =
            counterDelayPlay > maxCounter ? counterDelayPlay : maxCounter;
          currentProfit = Number(currentAmount) - Number(initAmount);

          localStorage?.setItem(
            `dataBetting`,
            JSON.stringify({
              totalProfit,
              counterPlay,
              counterWin,
              maxCounter,
              currentProfit,
            })
          );

          logInfo();
        }
      }

      function handleToggleSize() {
        isExpanded = !isExpanded;
        betContainer.style.width = isExpanded ? "220px" : "30px";
        betContainer.style.height = isExpanded ? "fit-content" : "30px";
        [betSelect, startBetButton, betStatusLabel, betInfoLabel].forEach(
          (el) => (el.style.display = isExpanded ? "block" : "none")
        );
      }

      hideElements(elementsToHide);

      setInterval(() => {
        fetch(window.location.href);
      }, 10000);
    }, 1000);
  });
})();
