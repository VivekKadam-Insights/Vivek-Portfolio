(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.getElementById("scroll-progress");
  const backTop = document.getElementById("back-top");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  document.getElementById("year").textContent = new Date().getFullYear();

  // Scroll progress + back-to-top state, throttled to animation frames.
  let scrollQueued = false;
  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    backTop.classList.toggle("visible", window.scrollY > 500);
    scrollQueued = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }, { passive: true });
  updateScrollUI();

  // Progressive reveal: content remains visible if observer is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("in-view"));
  }

  // Mobile navigation; closes after selecting a destination.
  menuToggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(opened));
    menuToggle.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }));

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
})();
