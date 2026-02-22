const form = document.getElementById("workout-form");
const workoutsContainer = document.getElementById("workouts");

const workouts = [];

function renderWorkouts() {
  if (workouts.length === 0) {
    workoutsContainer.innerHTML =
      '<p class="empty">Поки що немає записів. Додай перший сет 👆</p>';
    return;
  }

  const html = workouts
    .map(
      (set) => `
        <div class="workout-item">
          <div class="workout-item__top">
            <span>${set.date}</span>
            <span>${set.exercise}</span>
          </div>
          <div class="workout-item__bottom">
            ${set.weight} кг × ${set.reps} повторів
          </div>
        </div>
      `,
    )
    .join("");

  workoutsContainer.innerHTML = html;
}

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

renderWorkouts(); // ← показати початковий стан
