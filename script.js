
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const progress = document.getElementById("scroll-progress");
    const backTop = document.querySelector(".back-top");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const year = document.querySelector(".footer-year");

    // Copyright year
    if (year) {
      year.textContent = new Date().getFullYear();
    }

    // Scroll progress
    let scrollQueued = false;

    function updateScrollUI() {
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const ratio =
        maxScroll > 0 ? window.scrollY / maxScroll : 0;

      if (progress) {
        progress.style.width =
          `${Math.max(0, Math.min(100, ratio * 100))}%`;
      }

      if (backTop) {
        backTop.classList.toggle(
          "visible",
          window.scrollY > 450
        );
      }

      scrollQueued = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!scrollQueued) {
          scrollQueued = true;
          requestAnimationFrame(updateScrollUI);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", updateScrollUI);
    updateScrollUI();

    // Scroll reveal
    const revealElements = document.querySelectorAll(
      ".reveal"
    );

    if (
      !reduceMotion &&
      "IntersectionObserver" in window
    ) {
      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              currentObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -35px 0px"
        }
      );

      revealElements.forEach(element => {
        observer.observe(element);
      });
    } else {
      revealElements.forEach(element => {
        element.classList.add("in-view");
      });
    }

    // Mobile menu
    if (menuToggle && nav) {
      menuToggle.addEventListener("click", () => {
        const opened = nav.classList.toggle("open");

        menuToggle.setAttribute(
          "aria-expanded",
          String(opened)
        );

        menuToggle.setAttribute(
          "aria-label",
          opened ? "Close navigation" : "Open navigation"
        );
      });

      nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          nav.classList.remove("open");

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
          );
        });
      });
    }

    // Back to top
    if (backTop) {
      backTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth"
        });
      });
    }

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const selector = link.getAttribute("href");

        if (!selector || selector === "#") {
          return;
        }

        let target;

        try {
          target = document.querySelector(selector);
        } catch {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });
      });
    });
  });
})();
