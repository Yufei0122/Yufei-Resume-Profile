import projectGisPlaceholder from "../source/project-gis-placeholder.svg";
import projectIntegratedPlaceholder from "../source/project-integrated-placeholder.svg";
import projectItPlaceholder from "../source/project-it-placeholder.svg";
import projectUiuxPlaceholder from "../source/project-uiux-placeholder.svg";
import projectInprogressPlaceholder from "../source/project-inprogress-placeholder.png";
import finalGeomReport from "../source/projects/final-GEOM7005_Report.pdf";
import finalGeomReportCover from "../source/projects/final-report.png";
import uqFloodRiskReport from "../source/projects/UQFloodRisk_Report_S4835200_Yufei_He.pdf";
import uqMapDirectory from "../source/projects/UQMap_InformationDiroctory.pdf";
import shaoxingPlatform from "../source/projects/shaoxing-platform.png";
import drbotPlatform from "../source/projects/DRBOT-Platform.jpeg";
import spdmPlatform from "../source/projects/SPDM-logo.png";
import resumeProfilePreview from "../source/projects/yufei-resume-profile.svg";
import aimmiHomePage from "../source/projects/AI-mmi-Home-Desktop.png";
import humanCenteredDesign from "../source/projects/Human-centered-design.png";
import gisIcon from "../source/icon-gis.png";
import itIcon from "../source/icon-it.png";
import integratedIcon from "../source/icon-integrated.png";
import { renderExperienceMapSection, mountExperienceMapSection } from "../features/experienceMap/experienceMapSection.js";
import { renderCareerUniverseSection } from "../features/careerUniverse/careerUniverseSection.js";
import { mountCareerUniverseMobile } from "../features/careerUniverse/careerUniverseMobile.js";

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
    filters: ["featured", "all", "gis"],
    category: "GIS Analysis",
    title: "South D'Aguilar Suitability Analysis",
    summary:
      "Multi-criteria analysis to identify suitable land for renewable energy development in South D'Aguilar.",
    tags: ["Featured","ArcGIS Pro", "MCDA", "Weighted Overlay"],
    accent: "green",
    image: finalGeomReportCover,
    href: finalGeomReport,
    useDocumentPreview: false,
  },
  {
    id: "uq-flood-risk",
    lens: "gis",
    filters: ["all", "gis"],
    category: "GIS Analysis",
    title: "UQ Flood Risk Assessment",
    summary:
      "Conducted GIS-based flood risk assessment of UQ buildings and sports facilities using flood frequency, affected area, and tolerability criteria.",
    tags: ["ArcGIS Pro", "MCDA", "Weighted Overlay"],
    accent: "green",
    image: projectGisPlaceholder,
    href: uqFloodRiskReport,
    useDocumentPreview: true,
  },
  {
    id: "uq-information-directory",
    lens: "gis",
    filters: ["all", "gis"],
    category: "GIS Analysis",
    title: "UQ Information Directory",
    summary:
      "Mapped campus population distribution and existing information directories to identify an optimal location for a new UQ information directory facility.",
    tags: ["ArcGIS Pro", "MCDA", "Weighted Overlay"],
    accent: "green",
    image: projectGisPlaceholder,
    href: uqMapDirectory,
  },
  {
    id: "shaoxing-platform",
    lens: "integrated",
    filters: ["featured", "all", "integrated"],
    category: "GIS + IT Integration",
    title: "Shaoxing Future Community GIS Platform",
    summary:
      "An ArcGIS-based platform that integrates spatial data with web and desktop technologies for 3D visualization and management.",
    tags: ["Featured", "ArcGIS Engine", "C#", "WPF", "SQL Server"],
    accent: "violet",
    image: shaoxingPlatform,
  },
  {
    id: "DRBOT-platform",
    lens: "integrated",
    filters: [ "all", "integrated"],
    category: "GIS + IT Integration",
    title: "DRBOT Platform",
    summary:
      "An intelligent disaster-response platform combining robotics, AI, edge computing, computer vision, and GIS.",
    tags: [ "YOLOv8","ComputerVision","Leaflet", "RaspberryPi","Whisper"],
    accent: "violet",
    image: drbotPlatform,
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7501972142549266432/",
  },
  {
    id: "Lightening-World-platform",
    lens: "integrated",
    filters: [ "all", "integrated"],
    category: "GIS + IT Integration",
    title: "Lightning World Platform",
    summary:
      "A WebGIS application for tourist check-ins and travel exploration.",
    tags: [ "OpenLayers", "HTML","Python", "SQL Server"],
    accent: "violet",
    image: projectInprogressPlaceholder,
    href: 'https://github.com/Yufei0122/Lighting-World',
  },
  {
    id: "spdms",
    lens: "it",
    filters: ["featured", "all", "it"],
    category: "IT Development",
    title: "Strategic Plan Management System (SPDMS)",
    summary:
      "A full-stack web system for strategic planning, monitoring, and reporting to improve operational efficiency.",
    tags: ["Featured","Laravel", "MySQL", "JavaScript", "PHP"],
    accent: "orange",
    image: spdmPlatform,
  },
  {
    id: "yufei-resume-profile",
    lens: "it",
    filters: ["all", "it"],
    category: "IT Development",
    title: "Yufei Resume & Portfolio",
    summary:
      "A responsive personal portfolio showcasing GIS, software development, and surveying through an interactive 3D career universe, filterable projects, and a skills network.",
    tags: ["JavaScript", "Vite", "Three.js", "Responsive Design"],
    accent: "orange",
    image: resumeProfilePreview,
    imageAlt: "Yufei portfolio homepage illustration with its career universe and three disciplines",
    href: "#home",
    linkLabel: "Explore Website Home &rarr;",
    clickableCard: true,
  },
  {
    id: "Leave-Shift-Manager",
    lens: "integrated",
    filters: ["all", "it"],
    category: "IT Development",
    title: "Leave and Shift Management System",
    summary:
      "A full-stack project covering the complete software development lifecycle, from requirements and design to development, testing, deployment, and maintenance.",
    tags: ["Figma", "MangoDB", "JavaScript", "Node.js", "React", "UI/UX Design"],
    accent: "orange",
    image: projectItPlaceholder,
    href: "https://github.com/Yufei0122/Leave-Shift-Manager",
  },
  {
    id: "human-centered-design",
    lens: "integrated",
    filters: ["all", "it"],
    category: "UI/UX Design",
    title: "Human-Centered Interface Design",
    summary:
      "Designing intuitive and responsive interfaces that improve usability and engagement.",
    tags: ["Figma", "Human-Centered Design", "Travelly","UI/UX Design", "Prototyping"],
    accent: "pink",
    image: humanCenteredDesign,
    href: "https://www.figma.com/proto/5rcLgCjVmHMdQSYB4WHM5j/IFN637-A3?node-id=1-2&p=f&t=bTtZApnTZ3AnvscI-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2&show-proto-sidebar=11",
  },
  {
    id: "AI-mmi-design",
    lens: "integrated",
    filters: ["all", "it"],
    category: "UI/UX Design",
    title: "AI-mmi Home Page Design",
    summary:
      "Designing intuitive and responsive interfaces that improve usability and engagement.",
    tags: ["Figma", "UI/UX Design", "Prototyping","AI-mmi","Human-Centered Design"],
    accent: "pink",
    image: aimmiHomePage,
    href: "https://www.figma.com/proto/DqPsTtZJj9IXabiFHEMgFS/AI-mmi-Design?node-id=1-84&p=f&t=leFRnJWV8a2JlWaK-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A84",
  },
];

const projectFilters = [
  { id: "featured", label: "FEATURED" },
  { id: "all", label: "ALL" },
  { id: "gis", label: "GIS" },
  { id: "it", label: "IT" },
  { id: "integrated", label: "INTEGRATED" },
  /*{ id: "surveying", label: "SURVEYING" },*/
];

let cleanupCareerUniverse = null;
let cleanupCareerUniverseScroll = null;
let cleanupCareerUniverseMode = null;
let cleanupCareerUniverseActivity = null;
let cleanupExperienceMap = null;

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

function renderProjectFilters(activeFilter = "featured") {
  return projectFilters
    .map(
      (filter) => `
        <button
          class="project-filter${filter.id === activeFilter ? " is-active" : ""}"
          type="button"
          data-project-filter="${filter.id}"
        >
          ${filter.label}
        </button>
      `
    )
    .join("");
}

function renderProjectPreview(project) {
  const isPdfLink =
    project.useDocumentPreview !== false &&
    typeof project.href === "string" &&
    /\.pdf($|[?#])/i.test(project.href);

  if (isPdfLink) {
    return `
      <div class="project-preview">
        <iframe
          class="project-preview-frame"
          src="${project.href}#toolbar=0&navpanes=0&scrollbar=0&page=1&view=FitH"
          title="${project.title} preview"
          loading="lazy"
          tabindex="-1"
        ></iframe>
      </div>
    `;
  }

  return `<img class="project-image" src="${project.image}" alt="${project.imageAlt ?? `${project.title} placeholder`}" />`;
}

function renderProjectLink(project) {
  const hasLink = typeof project.href === "string" && project.href.trim().length > 0;
  const href = hasLink ? project.href : "#contact";
  const label = project.linkLabel ?? (hasLink ? "View Project Details &rarr;" : "Want to know more? Talk to me &rarr;");
  const externalAttrs = hasLink && !href.startsWith("#") ? ' target="_blank" rel="noreferrer"' : "";

  return `<a class="project-link" href="${href}"${externalAttrs}>${label}</a>`;
}

function renderProjectCards(activeFilter = "featured") {
  const visibleProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.filters?.includes(activeFilter));

  if (!visibleProjects.length) {
    return `
      <article class="project-empty-state">
        <p class="section-kicker">No Matching Projects Yet</p>
        <h3>${activeFilter.toUpperCase()}</h3>
        <p>
          This category is reserved and can be filled with additional case studies later.
        </p>
      </article>
    `;
  }

  return visibleProjects
    .map(
      (project, index) => `
        <article class="project-card ${project.accent}${project.clickableCard ? " is-linked" : ""}">
          <div class="project-header">
            <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <p class="project-category">${project.category}</p>
              <h3>${project.title}</h3>
            </div>
          </div>
          <p class="project-summary">${project.summary}</p>
          ${renderProjectPreview(project)}
          <div class="project-tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          ${renderProjectLink(project)}
        </article>
      `
    )
    .join("");
}

export function renderHomePage() {
  return `
    <div class="home-page">
      <!-- Navbar -->
      <header class="topbar">
        <a class="brand" href="#">
          <span>
            <strong>Yufei He</strong>
          </span>
          <small>GIS <span>&bull;</span> IT <span>&bull;</span> Surveying</small>
        </a>
        <nav class="topnav" aria-label="Main Navigation">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <div class="portfolio-shell">
        <main class="page-main">
          <!-- Hero / Career Universe Section -->
          ${renderCareerUniverseSection()}

          <!-- About Section 
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
          </section>-->

          <!-- Featured Projects Section -->
          <section class="featured-section section-card" id="projects">
            <div class="featured-heading">
              <p class="section-kicker center">Featured Solutions</p>
              <h2>Different disciplines. <span class="text-green">One way of thinking.</span></h2>
              <p>
                From spatial analysis and software engineering to integrated GIS systems and
                user-centered design, I turn complex problems into practical solutions.
              </p>
            </div>
            <div class="project-filters" aria-label="Project Filters">
              ${renderProjectFilters("featured")}
            </div>
            <div class="projects-grid" id="projects-grid">
              ${renderProjectCards("featured")}
            </div>
            <div class="featured-footer">
              <span>Interested in working together?</span>
              <a href="#contact">Let's connect &rarr;</a>
            </div>
          </section>

          ${renderExperienceMapSection()}

          <!-- Career Lens Section -->
          <!--
          <section class="career-lens-section section-card" id="career-lens">
            <div class="section-heading center">
              <h2>Choose a Career Lens</h2>
              <p>Different perspectives, same passion.</p>
            </div>
            <div class="lens-grid">
              ${renderLensCards()}
            </div>
          </section>
          -->
          

          <!-- Contact Section -->
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
      </div>
    </div>
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

function bindProjectFilters() {
  const grid = document.getElementById("projects-grid");
  const filterButtons = Array.from(document.querySelectorAll("[data-project-filter]"));
  if (!grid || !filterButtons.length) {
    return;
  }

  function applyFilter(filterId) {
    grid.innerHTML = renderProjectCards(filterId);
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-project-filter") === filterId);
    });
    bindProjectButtons();
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterId = button.getAttribute("data-project-filter") || "featured";
      applyFilter(filterId);
    });
  });
}

export function hydrateHomePage() {
  bindProjectButtons();
  bindProjectFilters();
  cleanupExperienceMap = mountExperienceMapSection();
  const story = document.querySelector(".career-universe-story");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactQuery = window.matchMedia("(max-width: 860px)");
  let modeRequest = 0;
  let disposed = false;

  function resetCareerUniverse() {
    cleanupCareerUniverseActivity?.();
    cleanupCareerUniverseActivity = null;
    cleanupCareerUniverseScroll?.();
    cleanupCareerUniverseScroll = null;
    cleanupCareerUniverse?.();
    cleanupCareerUniverse = null;
  }

  async function applyCareerUniverseMode() {
    if (!story) {
      return;
    }

    const request = ++modeRequest;
    resetCareerUniverse();

    const reducedMotion = reducedMotionQuery.matches;
    const compactMode = compactQuery.matches;
    story.classList.toggle("is-static", compactMode || reducedMotion);
    story.classList.remove("is-webgl-disabled");

    if (compactMode) {
      cleanupCareerUniverseActivity = mountCareerUniverseMobile(story);
      return;
    }
    if (reducedMotion) {
      return;
    }
    if (!supportsWebGL()) {
      story.classList.add("is-webgl-disabled", "is-static");
      return;
    }

    try {
      const [{ mountCareerUniverseScene }, { createCareerUniverseScrollController }] = await Promise.all([
        import("../features/careerUniverse/careerUniverseScene.js"),
        import("../features/careerUniverse/careerUniverseScrollController.js"),
      ]);
      if (disposed || request !== modeRequest) return;

      const sceneApi = mountCareerUniverseScene();
      cleanupCareerUniverse = sceneApi?.cleanup ?? null;
      if (!sceneApi) {
        story.classList.add("is-webgl-disabled", "is-static");
        return;
      }

      let storyVisible = true;
      const visibilityHandler = () => sceneApi.setActive?.(storyVisible && !document.hidden);
      document.addEventListener("visibilitychange", visibilityHandler);
      let storyObserver = null;
      if ("IntersectionObserver" in window) {
        storyObserver = new IntersectionObserver(([entry]) => {
          storyVisible = Boolean(entry?.isIntersecting);
          visibilityHandler();
        }, { threshold: 0.04 });
        storyObserver.observe(story);
      }
      visibilityHandler();
      cleanupCareerUniverseActivity = () => {
        document.removeEventListener("visibilitychange", visibilityHandler);
        storyObserver?.disconnect();
      };
      cleanupCareerUniverseScroll = createCareerUniverseScrollController({
        section: story,
        sceneApi,
      });
    } catch (error) {
      if (disposed || request !== modeRequest) return;
      resetCareerUniverse();
      story.classList.add("is-webgl-disabled", "is-static");
      console.error("Career universe could not load:", error);
    }
  }

  applyCareerUniverseMode();

  const handleModeChange = () => applyCareerUniverseMode();
  for (const query of [compactQuery, reducedMotionQuery]) {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handleModeChange);
    } else {
      query.addListener(handleModeChange);
    }
  }

  cleanupCareerUniverseMode = () => {
    disposed = true;
    modeRequest++;
    for (const query of [compactQuery, reducedMotionQuery]) {
      if (typeof query.removeEventListener === "function") {
        query.removeEventListener("change", handleModeChange);
      } else {
        query.removeListener(handleModeChange);
      }
    }
    resetCareerUniverse();
  };
}

export function teardownHomePage() {
  cleanupExperienceMap?.();
  cleanupExperienceMap = null;
  cleanupCareerUniverseMode?.();
  cleanupCareerUniverseMode = null;
  cleanupCareerUniverseScroll?.();
  cleanupCareerUniverseScroll = null;
  cleanupCareerUniverse?.();
  cleanupCareerUniverse = null;
}
