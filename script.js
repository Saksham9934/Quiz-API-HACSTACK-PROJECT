let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let selectedAnswers = [];

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Start Quiz
async function startQuiz() {
  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;

  const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("No questions found. Try another category.");
      return;
    }

    questions = data.results;
    currentIndex = 0;
    score = 0;

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    loadQuestion();
  } catch (error) {
    console.log(error);
    alert("Failed to load quiz. Check internet or API.");
  }
}

// Load Question
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  selectedAnswers = [];

  const q = questions[currentIndex];

  document.getElementById("progress").innerText =
    `Question ${currentIndex + 1}/${questions.length}`;

  document.getElementById("score").innerText = "Score: " + score;

  document.getElementById("question").innerText =
    decodeHTML(q.question);

  const options = [...q.incorrect_answers, q.correct_answer]
    .map(decodeHTML)
    .sort(() => Math.random() - 0.5);

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  options.forEach(opt => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.innerText = opt;

    div.onclick = () => {
      div.classList.toggle("selected");

      if (selectedAnswers.includes(opt)) {
        selectedAnswers = selectedAnswers.filter(a => a !== opt);
      } else {
        selectedAnswers.push(opt);
      }
    };

    optionsDiv.appendChild(div);
  });

  startTimer();
}

// Timer
function startTimer() {
  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      nextQuestion();
    }
  }, 1000);
}

// Next Question
function nextQuestion() {
  checkAnswer();

  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

// Check Answer
function checkAnswer() {
  const correct = decodeHTML(questions[currentIndex].correct_answer);

  if (
    selectedAnswers.length === 1 &&
    selectedAnswers[0] === correct
  ) {
    score += 3;
  }
}

// Show Result
function showResult() {

    clearInterval(timer);

    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    const totalQuestions = questions.length;

    // Each correct answer = 3 marks
    const correctAnswers = score / 3;

    const wrongAnswers = totalQuestions - correctAnswers;

    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    // Result Cards
    document.getElementById("totalQuestions").textContent = totalQuestions;
    document.getElementById("correctAnswers").textContent = correctAnswers;
    document.getElementById("wrongAnswers").textContent = wrongAnswers;
    document.getElementById("percentage").textContent = percentage + "%";

    // Final Score
    document.getElementById("final-score").textContent =
        `${correctAnswers} / ${totalQuestions}`;

    // Performance
    const summary = document.getElementById("summary");
    const badge = document.getElementById("performanceBadge");

    if (percentage >= 90) {
        summary.textContent = "Outstanding Performance! 🌟";
        badge.textContent = "🏆 Excellent";
        badge.className = "performance-badge excellent";
    }
    else if (percentage >= 75) {
        summary.textContent = "Great Job! 🎉";
        badge.textContent = "🥇 Very Good";
        badge.className = "performance-badge good";
    }
    else if (percentage >= 50) {
        summary.textContent = "Good Effort! 👍";
        badge.textContent = "🥈 Good";
        badge.className = "performance-badge average";
    }
    else {
        summary.textContent = "Keep Practicing! 💪";
        badge.textContent = "📖 Needs Improvement";
        badge.className = "performance-badge poor";
    }
}

const icons = document.querySelectorAll(".social-item");

icons.forEach(icon=>{

    icon.addEventListener("mouseenter",()=>{

        icon.style.transform="translateY(-12px) rotate(5deg) scale(1.12)";

    });

    icon.addEventListener("mouseleave",()=>{

        icon.style.transform="translateY(0px) rotate(0deg) scale(1)";

    });

});
/* ==========================
      DARK MODE
========================== */

const toggle = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");

// Load Saved Theme
if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    toggle.checked = true;

    themeText.innerHTML = "🌙 Dark";
}
else{

    themeText.innerHTML = "🌞 Light";
}

// Toggle Theme
toggle.addEventListener("change",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeText.innerHTML="🌙 Dark";
    }
    else{

        localStorage.setItem("theme","light");

        themeText.innerHTML="🌞 Light";
    }

});