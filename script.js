/* ============================================================
   DECORA — Civil and Interiors | script.js
   ============================================================ */
"use strict";

/* ---------- 1. Mobile navigation ---------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
});

// Close drawer when a link is clicked
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  })
);

/* ---------- 2. Sticky navbar shadow on scroll ---------- */
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ---------- 3. Active nav link on scroll (scroll spy) ---------- */
const sections = document.querySelectorAll("section[id]");

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((s) => spy.observe(s));

/* ---------- 4. Reveal-on-scroll animations ---------- */
const revealer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

/* ---------- 5. Animated hero counters ---------- */
const counters = document.querySelectorAll("[data-count]");

const countUp = (el) => {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + (progress === 1 ? "+" : "");
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((c) => counterObserver.observe(c));

/* ---------- 6. Project category filter ---------- */
const filterBar = document.getElementById("filterBar");
const projectCards = document.querySelectorAll(".project-card");

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const filter = btn.dataset.filter;
  projectCards.forEach((card) => {
    const show = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("hidden", !show);
  });
});

/* ---------- 7. Contact form validation ---------- */
const form = document.getElementById("contactForm");
const successMsg = document.getElementById("formSuccess");

const validators = {
  name: (v) => v.trim().length >= 2 || "Please enter your name.",
  phone: (v) => /^[+\d][\d\s-]{7,14}$/.test(v.trim()) || "Enter a valid phone number.",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
  message: (v) => v.trim().length >= 10 || "Message should be at least 10 characters.",
};

const validateField = (input) => {
  const rule = validators[input.name];
  if (!rule) return true;

  const result = rule(input.value);
  const group = input.closest(".form-group");
  const errorEl = group.querySelector(".error");

  group.classList.toggle("invalid", result !== true);
  errorEl.textContent = result === true ? "" : result;
  return result === true;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll("input, textarea");
  const allValid = [...inputs].map(validateField).every(Boolean);

  if (!allValid) return;

  // Replace this with a real submission (e.g. fetch to your backend or
  // a service like Formspree) when you deploy the site.
  form.reset();
  successMsg.hidden = false;
  setTimeout(() => (successMsg.hidden = true), 5000);
});

// Live re-validation after first blur
form.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.closest(".form-group").classList.contains("invalid")) {
      validateField(input);
    }
  });
});

/* ---------- 8. Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
