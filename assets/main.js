// Spotlight that follows the cursor, active-section nav, data→ship flow, count-ups, reveals, chart.
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Cursor spotlight
  const spot = document.querySelector(".spotlight");
  if (spot && !reduced && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", (e) => {
      spot.style.setProperty("--x", `${e.clientX}px`);
      spot.style.setProperty("--y", `${e.clientY}px`);
    }, { passive: true });
  }

  // "data → model → eval → ship" lights up stage by stage
  const steps = [...document.querySelectorAll(".flow li")];
  if (!reduced && steps.length) {
    let i = 0;
    setInterval(() => {
      steps.forEach((s, n) => s.classList.toggle("on", n <= i));
      i = (i + 1) % (steps.length + 1);
    }, 800);
  } else {
    steps.forEach((s) => s.classList.add("on"));
  }

  // Highlight the nav link of the section in view
  const links = [...document.querySelectorAll(".toc a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const setActive = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    for (const s of sections) if (s.offsetTop <= y) current = s;
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current.id}`));
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  // Count numbers up once
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || "0", 10);
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 1100);
      el.textContent = pre + (target * (1 - Math.pow(1 - t, 3))).toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const targets = document.querySelectorAll(".section > p, .proof, .item, .edu > div, .mini li, .skills");
  if (reduced || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".bars").forEach((b) => b.classList.add("go"));
    return;
  }
  targets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      target.classList.add("in");
      target.querySelectorAll("[data-count]").forEach(countUp);
      target.querySelectorAll(".bars").forEach((b) => b.classList.add("go"));
      io.unobserve(target);
    }
  }, { threshold: 0.15 });
  targets.forEach((el) => io.observe(el));
})();
