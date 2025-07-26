let point = 0;
let options = [];

const pointValue = document.getElementById("point-value");
const message = document.getElementById("message");
const optionList = document.getElementById("option-list");

function updateDisplay() {
  pointValue.textContent = `${point} 포인트`;
  const liquid = document.getElementById("liquid");
  const heightPercent = Math.min(100, point);
  liquid.style.height = `${heightPercent}%`;
  localStorage.setItem("fox-point", JSON.stringify({ point, options }));
}

function renderOptions() {
  optionList.innerHTML = "";
  options.forEach((opt, index) => {
    const item = document.createElement("div");
    item.className = "option-item";

    const input = document.createElement("input");
    input.type = "number";
    input.className = "amount-input";
    input.value = opt.amount;

    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = `${opt.name} ${opt.type}`;
    btn.onclick = () => {
      const value = parseInt(input.value);
      if (!isNaN(value)) applyOption({ ...opt, amount: value });
    };

    const upBtn = document.createElement("button");
    upBtn.className = "move-up-button";
    upBtn.textContent = "↑";
    upBtn.onclick = () => moveOption(index, -1);

    const downBtn = document.createElement("button");
    downBtn.className = "move-down-button";
    downBtn.textContent = "↓";
    downBtn.onclick = () => moveOption(index, 1);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-button";
    delBtn.textContent = "×";
    delBtn.onclick = () => deleteOption(index);

    item.appendChild(input);
    item.appendChild(btn);
    item.appendChild(upBtn);
    item.appendChild(downBtn);
    item.appendChild(delBtn);
    optionList.appendChild(item);
  });
}

function addOption() {
  const name = document.getElementById("option-name").value.trim();
  const amount = parseInt(document.getElementById("option-amount").value);
  const type = document.getElementById("option-type").value;
  if (!name || isNaN(amount)) return;
  options.push({ name, amount, type });
  document.getElementById("option-name").value = "";
  document.getElementById("option-amount").value = "";
  renderOptions();
  updateDisplay();
}

function applyOption(opt) {
  message.textContent = "";
  if (opt.type === "+") {
    point += opt.amount;
  } else {
    if (point >= opt.amount) {
      point -= opt.amount;
    } else {
      message.textContent = "포인트가 부족합니다.";
      return;
    }
  }
  updateDisplay();
}

function deleteOption(index) {
  const confirmed = confirm("정말 이 옵션을 삭제하시겠습니까?");
  if (!confirmed) return;
  options.splice(index, 1);
  renderOptions();
  updateDisplay();
}

function moveOption(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= options.length) return;
  [options[index], options[newIndex]] = [options[newIndex], options[index]];
  renderOptions();
  updateDisplay();
}

function loadSaved() {
  const saved = localStorage.getItem("fox-point");
  if (saved) {
    const data = JSON.parse(saved);
    point = data.point || 0;
    options = data.options || [];
    renderOptions();
    updateDisplay();
  }
}

loadSaved();
