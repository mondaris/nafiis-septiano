const header = document.querySelector(".site-header");
const toTop = document.querySelector("#to-top");
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");
const year = document.querySelector("#year");
let scrollFrame = null;
let restoreScrollBehavior = null;

function updateScrollState() {
  const isScrolled = window.scrollY > 24;
  header.classList.toggle("is-scrolled", isScrolled);
  toTop.classList.toggle("is-visible", window.scrollY > 480);
}

function closeMenu() {
  hamburger.classList.remove("is-open");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open navigation");
  navMenu.classList.remove("is-open");
}

function cancelScroll() {
  if (scrollFrame !== null) {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  }

  if (restoreScrollBehavior) {
    restoreScrollBehavior();
    restoreScrollBehavior = null;
  }
}

function scrollToSection(target, hash) {
  cancelScroll();

  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  const scrollPadding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const start = window.scrollY;
  const destination = Math.max(
    0,
    start + target.getBoundingClientRect().top - scrollPadding,
  );
  const distance = destination - start;

  const restoreBehavior = () => {
    root.style.scrollBehavior = previousBehavior;
  };
  restoreScrollBehavior = restoreBehavior;
  root.style.scrollBehavior = "auto";

  const finish = () => {
    restoreBehavior();
    restoreScrollBehavior = null;
    scrollFrame = null;

    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    updateScrollState();
  };

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, destination);
    finish();
    return;
  }

  const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.35));
  let startTime;

  const step = (time) => {
    if (startTime === undefined) {
      startTime = time;
    }

    const progress = Math.min((time - startTime) / duration, 1);
    const easedProgress = 1 - (1 - progress) ** 3;
    window.scrollTo(0, start + distance * easedProgress);

    if (progress < 1) {
      scrollFrame = window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, destination);
      finish();
    }
  };

  scrollFrame = window.requestAnimationFrame(step);
}

window.addEventListener("scroll", updateScrollState, { passive: true });

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navMenu.classList.toggle("is-open", isOpen);
});

navMenu.addEventListener("click", (event) => {
  const link =
    event.target instanceof Element
      ? event.target.closest('a[href^="#"]')
      : null;
  const target = link && document.getElementById(link.hash.slice(1));

  if (link && target) {
    event.preventDefault();
    closeMenu();
    scrollToSection(target, link.hash);
  }
});

document.addEventListener("wheel", cancelScroll, { passive: true });
document.addEventListener("touchstart", cancelScroll, { passive: true });
document.addEventListener("pointerdown", cancelScroll);
document.addEventListener("keydown", cancelScroll);

document.addEventListener("click", (event) => {
  const link =
    event.target instanceof Element
      ? event.target.closest('a[href^="#"]')
      : null;
  const target = link && document.getElementById(link.hash.slice(1));

  if (link && target && !navMenu.contains(link)) {
    event.preventDefault();
    scrollToSection(target, link.hash);
    return;
  }

  if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
    closeMenu();
  }
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}

updateScrollState();
