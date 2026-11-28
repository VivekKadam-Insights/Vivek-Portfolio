/* ==========================================
   PORTFOLIO SCROLL ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const animatedElements = document.querySelectorAll(
        ".section-title, .section-label, .about-card, " +
        ".education-card, .skill-card, .project-card, " +
        ".project-empty, .contact-card"
    );

    animatedElements.forEach(function (element) {
        element.classList.add("js-reveal");
    });

    const observer = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    animatedElements.forEach(function (element) {
        observer.observe(element);
    });
});
