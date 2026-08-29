const resultArea = document.querySelector(".result-area");
const equationArea = document.querySelector(".equation-area");
const btnsContainer = document.querySelector(".btns-container");

let currNumber = "";
let equation = "";
let resultClicked = false;

function updateAreas() {
  resultArea.style.fontSize = `${4 + (22 - currNumber.length) / 5.5}rem`;
  if (equation[equation.length - 2] == ".")
    equation =
      equation.slice(0, equation.length - 2) + equation[equation.length - 1];
  if (currNumber.includes("e") && currNumber.length > 10)
    currNumber =
      currNumber.slice(0, 6) + currNumber.slice(currNumber.indexOf("e"));
  if (equation.includes("e") && equation.length > 10)
    equation = equation.slice(0, 6) + equation.slice(equation.indexOf("e"));
  resultArea.textContent = currNumber.length === 0 ? "0" : currNumber;
  equationArea.textContent = equation;
  resultClicked = false;
}

function makeAnOperation() {
  let result = null;

  switch (equation[equation.length - 1]) {
    case "+":
      result = parseFloat(equation) + Number(currNumber);
      break;

    case "−":
      result = parseFloat(equation) - Number(currNumber);
      break;

    case "×":
      result = parseFloat(equation) * Number(currNumber);
      break;

    case "÷":
      if (Number(currNumber) !== 0) {
        result = parseFloat(equation) / Number(currNumber);
      } else {
        return false;
      }
      break;
  }

  if (result !== null) {
    return String(Number(result.toFixed(12)));
  }

  return "Error: wrong operation";
}

function checkDivisionByZero() {
  if (!makeAnOperation()) {
    resultArea.textContent = "Cannot divide by zero";
    resultArea.style.fontSize = "4rem";
    currNumber = "";
    equation = "";
    return false;
  }
  return true;
}

btnsContainer.addEventListener("click", (e) => {
  const target = e.target.closest("button");

  if (target === null) return;

  if (target.classList.contains("number")) {
    if (currNumber.length >= 20) return;

    if (resultClicked) {
      currNumber = "";
    }

    if (target.id === "zero" && currNumber === "") return;

    if (currNumber === "0") currNumber = "";

    currNumber += target.textContent;
    updateAreas();
    return;
  }

  if (target.id === "point") {
    if (resultClicked) {
      currNumber = "";
    }

    currNumber = currNumber.includes(".")
      ? currNumber
      : currNumber === ""
        ? "0."
        : currNumber + ".";
    updateAreas();
    return;
  }

  if (target.classList.contains("operation")) {
    if (currNumber === "") {
      if (equation !== "")
        equation = equation.slice(0, equation.length - 1) + target.textContent;
      if (equation === "") equation = "0" + target.textContent;
      updateAreas();
      return;
    }

    if (equation !== "") {
      if (!checkDivisionByZero()) return;
      equation = makeAnOperation() + target.textContent;
    }
    if (equation === "") equation = currNumber + target.textContent;
    currNumber = "";

    updateAreas();
    return;
  }

  if (target.id === "result") {
    if (equation === "") return;

    if (currNumber === "") currNumber = "0";

    if (currNumber[currNumber.length - 1] === ".")
      currNumber = currNumber.slice(0, currNumber.length - 1);

    if (equation.includes("e") && equation.length > 10)
      equation = equation.slice(0, 6) + equation.slice(equation.indexOf("e"));
    if (equation.length > 10 || currNumber.length > 10) {
      equationArea.innerHTML = equation + "<br>" + currNumber + "=";
    } else equationArea.textContent = equation + currNumber + "=";

    if (!checkDivisionByZero()) return;

    currNumber = makeAnOperation();
    if (currNumber.includes("e") && currNumber.length > 10)
      currNumber =
        currNumber.slice(0, 6) + currNumber.slice(currNumber.indexOf("e"));
    resultArea.style.fontSize = `${4 + (22 - currNumber.length) / 5.5}rem`;
    resultArea.textContent = currNumber;

    equation = "";
    resultClicked = true;
    return;
  }

  if (target.id === "ac") {
    if (currNumber === "") {
      equation = "";
    }
    currNumber = "";
    updateAreas();
    return;
  }

  if (target.id === "delete") {
    currNumber = currNumber.slice(0, currNumber.length - 1);
    updateAreas();
    return;
  }

  if (target.id === "swap-sign") {
    currNumber = String(-currNumber);
    updateAreas();
  }

  if (target.id === "percent") {
    if (currNumber === "") return;

    currNumber = Number((currNumber / 100).toFixed(12));
    if ("+−".includes(equation[equation.length - 1]))
      currNumber *= parseFloat(equation);
    currNumber = String(currNumber);

    updateAreas();
  }
});
