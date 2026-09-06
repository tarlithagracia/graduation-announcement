/* iOS Safari's toolbar collapses on the very first scroll away from the
   top of the page, and that specific transition can outrace a plain
   resize listener -- dvh, and even visualViewport's own resize event,
   don't always land before the browser paints the new (taller) viewport.
   Recomputing on scroll too (rAF-throttled) catches it regardless of
   which resize-family event does or doesn't fire on a given device. */
function setViewportHeight() {
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setViewportHeight);
}
let vhScrollTicking = false;
window.addEventListener('scroll', () => {
  if (vhScrollTicking) return;
  vhScrollTicking = true;
  requestAnimationFrame(() => {
    setViewportHeight();
    vhScrollTicking = false;
  });
}, { passive: true });

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

/* Answering the quiz goes to the card, with feedback on the way. */

const correctOption = document.querySelector('.option[data-answer]');
const feedback = document.querySelector('[data-quiz-feedback]');

const FEEDBACK = {
  correct: "Yes! You really know her \u{1F389}",
  wrong: "Nice try — she's actually getting a job.",
};

function say(kind) {
  feedback.textContent = FEEDBACK[kind];
  feedback.classList.remove('is-wrong', 'is-correct', 'is-visible');
  requestAnimationFrame(() => {
    feedback.classList.add(kind, 'is-visible');
  });
}

document.querySelectorAll('.option').forEach((option) => {
  option.addEventListener('click', () => {
    if (finished) return;
    running = false;
    finished = true;

    if (option === correctOption) {
      option.classList.add('is-answer', 'is-correct');
      say('correct');
      setTimeout(showCard, 1200);
    } else {
      option.classList.add('is-wrong');
      say('wrong');
      setTimeout(() => correctOption.classList.add('is-answer'), 500);
      setTimeout(showCard, 1900);
    }
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
