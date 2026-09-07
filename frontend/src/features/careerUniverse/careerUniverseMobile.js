import { experiences } from "../experienceMap/experienceMapData.js";
import { careerUniversePlanets } from "./careerUniverseData.js";
import "./careerUniverseMobile.css";

const chapters = [
  {
    id: "survey", label: "Surveying", step: "Measure", title: "Start with the real world.",
    description: "Capturing the physical world with precise and reliable data.",
    educationId: "bachelor",
  },
  {
    id: "gis", label: "GIS", step: "Understand", title: "Find the story in the data.",
    description: "Transforming spatial data into maps, insight and understanding.",
    educationId: "uq",
  },
  {
    id: "it", label: "IT", step: "Build", title: "Turn ideas into useful tools.",
    description: "Building software, automation and digital solutions.",
    educationId: "qut",
  },
].map((chapter) => ({
  ...chapter,
  skills: careerUniversePlanets
    .find((planet) => planet.id === chapter.id)
    .satellites.map((satellite) => satellite.label),
}));

function renderIllustration(id) {
  const drawings = {
    survey: `
      <path d="M42 139 104 88 145 110 207 51 279 128" />
      <path d="m42 155 63-47 42 24 61-59 71 70M65 165l43-36 40 25 62-60 48 55" opacity=".35" />
      <path d="M105 87h102M145 110l62-59M105 87l40 23" stroke-dasharray="3 6" opacity=".6" />
      <circle cx="105" cy="87" r="5" /><circle cx="145" cy="110" r="5" /><circle cx="207" cy="51" r="5" />
      <path d="m150 166 10-53 10 53m-10-53v58m-15-58h30" />
      <rect x="146" y="94" width="28" height="17" rx="4" fill="var(--chapter-paper)" />
      <circle cx="160" cy="102" r="4" />`,
    gis: `
      <path d="m66 126 94-49 94 49-94 49z" fill="var(--chapter-wash)" />
      <path d="m66 104 94-49 94 49-94 49z" fill="var(--chapter-paper)" />
      <path d="m66 82 94-49 94 49-94 49z" fill="var(--chapter-wash)" />
      <path d="m104 63 92 50m-65-64 92 50m-116 5 91-50m-61 66 91-50" opacity=".3" />
      <path d="M181 61c0 14-21 31-21 31s-21-17-21-31a21 21 0 1 1 42 0Z" fill="var(--chapter-paper)" />
      <circle cx="160" cy="60" r="7" />`,
    it: `
      <rect x="81" y="48" width="158" height="99" rx="12" fill="var(--chapter-paper)" />
      <path d="M81 70h158" /><circle cx="94" cy="59" r="2" /><circle cx="104" cy="59" r="2" /><circle cx="114" cy="59" r="2" />
      <path d="m136 89-17 15 17 15m48-30 17 15-17 15m-17-33-14 37" stroke-width="3" />
      <path d="M81 102H51V77m188 25h30v27M160 147v24" stroke-dasharray="4 5" />
      <circle cx="51" cy="69" r="8" fill="var(--chapter-paper)" /><circle cx="269" cy="137" r="8" fill="var(--chapter-paper)" />
      <circle cx="160" cy="179" r="6" fill="var(--chapter-paper)" />`,
  };
  return `
    <svg viewBox="0 0 320 210" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="160" cy="105" r="87" stroke-dasharray="2 8" opacity=".22" />
      <circle cx="160" cy="105" r="67" opacity=".1" />
      <g class="career-mobile-drawing">${drawings[id]}</g>
      <path d="M38 44v10m-5-5h10m237 111v10m-5-5h10" opacity=".5" />
    </svg>`;
}

export function renderCareerUniverseMobile() {
  return `
    <div class="career-universe-mobile-hero">
      <div class="career-universe-mobile-copy">
        <h1 class="career-universe-headline"><span class="text-terracotta">Hi,</span> I'm <strong><span class="text-green">Yufei</span> <span class="text-blue">He.</span></strong></h1>
        <p class="career-mobile-intro">
          I combine <strong class="text-terracotta">surveying</strong>,
          <strong class="text-green">GIS</strong> and
          <strong class="text-blue">software engineering</strong> to solve real-world problems.
          From spatial analysis and automation to full-stack web applications,
          I build practical, data-driven solutions.
        </p>
        <div class="career-mobile-actions">
          <a class="career-mobile-primary" href="#projects">View projects <span aria-hidden="true">↗</span></a>
          <a href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="career-mobile-explorer" role="region" aria-label="Explore my three disciplines">
        <div class="career-mobile-chapters" role="group" aria-label="Choose a discipline">
          ${chapters.map((chapter, index) => `<button type="button" class="career-mobile-chapter ${chapter.id}" data-mobile-chapter="${index}" aria-pressed="${index === 0}" aria-controls="career-mobile-cards"><span aria-hidden="true">0${index + 1}</span> ${chapter.label}</button>`).join("")}
        </div>
        <div class="career-mobile-cards" id="career-mobile-cards" tabindex="0" aria-label="Swipe left or right, or use the discipline buttons above">
          ${chapters.map((chapter, index) => {
            const education = experiences.find((entry) => entry.id === chapter.educationId);
            return `
              <article class="career-mobile-card ${chapter.id}" aria-label="${index + 1} of ${chapters.length}: ${chapter.label}">
                <div class="career-mobile-art">${renderIllustration(chapter.id)}<span>${chapter.step}</span></div>
                <div class="career-mobile-card-copy">
                  <p class="career-mobile-step">0${index + 1} / ${chapter.step}</p>
                  <h2>${chapter.title}</h2>
                  <p class="career-mobile-description">${chapter.description}</p>
                  <ul class="career-mobile-skills" aria-label="${chapter.label} skills">${chapter.skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>
                  <p class="career-mobile-education"><strong>${education.title}</strong><span>${education.organization}</span></p>
                </div>
              </article>`;
          }).join("")}
        </div>
        <div class="career-mobile-pagination"><span>Swipe to explore <span aria-hidden="true">↔</span></span><span data-mobile-page aria-hidden="true">01 / 03</span></div>
        <p class="sr-only" data-mobile-announcement role="status" aria-live="polite"></p>
      </div>
    </div>`;
}

export function mountCareerUniverseMobile(section) {
  const track = section.querySelector(".career-mobile-cards");
  const navigation = section.querySelector(".career-mobile-chapters");
  const buttons = [...navigation.querySelectorAll("[data-mobile-chapter]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = Math.max(0, buttons.findIndex((button) => button.getAttribute("aria-pressed") === "true"));
  let frameId = 0;
  let trackWidth = track.clientWidth;
  track.scrollLeft = activeIndex * trackWidth;

  function updateSelection(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    buttons.forEach((button, buttonIndex) => button.setAttribute("aria-pressed", String(buttonIndex === index)));
    section.querySelector("[data-mobile-page]").textContent = `0${index + 1} / 03`;
    section.querySelector("[data-mobile-announcement]").textContent = `${chapters[index].label}, ${index + 1} of ${chapters.length}`;
  }

  function selectChapter(index) {
    track.scrollTo({ left: index * track.clientWidth, behavior: reducedMotion.matches ? "instant" : "smooth" });
  }

  function handleClick(event) {
    const button = event.target.closest("[data-mobile-chapter]");
    if (button) selectChapter(Number(button.dataset.mobileChapter));
  }

  function handleKeydown(event) {
    const button = event.target.closest("[data-mobile-chapter]");
    const current = button ? Number(button.dataset.mobileChapter) : activeIndex;
    const targets = { ArrowLeft: Math.max(0, current - 1), ArrowRight: Math.min(chapters.length - 1, current + 1), Home: 0, End: chapters.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const index = targets[event.key];
    if (button) buttons[index].focus({ preventScroll: true });
    selectChapter(index);
  }

  function handleScroll() {
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      if (!trackWidth) return;
      updateSelection(Math.max(0, Math.min(chapters.length - 1, Math.round(track.scrollLeft / trackWidth))));
    });
  }

  const resizeObserver = new ResizeObserver(() => {
    const width = track.clientWidth;
    if (!width || width === trackWidth) return;
    trackWidth = width;
    track.scrollLeft = activeIndex * width;
  });
  resizeObserver.observe(track);
  navigation.addEventListener("click", handleClick);
  navigation.addEventListener("keydown", handleKeydown);
  track.addEventListener("keydown", handleKeydown);
  track.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    resizeObserver.disconnect();
    cancelAnimationFrame(frameId);
    navigation.removeEventListener("click", handleClick);
    navigation.removeEventListener("keydown", handleKeydown);
    track.removeEventListener("keydown", handleKeydown);
    track.removeEventListener("scroll", handleScroll);
  };
}
