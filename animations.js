/* =====================================================
   PREMIUM PORTFOLIO MOTION CONTROLLER
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealItems = document.querySelectorAll(
        ".section-title, .section-label, .about-card, " +
        ".education-card, .skill-card, .project-card, " +
        ".project-empty, .contact-card"
    );

    /* Scroll reveal */
    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealItems.forEach((element, index) => {
            element.classList.add("js-reveal");

            if (element.classList.contains("skill-card")) {
                element.style.transitionDelay =
                    `${(index % 7) * 80}ms`;
            }

            revealObserver.observe(element);
        });
    } else {
        revealItems.forEach(element => {
            element.classList.add("is-visible");
        });
    }

    /* Premium mouse tilt on desktop cards */
    if (!reduceMotion && window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches) {

        const tiltCards = document.querySelectorAll(
            ".skill-card, .project-card, .project-empty"
        );

        tiltCards.forEach(card => {
            card.addEventListener("mousemove", event => {
                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((centerY - y) / centerY) * 5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform =
                    `perspective(900px) ` +
                    `rotateX(${rotateX}deg) ` +
                    `rotateY(${rotateY}deg) ` +
                    `translateY(-8px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* Smooth anchor navigation */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });
});
