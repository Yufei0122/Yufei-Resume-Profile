import projectGisPlaceholder from "../source/project-gis-placeholder.svg";
import projectIntegratedPlaceholder from "../source/project-integrated-placeholder.svg";
import projectItPlaceholder from "../source/project-it-placeholder.svg";
import projectUiuxPlaceholder from "../source/project-uiux-placeholder.svg";
import gisIcon from "../source/icon-gis.png";
import itIcon from "../source/icon-it.png";
import integratedIcon from "../source/icon-integrated.png";
import { renderCareerUniverseSection } from "../features/careerUniverse/careerUniverseSection.js";
import { mountCareerUniverseScene } from "../features/careerUniverse/careerUniverseScene.js";
import {
  createCareerUniverseScrollController,
  getCareerUniverseStoryState,
} from "../features/careerUniverse/careerUniverseScrollController.js";

const lenses = [
  {
    id: "gis",
    title: "GIS Lens",
    desc: "For geospatial & spatial data roles.",
    accent: "green",
    cta: "Explore",
  },
  {
    id: "it",
    title: "IT Lens",
    desc: "For software & IT roles.",
    accent: "orange",
    cta: "Explore",
  },
  {
    id: "integrated",
    title: "Integrated Lens",
    desc: "For GIS + IT roles.",
    accent: "violet",
    cta: "Explore",
  },
];

const lensIcons = {
  gis: gisIcon,
  it: itIcon,
  integrated: integratedIcon,
};

const projects = [
  {
    id: "south-daguilar",
    lens: "gis",
    category: "GIS Analysis",
    title: "South D'Aguilar Suitability Analysis",
    summary:
      "Multi-criteria analysis to identify suitable land for renewable energy development in South D'Aguilar.",
    tags: ["ArcGIS Pro", "MCDA", "Weighted Overlay"],
    accent: "green",
    image: projectGisPlaceholder,
  },
  {
    id: "shaoxing-platform",
    lens: "integrated",
    category: "GIS + IT Integration",
    title: "Shaoxing Future Community GIS Platform",
    summary:
      "An ArcGIS-based platform that integrates spatial data with web and desktop technologies for 3D visualization and management.",
    tags: ["ArcGIS Engine", "C#", "WPF", "SQL Server"],
    accent: "violet",
    image: projectIntegratedPlaceholder,
  },
  {
    id: "spdms",
    lens: "it",
    category: "IT Development",
    title: "Strategic Plan Management System (SPDMS)",
    summary:
      "A full-stack web system for strategic planning, monitoring, and reporting to improve operational efficiency.",
    tags: ["Laravel", "MySQL", "JavaScript", "PHP"],
    accent: "orange",
    image: projectItPlaceholder,
  },
  {
    id: "ux-design",
    lens: "integrated",
    category: "UI/UX Design",
    title: "User-Centered Interface Design",
    summary:
      "Designing intuitive and responsive interfaces that improve usability and engagement.",
    tags: ["Figma", "UI Design", "Prototyping"],
    accent: "pink",
    image: projectUiuxPlaceholder,
  },
];

let cleanupCareerUniverse = null;
let cleanupCareerUniverseScroll = null;
let cleanupCareerUniverseMode = null;
let cleanupCareerUniverseActivity = null;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function renderLensCards() {
  return lenses
    .map(
      (lens) => `
        <a class="lens-card ${lens.accent}" href="#/lens/${lens.id}">
          <span class="lens-icon">
            <img src="${lensIcons[lens.id]}" alt="${lens.title} icon" />
          </span>
          <div>
            <h3>${lens.title}</h3>
            <p>${lens.desc}</p>
            <span class="lens-cta">${lens.cta} &rarr;</span>
          </div>
        </a>
      `
    )
    .join("");
}

function renderProjectCards(activeLens = "all") {
  const visibleProjects =
    activeLens === "all"
      ? projects
      : projects.filter((project) => project.lens === activeLens || project.lens === "integrated");

  return visibleProjects
    .map(
      (project, index) => `
        <article class="project-card ${project.accent}">
          <div class="project-header">
            <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <p class="project-category">${project.category}</p>
              <h3>${project.title}</h3>
            </div>
          </div>
          <p class="project-summary">${project.summary}</p>
          <img class="project-image" src="${project.image}" alt="${project.title} placeholder" />
          <div class="project-tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <button class="project-link" type="button" data-project="${project.id}">
            View Project Details &rarr;
          </button>
        </article>
      `
    )
    .join("");
}

export function renderHomePage() {
  return `
    <main class="portfolio-shell">
      <header class="topbar">
        <a class="brand" href="#">
          <span>
            <strong>Yufei He</strong>
            <small>GIS <span>&bull;</span> IT <span>&bull;</span> Surveying</small>
          </span>
        </a>
        <nav class="topnav" aria-label="Main Navigation">
          <a class="is-active" href="#home">Home</a>
          <a href="#/lens/integrated">Story</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      ${renderCareerUniverseSection()}

      <section class="featured-section section-card" id="projects">
        <div class="featured-heading">
          <p class="section-kicker center">Featured Solutions</p>
          <h2>Different disciplines. <span class="text-green">One way of thinking.</span></h2>
          <p>
            From spatial analysis and software engineering to integrated GIS systems and
            user-centered design, I turn complex problems into practical solutions.
          </p>
        </div>
        <div class="projects-grid" id="projects-grid">
          ${renderProjectCards("gis")}
        </div>
        <div class="featured-footer">
          <span>Interested in working together?</span>
          <a href="#contact">Let's connect &rarr;</a>
        </div>
      </section>

      <section class="career-lens-section section-card" id="career-lens">
        <div class="section-heading center">
          <h2>Choose a Career Lens</h2>
          <p>Different perspectives, same passion.</p>
        </div>
        <div class="lens-grid">
          ${renderLensCards()}
        </div>
      </section>

      <section class="about-section" id="about">
        <p class="section-kicker">About Me</p>
        <h2>Hi, I'm <strong>Yufei He.</strong></h2>
        <p>
          I'm a GIS and IT professional with a multidisciplinary background in geospatial science,
          software development, and surveying. I combine spatial thinking with software engineering
          to build practical, data-driven solutions, from GIS applications and spatial automation
          to full-stack web systems.
        </p>
        <p>
          I'm passionate about exploring the intersection of GIS + IT, using technology,
          automation, and data to solve real-world problems and create meaningful impact.
        </p>
      </section>

      <section class="connect-section section-card" id="contact">
        <div class="section-heading center">
          <p class="section-kicker">Let's Connect</p>
          <h2>Let's build <span class="text-green">what matters</span></h2>
          <p>
            I'm open to opportunities, collaborations and conversations.
            Let's create interactive work that makes a real difference.
          </p>
        </div>
        <div class="contact-grid">
          <a
            class="contact-card green"
            href="https://github.com/Yufei0122"
            target="_blank"
            rel="noreferrer"
          >
            <span class="contact-icon">G</span>
            <h3>GitHub</h3>
            <strong>Yufei0122</strong>
            <p>Explore my code and projects.</p>
            <span>View GitHub &rarr;</span>
          </a>
          <a class="contact-card orange" href="mailto:hyf0122@gmail.com">
            <span class="contact-icon">@</span>
            <h3>Get in Touch</h3>
            <strong>0423 847 722</strong>
            <p>hyf0122@gmail.com</p>
            <span>Send an Email &rarr;</span>
          </a>
          <a
            class="contact-card violet"
            href="https://www.linkedin.com/in/yufei-he-2b7bab284/"
            target="_blank"
            rel="noreferrer"
          >
            <span class="contact-icon">in</span>
            <h3>LinkedIn</h3>
            <strong>Yufei (Katie) He</strong>
            <p>Let's connect professionally.</p>
            <span>Connect &rarr;</span>
          </a>
        </div>
        <div class="availability-note">
          Available for graduate, GIS, software & integrated roles.
        </div>
      </section>
    </main>
  `;
}

function bindProjectButtons() {
  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".project-card");
      card?.classList.toggle("is-expanded");
    });
  });
}

export function hydrateHomePage() {
  bindProjectButtons();
  const story = document.querySelector(".career-universe-story");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function resetCareerUniverse() {
    cleanupCareerUniverseActivity?.();
    cleanupCareerUniverseActivity = null;
    cleanupCareerUniverseScroll?.();
    cleanupCareerUniverseScroll = null;
    cleanupCareerUniverse?.();
    cleanupCareerUniverse = null;
  }

  function applyCareerUniverseMode() {
    if (!story) {
      return;
    }

    resetCareerUniverse();

    const reducedMotion = reducedMotionQuery.matches;
    const compactMode = window.innerWidth <= 860;
    const webglAvailable = supportsWebGL();
    const staticMode = reducedMotion || compactMode;

    story.classList.toggle("is-static", staticMode || !webglAvailable);
    story.classList.toggle("is-webgl-disabled", !webglAvailable);

    if (!webglAvailable || reducedMotion) {
      return;
    }

    const sceneApi = mountCareerUniverseScene({
      staticMode,
      compactMode,
    });
    cleanupCareerUniverse = sceneApi?.cleanup ?? null;

    if (!sceneApi) {
      story.classList.add("is-webgl-disabled");
      story.classList.add("is-static");
      return;
    }

    const visibilityHandler = () => {
      sceneApi.setActive?.(!document.hidden);
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    let storyObserver = null;
    if ("IntersectionObserver" in window) {
      storyObserver = new IntersectionObserver(
        ([entry]) => {
          sceneApi.setActive?.(Boolean(entry?.isIntersecting));
        },
        { threshold: 0.04 }
      );
      storyObserver.observe(story);
    }

    cleanupCareerUniverseActivity = () => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      storyObserver?.disconnect();
    };

    if (staticMode) {
      sceneApi.setStoryView({
        ...getCareerUniverseStoryState(0),
        integration: 0,
      });
      sceneApi.setActive?.(true);
      return;
    }

    cleanupCareerUniverseScroll = createCareerUniverseScrollController({
      section: story,
      sceneApi,
    });
  }

  applyCareerUniverseMode();

  const handleResize = () => applyCareerUniverseMode();
  const handleMotionChange = () => applyCareerUniverseMode();

  window.addEventListener("resize", handleResize);
  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionChange);
  }

  cleanupCareerUniverseMode = () => {
    window.removeEventListener("resize", handleResize);
    if (typeof reducedMotionQuery.removeEventListener === "function") {
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
    } else if (typeof reducedMotionQuery.removeListener === "function") {
      reducedMotionQuery.removeListener(handleMotionChange);
    }
    resetCareerUniverse();
  };
}

export function teardownHomePage() {
  cleanupCareerUniverseMode?.();
  cleanupCareerUniverseMode = null;
  cleanupCareerUniverseScroll?.();
  cleanupCareerUniverseScroll = null;
  cleanupCareerUniverse?.();
  cleanupCareerUniverse = null;
}
