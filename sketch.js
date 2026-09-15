const headerHeight = 170;
const horizontalMargin = 25;
const totalYears = 100;
const rowHeight = 20;
const verticalPadding = 15;
const rowGap = 15;
const numberX = 32;
const numberToRectGap = 15;
const rectRightPadding = 15;
const weeksPerYear = 52;
const weekRectGap = 15;
const minWeekRectWidth = 1;
const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
let elapsedWeeks = 0;

function canvasHeight() {
  return (
    totalYears * rowHeight + (totalYears - 1) * rowGap + verticalPadding * 2
  );
}

function setup() {
  const cnv = createCanvas(windowWidth - horizontalMargin * 2, canvasHeight());
  cnv.position(horizontalMargin, headerHeight);

  const calculateButton = document.getElementById("calculate-button");
  calculateButton.addEventListener("click", () => {
    const day = Number.parseInt(document.getElementById("birth-day").value, 10);
    const month = Number.parseInt(
      document.getElementById("birth-month").value,
      10
    );
    const year = Number.parseInt(document.getElementById("birth-year").value, 10);
    const weeksPassed = calculateWeeksPassed(day, month, year);
    if (weeksPassed !== null) {
      elapsedWeeks = weeksPassed;
    }
    console.log(weeksPassed);
  });
}

function draw() {
  background(255);
  stroke(0);
  noFill();
  textAlign(RIGHT, CENTER);
  textSize(rowHeight * 0.7);
  let weekCounter = 0;

  for (let year = 0; year < totalYears; year++) {
    const y =
      verticalPadding + rowHeight / 2 + year * (rowHeight + rowGap);
    const rectX = numberX + numberToRectGap;
    const rectY = y - rowHeight / 2;
    const rectWidth = Math.max(0, width - rectX - rectRightPadding);
    const maxGapToFit =
      (rectWidth - weeksPerYear * minWeekRectWidth) / (weeksPerYear - 1);
    const effectiveWeekGap = Math.max(0, Math.min(weekRectGap, maxGapToFit));
    const totalGapsWidth = (weeksPerYear - 1) * effectiveWeekGap;
    const weekRectWidth = (rectWidth - totalGapsWidth) / weeksPerYear;

    for (let week = 0; week < weeksPerYear; week++) {
      const weekX = rectX + week * (weekRectWidth + effectiveWeekGap);
      if (weekCounter < elapsedWeeks) {
        fill(255, 0, 0);
      } else {
        noFill();
      }
      rect(weekX, rectY, weekRectWidth, rowHeight);
      weekCounter++;
    }

    noStroke();
    fill(0);
    text(year + 1, numberX, y);
    stroke(0);
    noFill();
  }
}

function windowResized() {
  resizeCanvas(windowWidth - horizontalMargin * 2, canvasHeight());
}

function calculateWeeksPassed(day, month, year) {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return null;
  }

  const birthDate = new Date(year, month - 1, day);
  const isValidDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isValidDate) {
    return null;
  }

  const now = new Date();
  if (now < birthDate) {
    return 0;
  }

  // 1. Determina l'età compiuta e la data dell'ultimo e del prossimo compleanno
  let age = now.getFullYear() - birthDate.getFullYear();
  let lastBirthday = new Date(now.getFullYear(), month - 1, day);
  let nextBirthday;

  if (now < lastBirthday) {
    age--;
    lastBirthday = new Date(now.getFullYear() - 1, month - 1, day);
    nextBirthday = new Date(now.getFullYear(), month - 1, day);
  } else {
    nextBirthday = new Date(now.getFullYear() + 1, month - 1, day);
  }

  // 2. Normalizza i giorni dell'anno corrente su 52 settimane
  const msInCurrentYear = nextBirthday.getTime() - lastBirthday.getTime();
  const msPassedThisYear = now.getTime() - lastBirthday.getTime();
  const weeksThisYear = Math.floor((msPassedThisYear / msInCurrentYear) * 52);

  // 3. Totale settimane normalizzate (52 per ogni anno pieno + anno corrente)
  return age * 52 + weeksThisYear;
}
