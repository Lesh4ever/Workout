const workoutCreateForm = document.querySelector("#workout-create-form");
const exerciseForm = document.querySelector("#exercise-form");
const activeHint = document.querySelector("#active-workout-hint");
const workoutsContainer = document.querySelector("#workouts");

const workouts = [];
let activeWorkoutId = null;

function getActiveWorkout() {
  return workouts.find((w) => w.id === activeWorkoutId) || null;
}

function updateActiveHint() {
  const w = getActiveWorkout();

  if (!w) {
    activeHint.textContent = "Активне тренування: немає";
    return;
  }

  activeHint.textContent = `Активне тренування: ${w.date} — ${w.title}`;
}

workoutCreateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(workoutCreateForm);
  const date = formData.get("date");
  const title = formData.get("title");

  const newWorkout = {
    id: Date.now(),
    date,
    title,
    exercises: [],
  };

  workouts.push(newWorkout);
  activeWorkoutId = newWorkout.id;

  workoutCreateForm.reset();
  updateActiveHint();
  renderWorkouts();
});

exerciseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const activeWorkout = getActiveWorkout();
  if (!activeWorkout) {
    alert("Спочатку створи тренування (дата + що качаємо).");
    return;
  }

  const formData = new FormData(exerciseForm);

  const name = formData.get("exercise");
  const weight = Number(formData.get("weight"));
  const reps = Number(formData.get("reps"));

  const newExercise = {
    id: Date.now(),
    name,
    weight,
    reps,
  };

  activeWorkout.exercises.push(newExercise);

  exerciseForm.reset();
  renderWorkouts();
});

function renderWorkouts() {
  if (workouts.length === 0) {
    workoutsContainer.innerHTML =
      '<p class="empty">Поки що немає тренувань. Створи перше 👆</p>';
    return;
  }

  const html = workouts
    .map((w) => {
      const exercisesHtml =
        w.exercises.length === 0
          ? `<p class="empty">Немає вправ</p>`
          : `<ol class="exercise-list">
              ${w.exercises
                .map(
                  (ex) => `
                    <li class="exercise-item">
                      <span class="exercise-name">${ex.name}</span>
                      <span class="exercise-meta">${ex.weight} кг × ${ex.reps}</span>
                    </li>
                  `,
                )
                .join("")}
            </ol>`;

      return `
        <div class="workout-block">
          <div class="workout-head">
            <span class="workout-date">${w.date}</span>
            <span class="workout-title">${w.title}</span>
          </div>
          ${exercisesHtml}
        </div>
      `;
    })
    .join("");
  workoutsContainer.innerHTML = html;
}

updateActiveHint();
renderWorkouts();

const openTimerBtn = document.querySelector("#open-timer-btn");

openTimerBtn.addEventListener("click", handleClick);

function handleClick() {
  let timeLeft = 60;
  let timerId = null;

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const instance = basicLightbox.create(`
    <div class="timer-modal">
      <h2 class="timer-modal__title">Таймер відпочинку</h2>
      <p class="timer-modal__time" id="timer-display">${formatTime(timeLeft)}</p>

      <div class="timer-modal__buttons">
        <button type="button" class="timer-control-btn" id="start-timer-btn">Старт</button>
        <button type="button" class="timer-control-btn" id="pause-timer-btn">Пауза</button>
        <button type="button" class="timer-control-btn" id="reset-timer-btn">Скинути</button>
      </div>
    </div>
    `);
  instance.show();

  const timerDisplay = document.querySelector("#timer-display");
  const startTimerBtn = document.querySelector("#start-timer-btn");
  const pauseTimerBtn = document.querySelector("#pause-timer-btn");
  const resetTimerBtn = document.querySelector("#reset-timer-btn");

  const updateDisplay = () => {
    timerDisplay.textContent = formatTime(timeLeft);
  };

  startTimerBtn.addEventListener("click", () => {
    if (timerId) return;

    timerId = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        return;
      }

      timeLeft -= 1;
      updateDisplay();
    }, 1000);
  });

  pauseTimerBtn.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
  });

  resetTimerBtn.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 60;
    updateDisplay();
  });
}
