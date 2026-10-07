const ROLES = ["Développeur web", "React & Supabase", "Programmeur C / Unix", "Curieux en cybersécurité", "Toujours en apprentissage"];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20), { passive: true });

const setMenu = (open) => {
  links.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && links.classList.contains("open")) {
    setMenu(false);
    toggle.focus();
  }
});

const glow = document.querySelector(".glow");
if (!reduceMotion) {
  window.addEventListener("pointermove", (e) => {
    glow.style.setProperty("--x", e.clientX + "px");
    glow.style.setProperty("--y", e.clientY + "px");
  }, { passive: true });
}

const typed = document.getElementById("typed");
if (!reduceMotion && ROLES.length > 1) {
  const sequence = [...ROLES.slice(1), ROLES[0]];
  let r = 0, i = ROLES[0].length, deleting = true, word = ROLES[0];
  const tick = () => {
    i += deleting ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 40 : 80;
    if (!deleting && i === word.length) {
      if (r === sequence.length) return;
      deleting = true; delay = 2200;
    } else if (deleting && i === 0) {
      deleting = false; word = sequence[r++]; delay = 300;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2500);
}

const animateCount = (el) => {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now(), dur = 1200;
  const step = (t) => {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-count]").forEach(animateCount);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const copyBtn = document.querySelector(".copy");
const copyStatus = document.getElementById("copy-status");
const label = copyBtn.textContent;
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = "Copié ✓";
    copyStatus.textContent = "Adresse e-mail copiée.";
  } catch {
    copyBtn.textContent = copyBtn.dataset.email;
    copyStatus.textContent = "Copie impossible. Adresse : " + copyBtn.dataset.email;
  }
  setTimeout(() => {
    copyBtn.textContent = label;
    copyStatus.textContent = "";
  }, 2000);
});
