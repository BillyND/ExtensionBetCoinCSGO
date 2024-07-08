window.addEventListener("load", () => {
  setTimeout(() => {
    if (window?.location?.href !== "https://csgoempire.com/roulette") return;
    let c = !1,
      t = 0,
      l = !0,
      e = !1,
      i = 0,
      o = 1,
      r = 0,
      n = 0,
      a = t,
      k = !1,
      u = Array.from(document.querySelectorAll(".previous-rolls-item")).filter(
        (c) => c.children[0].className.includes("coin-bonus")
      ).length
        ? 0
        : 10,
      d = document.querySelector(
        '[data-testid="currency-amount"]'
      )?.textContent,
      $ = [
        ".bet-containers",
        ".pt-lg",
        "#empire-footer",
        ".chat--open",
        ".vfm__container",
        ".vfm__overlay",
        ".vfm.vfm--inset.vfm--fixed",
        ".chat-tab--chat-open",
        ".mb-lg.px-lg.-mx-lg.mt-xxl",
      ],
      x = (c) => {
        c.forEach((c) => {
          let t = document.querySelector(c);
          t && t.remove();
        });
      },
      _ = (c, t, l = "") => {
        let e = document.createElement(c);
        return (e.style.cssText = t), (e.textContent = l), e;
      },
      p = [0.01, 0.1, 1],
      s = _(
        "div",
        "position: fixed; background-color: rgb(206, 206, 206); top: 10px; left: 10px; z-index: 999; padding: 10px; width: 220px; height: fit-content; border: 1px solid black; border-radius: 10px; display: grid; gap: 20px; color: black;"
      ),
      f = (c, t, l = "") => {
        let e = _(
          "button",
          `width: 100%; min-width: 200px; padding: 5px 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer; border-radius: 10px; ${l}`,
          c
        );
        return e.addEventListener("click", t), e;
      },
      g = f("Start", function l() {
        x($), (c = !c), (o = parseFloat(b.value));
        let _ = p.findIndex((c) => c === o) + 1,
          s = document.querySelector(".button-pill");
        if (((g.textContent = c ? "Stop" : "Start"), c)) {
          let f = setInterval(() => {
              if (!c) {
                clearInterval(f);
                return;
              }
              h.textContent = "Running" + ".".repeat((Date.now() / 100) % 4);
            }, 500),
            m = setInterval(() => {
              if (!c) {
                clearInterval(m);
                return;
              }
              let l = JSON.stringify(
                document.querySelectorAll(".text-2xl")[0]?.outerText
              );
              (l?.includes("10,") || l?.includes("10.")) && !e
                ? (console.clear(),
                  x($),
                  (function c() {
                    s?.click();
                    let l = document.querySelector(
                        '[data-testid="currency-amount"]'
                      )?.textContent,
                      e = Array.from(
                        document.querySelectorAll(
                          ".bet-input__controls-inner button"
                        )
                      ),
                      $ = document.querySelectorAll(".bet-btn")[1],
                      x = e[7];
                    if (v())
                      console.log("===>win x14", t),
                        k && ((i += 14 * o), n++),
                        (k = !1),
                        (u = 0),
                        (t = 0);
                    else {
                      if (
                        (u++, console.log("===>counterDelayPlay:", u), u < 20)
                      ) {
                        S();
                        return;
                      }
                      r++,
                        (k = !0),
                        t < 13
                          ? (e[_]?.click(),
                            (i -= o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 20
                          ? (e[_]?.click(),
                            x?.click(),
                            (i -= 2 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 27
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 4 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 34
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 8 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 41
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 16 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 49
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 32 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 55
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 64 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 62
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 128 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 69
                          ? (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 256 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click())
                          : t < 76 &&
                            (e[_]?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            x?.click(),
                            (i -= 512 * o),
                            t++,
                            console.log("===>bet x14", t),
                            $.click());
                    }
                    (p = parseFloat(p.toFixed(5))),
                      (i = parseFloat(i.toFixed(5))),
                      (a = Math.max(u, a));
                    let p = Number(l) - Number(d);
                    localStorage?.setItem(
                      "dataBetting",
                      JSON.stringify({
                        totalProfit: i,
                        counterPlay: r,
                        counterWin: n,
                        maxCounter: a,
                        currentProfit: p,
                      })
                    ),
                      S();
                  })(),
                  (e = !0))
                : l?.includes("10,") || l?.includes("10.") || (e = !1);
            }, 300);
        } else window.location.reload();
      }),
      b = ((c) => {
        let t = _(
          "select",
          "padding: 5px 10px; width: 100%; min-width: 200px; border-radius: 10px;"
        );
        return (
          c.forEach((c) => {
            let l = _("option", "", c.toString());
            (l.value = c.toString()), t.appendChild(l);
          }),
          t
        );
      })(p),
      h = _("label", "width: 100%; color: black;"),
      m = _("label", "width: 100%; color: black;", "No data available"),
      y = f(
        "x",
        function c() {
          (l = !l),
            (s.style.width = l ? "220px" : "30px"),
            (s.style.height = l ? "fit-content" : "30px"),
            [b, g, h, m].forEach(
              (c) => (c.style.display = l ? "block" : "none")
            );
        },
        "position: absolute; bottom: 10px; right: 10px; width: auto; height: auto; min-width: unset;"
      );
    s.append(b, g, h, m, y), document.body.appendChild(s);
    let v = () => {
      let c = Array.from(document.querySelectorAll(".previous-rolls-item"));
      return c[c.length - 1].children[0].className.includes("coin-bonus");
    };
    function S() {
      let c = JSON.parse(localStorage?.getItem("dataBetting") || "{}");
      console.log("===>counterPlay", c.counterPlay),
        console.log("===>counterWin", c.counterWin),
        console.log("===>maxCounter", c.maxCounter),
        console.log("===>currentProfit", c.currentProfit),
        console.log("===>totalProfit", c.totalProfit);
    }
    x($),
      setInterval(() => {
        fetch(window.location.href);
      }, 1e4);
  }, 1e3);
});
