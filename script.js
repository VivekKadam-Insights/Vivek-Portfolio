
/* ==========================================
   VIVEK KADAM — PORTFOLIO INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    const progress = document.getElementById("scroll-progress");
    const backTop = document.getElementById("back-top");
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");
    const year = document.getElementById("year");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* --------------------------------------
       CURRENT YEAR
    -------------------------------------- */

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* --------------------------------------
       SCROLL PROGRESS & BACK TO TOP
    -------------------------------------- */

    let scrollTicking = false;

    function updateScrollElements() {

        const scrollTop =
            window.scrollY || document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        if (progress) {
            progress.style.width = `${percentage}%`;
        }

        if (backTop) {
            backTop.classList.toggle("visible", scrollTop > 450);
        }

        scrollTicking = false;
    }

    window.addEventListener("scroll", () => {

        if (!scrollTicking) {
            window.requestAnimationFrame(updateScrollElements);
            scrollTicking = true;
        }

    }, { passive: true });

    updateScrollElements();


    /* --------------------------------------
       MOBILE NAVIGATION
    -------------------------------------- */

    function closeMenu() {

        if (!menuToggle || !nav) return;

        nav.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Open navigation" : "Close navigation"
            );

            nav.classList.toggle("open", !isOpen);

        });

        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        document.addEventListener("click", event => {

            if (
                nav.classList.contains("open") &&
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 700) {
                closeMenu();
            }

        });

    }


    /* --------------------------------------
       BACK TO TOP
    -------------------------------------- */

    if (backTop) {

        backTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });

        });

    }


    /* --------------------------------------
       REVEAL ON SCROLL
    -------------------------------------- */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reduceMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("in-view");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

        // Enable hidden reveal styles only after observer setup.
        document.documentElement.classList.add("js-ready");

    } else {

        revealElements.forEach(element => {
            element.classList.add("in-view");
        });

    }


    /* --------------------------------------
       ACTIVE NAVIGATION LINK
    -------------------------------------- */

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if ("IntersectionObserver" in window && sections.length) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const currentId = entry.target.id;

                        navLinks.forEach(link => {

                            const isActive =
                                link.getAttribute("href") === `#${currentId}`;

                            link.classList.toggle("active", isActive);

                        });

                    }

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* --------------------------------------
       IMAGE FALLBACK
    -------------------------------------- */

    const profileImage = document.querySelector(".profile-image");

    if (profileImage) {

        profileImage.addEventListener("error", () => {

            profileImage.style.opacity = "0.2";
            profileImage.alt = "Profile image unavailable";

            console.error(
                "Profile image not found. Check assets/profile.jpg"
            );

        }, { once: true });

    }

});
