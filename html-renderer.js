const colors = [
  "green",
  "lime",
  "yellow",
  "gold",
  "orange",
  "salmon",
  "pink",
  "red",
];

function render(currentRound, onCellClick, onRightClick, onRestartClick) {
  if (!currentRound) {
    return;
  }

  const {
    field,
    visitedField,
    minesField,
    minesRemaining,
    flagsField,
    result,
  } = currentRound;
  console.log(currentRound);

  const fieldDiv = document.querySelector(".field");
  const infoDiv = document.querySelector(".info");
  const minesDiv = document.querySelector(".mines");

  fieldDiv.innerHTML = "";
  infoDiv.innerHTML = "";
  minesDiv.innerHTML = `💣 ${minesRemaining}`;

  field.forEach((row, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach((_, j) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.addEventListener("click", () => onCellClick(i, j));
      cellDiv.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        onRightClick(i, j);
      });

      if (visitedField[i][j]) {
        cellDiv.classList.add("clicked");
        cellDiv.textContent = minesField[i][j];
        cellDiv.style.color = colors[minesField[i][j]] || "black";
      }

      if (flagsField[i][j]) {
        cellDiv.textContent = "🚩";
      }

      if (result.type !== "playing" && field[i][j] === MINE_VALUE) {
        cellDiv.classList.add("mine");
        cellDiv.textContent = "💣";
      }

      rowDiv.appendChild(cellDiv);
    });

    fieldDiv.appendChild(rowDiv);
  });

  if (result.type !== "playing") {
    const notificationDiv = document.createElement("div");
    const restartGameButton = document.createElement("div");

    notificationDiv.classList.add("notification");
    restartGameButton.classList.add("restart");
    restartGameButton.textContent = "Играть снова";
    restartGameButton.addEventListener("click", onRestartClick);
    notificationDiv.textContent =
      result.type === "win" ? `Победа!` : "Проигрыш!";

    infoDiv.appendChild(notificationDiv);
    infoDiv.appendChild(restartGameButton);

    // revealMines();
  }
}
