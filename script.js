/* =========================================================
   Tab navigation — switches between Home / Profile / Contact / Calculator
   ========================================================= */
const tabButtons = document.querySelectorAll(".tab-btn");
const pages = document.querySelectorAll(".page");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    pages.forEach((page) => {
      page.classList.toggle("active", page.id === target);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* =========================================================
   Calculator
   ========================================================= */
const display = document.getElementById("calcDisplay");
const calcButtons = document.querySelectorAll(".calc-grid button");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  display.textContent = current;
}

function inputDigit(digit) {
  if (justEvaluated) {
    current = digit === "." ? "0." : digit;
    justEvaluated = false;
    return;
  }
  if (digit === "." && current.includes(".")) return;
  current = current === "0" && digit !== "." ? digit : current + digit;
}

function setOperator(op) {
  if (operator && previous !== null && !justEvaluated) {
    evaluate();
  }
  previous = parseFloat(current);
  operator = op;
  justEvaluated = false;
  current = "0";
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = previous;
  const b = parseFloat(current);
  let result = b;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = b === 0 ? NaN : a / b; break;
  }

  current = Number.isNaN(result) ? "Error" : trimResult(result);
  operator = null;
  previous = null;
  justEvaluated = true;
}

function trimResult(num) {
  return parseFloat(num.toFixed(8)).toString();
}

calcButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (value !== undefined) {
      if (["+", "-", "*", "/"].includes(value)) {
        setOperator(value);
      } else {
        inputDigit(value);
      }
    } else if (action === "clear") {
      current = "0";
      previous = null;
      operator = null;
      justEvaluated = false;
    } else if (action === "sign") {
      current = (parseFloat(current) * -1).toString();
    } else if (action === "percent") {
      current = (parseFloat(current) / 100).toString();
    } else if (action === "equals") {
      evaluate();
    }

    updateDisplay();
  });
});
