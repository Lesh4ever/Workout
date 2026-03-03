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

workoutsContainer.innerHTML = html;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const date = formData.get("date");
  const exercise = formData.get("exercise");
  const weight = Number(formData.get("weight"));
  const reps = Number(formData.get("reps"));

  const newSet = { id: Date.now(), date, exercise, weight, reps };

  workouts.push(newSet);

  renderWorkouts(); // ← ОЦЕ ГОЛОВНЕ

  form.reset();
});

updateActiveHint();
renderWorkouts(); // ← показати початковий стан
