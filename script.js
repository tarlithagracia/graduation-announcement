/* GRACIA graduated! — prototype behaviour
   Everything you might want to edit lives in CONFIG.                        */

const CONFIG = {
  // Fill these in — until you do, the buttons explain themselves instead of
  // going nowhere.
  linkedin: 'https://www.linkedin.com/in/YOUR-HANDLE',
  resume: 'assets/gracia-resume.pdf',
  email: 'YOUR-EMAIL@example.com',

  quiz: {
    seconds: 10,
    correct: 'c',
    // shown after an answer, keyed by the option letter
    replies: {
      a: 'Aspirational! Currently blocked by step one below.',
      b: 'Someday. The budget currently says "Seattle".',
      c: 'Correct. Which is exactly why you should keep scrolling.',
      d: 'True on weekends. The seals are lovely. They do not pay.',
    },
    timeout: 'Time is up! The answer is (c) — getting a job.',
  },

  share: {
    title: 'GRACIA — Product Designer',
    text: 'Gracia just graduated (MHCID, University of Washington) and is looking for a product design role. Here is her card:',
  },
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* --- toast ---------------------------------------------------------------- */

const toastEl = $('[data-toast]');
let toastTimer;
function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('is-shown');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-shown'), 2600);
}

/* --- missing assets degrade to labelled gradients -------------------------- */

$$('[data-asset]').forEach((img) => {
  const holder = img.closest('[data-photo]');
  if (!holder) return;
  const fail = () => holder.classList.add('is-missing');
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener('error', fail);
});

/* --- scroll reveals -------------------------------------------------------- */

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
$$('.reveal').forEach((el) => revealer.observe(el));

/* --- in-page navigation ---------------------------------------------------- */

$$('[data-scroll]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = $(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

/* --- then / now: tap the collage to peek ----------------------------------- */

const collage = $('[data-peek]');
if (collage) {
  collage.addEventListener('click', () => {
    const peeking = collage.classList.toggle('is-peeking');
    collage.setAttribute('aria-pressed', String(peeking));
  });
}

/* --- the quiz: 10s countdown on a circular progress ring ------------------- */

const quiz = $('.quiz');
const timerEl = $('[data-timer]');
const timerNum = $('[data-timer-num]');
const timerSr = $('[data-timer-sr]');
const bar = $('.timer__bar');
const verdict = $('[data-verdict]');
const options = $$('.option');
const CIRCUMFERENCE = 2 * Math.PI * 44;

let remaining = CONFIG.quiz.seconds;
let running = false;
let settled = false;
let lastFrame = 0;
let advanceTimer;

function paintTimer() {
  const ratio = Math.max(0, remaining) / CONFIG.quiz.seconds;
  bar.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - ratio));
  const shown = Math.max(0, Math.ceil(remaining - 0.0001));
  if (timerNum.textContent !== String(shown)) {
    timerNum.textContent = String(shown);
    timerSr.textContent = `${shown} seconds left`;
  }
  timerEl.classList.toggle('is-urgent', !settled && remaining <= 3 && remaining > 0);
}

function tick(now) {
  if (!running) return;
  const delta = (now - lastFrame) / 1000;
  lastFrame = now;
  remaining -= delta;
  if (remaining <= 0) {
    remaining = 0;
    paintTimer();
    settle(null);
    return;
  }
  paintTimer();
  requestAnimationFrame(tick);
}

function startTimer() {
  if (running || settled) return;
  running = true;
  lastFrame = performance.now();
  requestAnimationFrame(tick);
}

function pauseTimer() {
  running = false;
}

function settle(choice) {
  if (settled) return;
  settled = true;
  running = false;
  timerEl.classList.remove('is-urgent');
  timerEl.classList.add('is-done');
  quiz.classList.add('is-answered');

  options.forEach((option) => {
    option.disabled = true;
    if (option.dataset.option === CONFIG.quiz.correct) option.classList.add('is-correct');
    if (choice && option.dataset.option === choice) {
      option.classList.add('is-chosen');
      if (choice !== CONFIG.quiz.correct) option.classList.add('is-wrong');
    }
  });

  verdict.textContent = choice ? CONFIG.quiz.replies[choice] : CONFIG.quiz.timeout;
  verdict.classList.add('is-shown');

  advanceTimer = setTimeout(() => {
    $('#card').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, choice === CONFIG.quiz.correct ? 1600 : 2400);
}

options.forEach((option) => {
  option.addEventListener('click', () => settle(option.dataset.option));
});

$('[data-skip]')?.addEventListener('click', () => {
  clearTimeout(advanceTimer);
  pauseTimer();
});

// the countdown only runs while the quiz is actually on screen
const quizPanel = $('#quiz');
if (quizPanel) {
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? startTimer() : pauseTimer()));
  }, { threshold: 0.6 }).observe(quizPanel);
}
paintTimer();

/* --- the card: links + share ----------------------------------------------- */

const placeholder = /YOUR-HANDLE|YOUR-EMAIL/;
const linkTargets = {
  linkedin: { href: CONFIG.linkedin, hint: 'Add your LinkedIn URL in script.js' },
  resume: { href: CONFIG.resume, hint: 'Drop your resume at assets/gracia-resume.pdf' },
  email: { href: `mailto:${CONFIG.email}`, hint: 'Add your email in script.js' },
};

$$('[data-link]').forEach((link) => {
  const target = linkTargets[link.dataset.link];
  if (!target) return;
  link.href = target.href;
  link.addEventListener('click', (event) => {
    if (placeholder.test(target.href)) {
      event.preventDefault();
      toast(target.hint);
    }
  });
});

$('[data-share]')?.addEventListener('click', async () => {
  const payload = { ...CONFIG.share, url: location.href };
  if (navigator.share) {
    try {
      await navigator.share(payload);
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(`${payload.text} ${payload.url}`);
    toast('Link copied — go on, send it to a recruiter.');
  } catch {
    toast(location.href);
  }
});

/* --- confetti on the card -------------------------------------------------- */

const canvas = $('[data-confetti]');
const COLORS = ['#FFD1A8', '#FF406C', '#D1FF00', '#FFFFFF'];

function celebrate() {
  if (reduceMotion || !canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * width,
    y: -20 - Math.random() * height * 0.4,
    w: 4 + Math.random() * 5,
    h: 6 + Math.random() * 8,
    vy: 40 + Math.random() * 90,
    vx: -20 + Math.random() * 40,
    spin: -3 + Math.random() * 6,
    angle: Math.random() * Math.PI,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  let previous = performance.now();
  const finish = previous + 4200;

  (function draw(now) {
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    ctx.clearRect(0, 0, width, height);

    pieces.forEach((piece) => {
      piece.y += piece.vy * delta;
      piece.x += piece.vx * delta;
      piece.angle += piece.spin * delta;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.angle);
      ctx.globalAlpha = now > finish - 1200 ? Math.max(0, (finish - now) / 1200) : 1;
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    });

    if (now < finish) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, width, height);
  })(previous);
}

const cardPanel = $('#card');
if (cardPanel) {
  const partyWatcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      partyWatcher.disconnect();
      celebrate();
    });
  }, { threshold: 0.5 });
  partyWatcher.observe(cardPanel);
}
