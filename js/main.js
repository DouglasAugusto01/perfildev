// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // Typed role line on hero
  const roleEl = document.querySelector(".role-line .typed");
  if (roleEl) {
    const roles = [
      "Desenvolvedor Full Stack",
      "Java · Spring Boot",
      "Go & APIs REST",
      "React & TypeScript",
      "Educador em Tecnologia",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 60);
    }
    tick();
  }

  // Animated counters
  const counters = document.querySelectorAll(".stat .num[data-count]");
  counters.forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const run = () => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
      } else {
        el.textContent = current + suffix;
        requestAnimationFrame(run);
      }
    };
    if ("IntersectionObserver" in window) {
      const obs2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            obs2.unobserve(entry.target);
          }
        });
      });
      obs2.observe(el);
    } else {
      el.textContent = target + suffix;
    }
  });
});
