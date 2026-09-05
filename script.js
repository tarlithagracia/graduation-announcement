/* The three links on the card. */
const CONFIG = {
  linkedin: 'https://www.linkedin.com/in/tarlithagracia/',
  resume: 'https://drive.google.com/file/d/1SdrXPnBqe29Xaq2BNfkzhFGHwz6gGojj/view?usp=sharing',
  portfolio: 'https://designbygracia.com',
  seconds: 10,
};

const timerNum = document.querySelector('[data-timer-num]');
const bar = document.querySelector('.timer__bar');
const quizPanel = document.querySelector('#quiz');
const card = document.querySelector('#card');
const CIRCUMFERENCE = 2 * Math.PI * 44;

/* The "10" above the quiz, counting down on the circular progress ring. */

let remaining = CONFIG.seconds;
let running = false;
let finished = false;
let lastFrame = 0;

function paint() {
  bar.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - Math.max(0, remaining) / CONFIG.seconds));
  timerNum.textContent = String(Math.max(0, Math.ceil(remaining - 0.0001)));
}

function tick(now) {
  if (!running) return;
  remaining -= (now - lastFrame) / 1000;
  lastFrame = now;
  if (remaining <= 0) {
    remaining = 0;
    running = false;
    finished = true;
    paint();
    showCard();
    return;
  }
  paint();
  requestAnimationFrame(tick);
}

function start() {
  if (running || finished) return;
  running = true;
  lastFrame = performance.now();
  requestAnimationFrame(tick);
}

function showCard() {
  card.scrollIntoView({ block: 'start' });
}

// the countdown runs while the quiz is on screen
new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) start();
    else running = false;
  });
}, { threshold: 0.6 }).observe(quizPanel);

paint();

/* Answering the quiz goes to the card. */

document.querySelectorAll('.option').forEach((option) => {
  option.addEventListener('click', () => {
    if (finished) return;
    running = false;
    finished = true;
    document.querySelector('.option[data-answer]').classList.add('is-answer');
    setTimeout(showCard, 1000);   // a beat to see the answer, then the card
  });
});

/* The card's three links. */

document.querySelectorAll('[data-link]').forEach((link) => {
  const href = CONFIG[link.dataset.link];
  if (href) link.href = href;
  else link.addEventListener('click', (event) => event.preventDefault());
});

/* Share. */

document.querySelector('[data-share]').addEventListener('click', async () => {
  const payload = { title: 'GRACIA — Product Designer', url: location.href };
  if (navigator.share) {
    try {
      await navigator.share(payload);
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(location.href);
  } catch {}
});
