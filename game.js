// To change difficulty you should change values below
const defaultValues = {
  fieldSize: 6,
  minesAmount: (6 * 6) / 4,
};

const EMPTY_VALUE = 0;
const MINE_VALUE = 1;

const MAX_FLAGS_AMOUNT = defaultValues.minesAmount;

let currentRound = createRound();

function onRestart() {
  currentRound = createRound();
}

function createRound() {
  const { minesAmount, fieldSize } = defaultValues;

  if (fieldSize > 100) {
    return console.error("Field is too big. Please enter valid size (<= 100)");
  }

  return {
    fieldSize,
    flagsAmount: 0,
    minesAmount,
    minesRemaining: minesAmount,
    field: createAndFillField(fieldSize, minesAmount),
    visitedField: Array.from({ length: fieldSize }, () =>
      Array.from({ length: fieldSize }, () => false)
    ),
    minesField: Array.from({ length: fieldSize }, () =>
      Array.from({ length: fieldSize }, () => 0)
    ),
    flagsField: Array.from({ length: fieldSize }, () =>
      Array.from({ length: fieldSize }, () => false)
    ),
    result: {
      type: "playing" /*  playing | win | lose  */,
    },
  };
}

function createAndFillField(fieldSize, minesAmount) {
  const field = Array.from({ length: fieldSize }, () =>
    Array.from({ length: fieldSize }, () => 0)
  );

  for (let i = 0; i < minesAmount; i++) {
    const row = Math.floor(Math.random() * fieldSize);
    const col = Math.floor(Math.random() * fieldSize);

    if (field[row][col] === MINE_VALUE) {
      i--;
    } else {
      field[row][col] = MINE_VALUE;
    }
  }

  return field;
}

function updateMinesRemaining(currentRound) {
  const { field, flagsField, fieldSize, minesAmount } = currentRound;

  let minesRemaining = minesAmount;

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (field[i][j] === MINE_VALUE && flagsField[i][j]) {
        minesRemaining--;
      }
    }
  }

  return { ...currentRound, minesRemaining };
}

function checkForWin(currentRound) {
  const { field, fieldSize, visitedField, minesRemaining } = currentRound;

  if (minesRemaining === 0) {
    currentRound.result.type = "win";
    return;
  }

  let isCompleted = true;

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (field[i][j] !== MINE_VALUE && visitedField[i][j] === false) {
        isCompleted = false;
      }
    }
  }

  if (isCompleted) {
    return { ...currentRound, result: { type: "win" } };
  }
}

function onTurn(row, col) {
  const { field, visitedField, minesField, flagsField, fieldSize, result } =
    currentRound;

  if (result.type !== "playing") {
    return;
  }

  if (flagsField[row][col]) {
    return;
  }

  if (field[row][col] === MINE_VALUE) {
    currentRound.result.type = "lose";
  } else {
    visitedField[row][col] = true;

    let mineCount = 0;

    const startI = Math.max(row - 1, 0);
    const endI = Math.min(row + 1, fieldSize - 1);
    for (let i = startI; i <= endI; i++) {
      const startJ = Math.max(col - 1, 0);
      const endJ = Math.min(col + 1, fieldSize - 1);

      for (let j = startJ; j <= endJ; j++) {
        if (field[i][j] === MINE_VALUE) {
          mineCount++;
        }
      }
    }
    minesField[row][col] = mineCount;

    if (mineCount == 0) {
      const startI = Math.max(row - 1, 0);
      const endI = Math.min(row + 1, fieldSize - 1);

      for (let i = startI; i <= endI; i++) {
        const startJ = Math.max(col - 1, 0);
        const endJ = Math.min(col + 1, fieldSize - 1);

        for (let j = startJ; j <= endJ; j++) {
          if (visitedField[i][j] === false) {
            onTurn(i, j);
          }
        }
      }
    }

    checkForWin(currentRound);
  }
}

function onFlagClick(row, col) {
  const { flagsField, visitedField } = currentRound;

  if (visitedField[row][col]) {
    return;
  }

  if (flagsField[row][col]) {
    flagsField[row][col] = false;
    currentRound.flagsAmount--;
  } else {
    if (currentRound.flagsAmount < MAX_FLAGS_AMOUNT) {
      flagsField[row][col] = true;
      currentRound.flagsAmount++;
    }
  }

  updateMinesRemaining(currentRound);
  checkForWin(currentRound);
}
