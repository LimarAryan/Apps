const timeDisplay = document.getElementById('timeDisplay');
const modeLabel = document.getElementById('modeLabel');
const statusMessage = document.getElementById('statusMessage');
const focusInput = document.getElementById('focusInput');
const breakInput = document.getElementById('breakInput');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const switchBtn = document.getElementById('switchBtn');

let isFocusMode = true;
let remainingSeconds = 25 * 60;
let intervalId = null;

const clampMinutes = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const formatTime = (seconds) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const currentModeMinutes = () =>
  isFocusMode
    ? clampMinutes(focusInput.value, 1, 90, 25)
    : clampMinutes(breakInput.value, 1, 30, 5);

const render = () => {
  timeDisplay.textContent = formatTime(remainingSeconds);
  modeLabel.textContent = isFocusMode ? 'Focus session' : 'Break session';
};

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  startPauseBtn.textContent = 'Start';
};

const setMode = (focusMode) => {
  isFocusMode = focusMode;
  remainingSeconds = currentModeMinutes() * 60;
  render();
};

const completeSession = () => {
  stopTimer();
  statusMessage.textContent = isFocusMode
    ? 'Nice work. Time for a short break.'
    : 'Break complete. Ready to focus again?';
  setMode(!isFocusMode);
};

const tick = () => {
  remainingSeconds -= 1;
  render();

  if (remainingSeconds <= 0) {
    completeSession();
  }
};

const startTimer = () => {
  if (intervalId) return;

  statusMessage.textContent = isFocusMode ? 'Focus mode running.' : 'Break mode running.';
  startPauseBtn.textContent = 'Pause';
  intervalId = setInterval(tick, 1000);
};

startPauseBtn.addEventListener('click', () => {
  if (intervalId) {
    stopTimer();
    statusMessage.textContent = 'Timer paused.';
  } else {
    startTimer();
  }
});

resetBtn.addEventListener('click', () => {
  stopTimer();
  remainingSeconds = currentModeMinutes() * 60;
  statusMessage.textContent = 'Timer reset.';
  render();
});

switchBtn.addEventListener('click', () => {
  stopTimer();
  setMode(!isFocusMode);
  statusMessage.textContent = isFocusMode ? 'Switched to focus mode.' : 'Switched to break mode.';
});

focusInput.addEventListener('change', () => {
  focusInput.value = clampMinutes(focusInput.value, 1, 90, 25);
  if (isFocusMode && !intervalId) {
    remainingSeconds = currentModeMinutes() * 60;
    render();
  }
});

breakInput.addEventListener('change', () => {
  breakInput.value = clampMinutes(breakInput.value, 1, 30, 5);
  if (!isFocusMode && !intervalId) {
    remainingSeconds = currentModeMinutes() * 60;
    render();
  }
});

render();
