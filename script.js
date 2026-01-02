const display = document.getElementById("display");
const modeEl = document.getElementById("mode");
const buttons = document.querySelectorAll(".keys button");

let expr = "";
let memory = 0;
let isDeg = true;

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const fn = btn.dataset.fn;

    if (val) addValue(val);
    if (fn) handleFn(fn);
  });
});

function addValue(v) {
  if (expr === "0") expr = "";
  expr += v;
  update();
}

function handleFn(fn) {
  switch (fn) {
    case "clear":
      expr = "";
      break;
    case "del":
      expr = expr.slice(0, -1);
      break;
    case "equals":
      calculate();
      return;
    case "pi":
      expr += Math.PI.toString();
      break;
    case "sqrt":
      expr += "√(";
      break;
    case "pow":
      expr += "^";
      break;
    case "sin":
    case "cos":
    case "tan":
    case "log":
    case "ln":
      expr += fn + "(";
      break;
    case "mode":
      isDeg = !isDeg;
      modeEl.textContent = isDeg ? "DEG" : "RAD";
      return;
    case "mc":
      memory = 0;
      break;
    case "mr":
      expr += memory.toString();
      break;
    case "mplus":
      memory += Number(evalSafe(expr) || 0);
      break;
    case "mminus":
      memory -= Number(evalSafe(expr) || 0);
      break;
  }
  update();
}

function update() {
  display.textContent = expr || "0";
}

function calculate() {
  try {
    let e = expr;

    e = e.replace(/√/g, "Math.sqrt");
    e = e.replace(/\^/g, "**");
    e = e.replace(/log\(/g, "Math.log10(");
    e = e.replace(/ln\(/g, "Math.log(");

    e = e.replace(/sin\(/g, isDeg ? "sinDeg(" : "Math.sin(");
    e = e.replace(/cos\(/g, isDeg ? "cosDeg(" : "Math.cos(");
    e = e.replace(/tan\(/g, isDeg ? "tanDeg(" : "Math.tan(");

    const result = eval(e);
    expr = result.toString();
    update();
  } catch {
    display.textContent = "Error";
    expr = "";
  }
}

function sinDeg(x) {
  return Math.sin(x * Math.PI / 180);
}
function cosDeg(x) {
  return Math.cos(x * Math.PI / 180);
}
function tanDeg(x) {
  return Math.tan(x * Math.PI / 180);
}

function evalSafe(e) {
  try {
    return eval(e);
  } catch {
    return 0;
  }
}

