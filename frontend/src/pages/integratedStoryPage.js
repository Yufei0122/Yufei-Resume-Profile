import projectGisPlaceholder from "../source/project-gis-placeholder.svg";
import projectIntegratedPlaceholder from "../source/project-integrated-placeholder.svg";
import projectItPlaceholder from "../source/project-it-placeholder.svg";

const storyProjects = [
  {
    index: "01",
    category: "GIS Development",
    title: "Shaoxing Future Community Display Platform",
    stack: "ArcGIS · C# · WPF",
    summary:
      "Integrated GIS application for spatial visualization, community data display and interactive planning workflows.",
    image: projectIntegratedPlaceholder,
  },
  {
    index: "02",
    category: "Spatial Analysis",
    title: "South D'Aguilar Suitability Analysis",
    stack: "ArcGIS Pro · Python · MCDA",
    summary:
      "Data-driven suitability analysis combining geospatial processing and practical decision support.",
    image: projectGisPlaceholder,
  },
  {
    index: "03",
    category: "Software System",
    title: "Strategic Plan Management System",
    stack: "Laravel · MySQL · JavaScript",
    summary:
      "Full-stack planning and reporting system built to improve operational reliability and information flow.",
    image: projectItPlaceholder,
  },
];

const storySkills = [
  "Spatial Analysis",
  "GIS Development",
  "Python",
  "JavaScript",
  "React",
  "APIs",
  "Databases",
  "Automation",
];

const storyExperience = [
  {
    title: "Integrated Problem Solving",
    text: "Bringing spatial reasoning and software delivery together to solve practical real-world problems.",
  },
  {
    title: "Cross-domain Delivery",
    text: "Comfortable moving between geospatial analysis, backend logic, frontend interaction and data workflows.",
  },
  {
    title: "Professional Readability",
    text: "Building systems that are not only technically sound, but also usable, clear and employer-facing.",
  },
];

const storyEducation = [
  {
    title: "GIS & Spatial Foundations",
    text: "Geospatial science, mapping, survey context and spatial data processing.",
  },
  {
    title: "Software Engineering Practice",
    text: "Application design, automation, APIs, frontend delivery and maintainable implementation.",
  },
];

function renderProjects() {
  return storyProjects
    .map(
      (project) => `
        <article class="story-project-card">
          <div class="story-project-meta">
            <p class="story-project-index">${project.index}</p>
            <div>
              <p class="story-project-category">${project.category}</p>
              <h3>${project.title}</h3>
              <p class="story-project-stack">${project.stack}</p>
            </div>
          </div>
          <img class="story-project-image" src="${project.image}" alt="${project.title} placeholder" />
          <p class="story-project-summary">${project.summary}</p>
        </article>
      `
    )
    .join("");
}

function renderInfoCards(items) {
  return items
    .map(
      (item) => `
        <article class="story-info-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

export function renderIntegratedStoryPage() {
  return `
    <main class="portfolio-shell story-shell">
      <header class="topbar story-topbar">
        <a class="brand" href="#">
          <span>
            <strong>Yufei He</strong>
            <small>GIS + IT</small>
          </span>
        </a>
        <nav class="topnav" aria-label="Main Navigation">
          <a href="#">Home</a>
          <a href="#/lens/gis">GIS Lens</a>
          <a href="#/lens/integrated">Integrated Lens</a>
          <a href="#/lens/it">IT Lens</a>
          <button class="lens-inline-nav" type="button" data-story-scroll="story-projects">Projects</button>
          <a href="#/section/contact">Contact</a>
        </nav>
      </header>

      <section class="story-hero-section" id="story-hero">
        <div class="story-hero-copy">
          <p class="story-kicker">Integrated Lens</p>
          <h1>Yufei He</h1>
          <p class="story-hero-domain">GIS + IT</p>
          <p class="story-hero-subtitle">Building spatial intelligence through technology.</p>
          <div class="hero-actions story-hero-actions">
            <button class="button button-primary" type="button" data-story-scroll="story-projects">View Projects</button>
            <a class="button button-secondary" href="#/lens/integrated">Open Lens Page</a>
          </div>
        </div>
        <div class="story-hero-pattern" aria-hidden="true">
          <div class="story-contour contour-1"></div>
          <div class="story-contour contour-2"></div>
          <div class="story-contour contour-3"></div>
          <div class="story-grid"></div>
          <div class="story-dots">
            ${Array.from({ length: 12 }, (_, index) => `<span style="--dot:${index};"></span>`).join("")}
          </div>
        </div>
      </section>

      <section class="story-identity-section" id="story-identity">
        <div class="story-identity-sticky">
          <div class="story-identity-stage" data-story-progress="identity">
            <div class="story-identity-side story-identity-gis">
              <div class="story-identity-title">GIS</div>
              <div class="story-identity-skills">
                <span>Spatial Analysis</span>
                <span>Mapping</span>
                <span>Geospatial Data</span>
                <span>ArcGIS / QGIS</span>
              </div>
            </div>
            <div class="story-identity-center">
              <p class="story-merge-text story-merge-gis-it">GIS + IT</p>
              <p class="story-merge-text story-merge-lens">Integrated Lens</p>
              <p class="story-merge-caption">Connecting spatial intelligence with software engineering.</p>
            </div>
            <div class="story-identity-side story-identity-it">
              <div class="story-identity-title">IT</div>
              <div class="story-identity-skills">
                <span>Software Engineering</span>
                <span>Full-stack Development</span>
                <span>Automation</span>
                <span>Python / JS / C#</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="story-lens-section" id="story-lens">
        <div class="story-lens-sticky">
          <div class="story-lens-stage" data-story-progress="lens">
            <div class="story-lens-circle">
              <span>Integrated Lens</span>
            </div>
            <div class="story-lens-reveal">
              <p>GIS + IT becomes one delivery capability.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="story-projects-section section-card" id="story-projects">
        <div class="story-section-head">
          <p class="section-kicker">Projects</p>
          <h2>Selected work through the integrated lens</h2>
          <p>Editorial presentation, restrained motion and clear technical framing.</p>
        </div>
        <div class="story-projects-grid">
          ${renderProjects()}
        </div>
      </section>

      <section class="story-details-section section-card" id="story-experience">
        <div class="story-section-head">
          <p class="section-kicker">Experience & Skills</p>
          <h2>Readable, practical and professional</h2>
          <p>These sections prioritise clarity, while still preserving a premium sense of motion and hierarchy.</p>
        </div>
        <div class="story-skills-row">
          ${storySkills.map((skill) => `<span class="story-skill-chip">${skill}</span>`).join("")}
        </div>
        <div class="story-info-grid">
          ${renderInfoCards(storyExperience)}
        </div>
      </section>

      <section class="story-details-section section-card" id="story-education">
        <div class="story-section-head">
          <p class="section-kicker">Education</p>
          <h2>Multidisciplinary foundation</h2>
          <p>Spatial foundations and software practice converge into one integrated professional profile.</p>
        </div>
        <div class="story-info-grid compact">
          ${renderInfoCards(storyEducation)}
        </div>
      </section>
    </main>
  `;
}

export function hydrateIntegratedStoryPage() {
  document.querySelectorAll("[data-story-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-story-scroll");
      if (!targetId) {
        return;
      }

      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduced-motion");
    return;
  }

  const identitySection = document.querySelector("#story-identity");
  const identityStage = document.querySelector('[data-story-progress="identity"]');
  const lensSection = document.querySelector("#story-lens");
  const lensStage = document.querySelector('[data-story-progress="lens"]');
  const heroSection = document.querySelector("#story-hero");

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function setSectionProgress(section, element, variableName) {
    if (!section || !element) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const total = Math.max(rect.height - window.innerHeight, 1);
    const progress = clamp((-rect.top) / total);
    element.style.setProperty(variableName, progress.toFixed(4));
  }

  function updateHeroParallax() {
    if (!heroSection) {
      return;
    }

    const rect = heroSection.getBoundingClientRect();
    const progress = clamp((-rect.top) / Math.max(window.innerHeight, 1));
    heroSection.style.setProperty("--hero-progress", progress.toFixed(4));
  }

  function updateStoryProgress() {
    updateHeroParallax();
    setSectionProgress(identitySection, identityStage, "--identity-progress");
    setSectionProgress(lensSection, lensStage, "--lens-progress");
  }

  updateStoryProgress();
  window.addEventListener("scroll", updateStoryProgress, { passive: true });
  window.addEventListener("resize", updateStoryProgress);
}
