const normalPhrases = [
  "hello world",
  "you passed the test",
  "humans love coffee",
  "agents decode quickly",
  "binary can be fun",
];

const hardPhrases = [
  "你好 世界", // hello world
  "人工 智能 很 快", // ai is fast
  "今天 你 很 棒", // you are great today
  "欢迎 来到 测试 关卡", // welcome to the test level
  "请 在 时间 内 解码", // decode before time ends
];

const state = {
  timer: 15,
  currentAnswer: "",
  countdownId: null,
  isRunning: false,
};

const timeEl = document.getElementById("time");
const binaryEl = document.getElementById("binaryPhrase");
const answerInput = document.getElementById("answerInput");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function textToBinary(text) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked')?.value || "normal";
}

function setResult(message, type) {
  resultEl.textContent = message;
  resultEl.classList.remove("good", "bad");
  if (type) resultEl.classList.add(type);
}

function stopTimer() {
  if (state.countdownId) {
    clearInterval(state.countdownId);
    state.countdownId = null;
  }
  state.isRunning = false;
}

function endRound(didWin) {
  stopTimer();
  submitBtn.disabled = true;
  answerInput.disabled = true;
  startBtn.disabled = false;

  if (didWin) {
    setResult("✅ Correct! You are classified as: AGENT", "good");
  } else {
    setResult(`❌ Wrong! Correct phrase was: "${state.currentAnswer}". You are HUMAN.`, "bad");
  }
}

function startGame() {
  stopTimer();
  setResult("");
  answerInput.value = "";

  const mode = getMode();
  const phrase = mode === "hard" ? pickRandom(hardPhrases) : pickRandom(normalPhrases);

  state.currentAnswer = phrase;
  state.timer = 15;
  state.isRunning = true;

  binaryEl.textContent = textToBinary(phrase);
  timeEl.textContent = String(state.timer);

  answerInput.disabled = false;
  submitBtn.disabled = false;
  startBtn.disabled = true;
  answerInput.focus();

  state.countdownId = setInterval(() => {
    state.timer -= 1;
    timeEl.textContent = String(state.timer);

    if (state.timer <= 0) {
      endRound(false);
      setResult(`⏰ Time's up! Correct phrase was: "${state.currentAnswer}". You are HUMAN.`, "bad");
    }
  }, 1000);
}

function submitAnswer() {
  if (!state.isRunning) return;
  const guess = answerInput.value.trim().toLowerCase();
  const target = state.currentAnswer.trim().toLowerCase();
  endRound(guess === target);
}

function resetGame() {
  stopTimer();
  state.currentAnswer = "";
  state.timer = 15;
  timeEl.textContent = "15";
  binaryEl.textContent = 'Press “Start Test” to begin.';
  answerInput.value = "";
  answerInput.disabled = true;
  submitBtn.disabled = true;
  startBtn.disabled = false;
  setResult("");
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", submitAnswer);
resetBtn.addEventListener("click", resetGame);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitAnswer();
});
