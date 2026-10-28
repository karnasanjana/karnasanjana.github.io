// Small touches: pipeline stage sweep, count-up receipts, scroll reveals, chart animation.
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Light up pipeline stages one after another, on a loop
  const stages = [...document.querySelectorAll(".pipeline .stage")];
  if (stages.length && !reduced) {
    let i = 0;
    setInterval(() => {
      stages.forEach((s, n) => s.classList.toggle("on", n <= i));
      i = (i + 1) % (stages.length + 1);
    }, 700);
  } else {
    stages.forEach((s) => s.classList.add("on"));
  }

  // Count numbers up the first time they scroll into view
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const start = performance.now(), dur = 1200;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = pre + (target * eased).toFixed(decimals) + suf;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const revealTargets = document.querySelectorAll(".project, .card, .skills > div, .receipts > div, .contact");
  if (!("IntersectionObserver" in window) || reduced) {
    document.querySelectorAll(".bars").forEach((b) => b.classList.add("go"));
    return;
  }
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("in");
      el.querySelectorAll("[data-count]").forEach(countUp);
      el.querySelectorAll(".bars").forEach((b) => b.classList.add("go"));
      io.unobserve(el);
    });
  }, { threshold: 0.2 });
  revealTargets.forEach((el) => io.observe(el));
})();
