import projectGisPlaceholder from "../source/project-gis-placeholder.svg";
import projectIntegratedPlaceholder from "../source/project-integrated-placeholder.svg";
import projectItPlaceholder from "../source/project-it-placeholder.svg";

const lensPageContent = {
  gis: {
    badge: "GIS Lens",
    title: "Geospatial Specialist",
    subtitle: "Transforming Spatial Data into Insights",
    accent: "green",
    summary:
      "Focused, role-specific content with the same personal brand and shared core experience.",
    skills: [
      "ArcGIS Pro",
      "PostGIS",
      "QGIS",
      "FME",
      "Spatial Analysis",
      "Python",
      "Remote Sensing",
    ],
    projects: [
      {
        category: "GIS Analysis",
        title: "South D'Aguilar Suitability Analysis",
        summary: "Spatial suitability analysis for renewable energy planning.",
        image: projectGisPlaceholder,
      },
    ],
  },
  integrated: {
    badge: "Integrated Lens",
    title: "GIS + IT Innovator",
    subtitle: "Bridging Spatial Data and Technology",
    accent: "violet",
    summary:
      "Focused, role-specific content with the same personal brand and shared core experience.",
    skills: [
      "Spatial Data",
      "Software Dev",
      "Automation",
      "APIs & DB",
      "Web Apps",
      "AI / ML",
      "Cloud",
    ],
    projects: [
      {
        category: "GIS + IT Integration",
        title: "Shaoxing Future Community GIS Platform",
        summary: "Integrated GIS platform for 3D visualization and data workflows.",
        image: projectIntegratedPlaceholder,
      },
    ],
  },
  it: {
    badge: "IT Lens",
    title: "Software Engineer",
    subtitle: "Building Reliable Systems and Automation",
    accent: "orange",
    summary:
      "Focused, role-specific content with the same personal brand and shared core experience.",
    skills: [
      "Python",
      "C#",
      "JavaScript",
      "React",
      "Laravel",
      "SQL / MySQL",
      "Git",
    ],
    projects: [
      {
        category: "IT Development",
        title: "Strategic Plan Management System",
        summary: "Full-stack planning and reporting system for operational delivery.",
        image: projectItPlaceholder,
      },
    ],
  },
};

function renderLensProjects(projects, accent) {
  return projects
    .map(
      (project) => `
        <article class="lens-project-card ${accent}">
          <img class="lens-project-image" src="${project.image}" alt="${project.title} placeholder" />
          <div class="lens-project-copy">
            <p class="lens-project-category">${project.category}</p>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
          </div>
        </article>
      `
    )
    .join("");
}

export function renderLensPage(lensId) {
  const content = lensPageContent[lensId] ?? lensPageContent.gis;

  return `
    <main class="portfolio-shell lens-shell lens-shell-${content.accent}">
      <header class="topbar lens-topbar">
        <a class="brand" href="#">
          <span class="brand-mark">${content.accent === "green" ? "◌" : content.accent === "orange" ? "</>" : "◌"}</span>
          <span>
            <strong>Yufei He</strong>
            <small>${content.badge}</small>
          </span>
        </a>
        <nav class="topnav" aria-label="Main Navigation">
          <a href="#">Home</a>
          <a href="#/lens/integrated">Story</a>
          <a href="#/lens/gis">GIS Lens</a>
          <a href="#/lens/integrated">Integrated Lens</a>
          <a href="#/lens/it">IT Lens</a>
          <button class="lens-inline-nav" type="button" data-scroll-target="featured-projects">Projects</button>
          <a href="#/section/contact">Contact</a>
        </nav>
      </header>

      <section class="lens-page-hero section-card">
        <div class="lens-page-head">
          <span class="lens-page-badge ${content.accent}">${content.badge}</span>
          <h1>${content.title}</h1>
          <h2 class="lens-page-subtitle ${content.accent}">${content.subtitle}</h2>
          <p>${content.summary}</p>
          <div class="hero-actions lens-page-actions">
            <button class="button button-primary lens-${content.accent}" type="button" data-scroll-target="featured-projects">View Projects</button>
            <a class="button button-secondary lens-secondary-${content.accent}" href="#/lens/integrated">View Story</a>
          </div>
        </div>

        <section class="lens-skills-block" id="featured-skills">
          <h3>Core Skills</h3>
          <div class="lens-skills-pills">
            ${content.skills.map((skill) => `<span class="lens-skill-pill ${content.accent}">${skill}</span>`).join("")}
          </div>
        </section>

        <section class="lens-featured-block" id="featured-projects">
          <h3>Featured Projects</h3>
          <div class="lens-projects-grid">
            ${renderLensProjects(content.projects, content.accent)}
          </div>
        </section>
      </section>
    </main>
  `;
}

export function hydrateLensPage() {
  document.querySelectorAll("[data-scroll-target]").forEach((control) => {
    control.addEventListener("click", () => {
      const targetId = control.getAttribute("data-scroll-target");
      if (!targetId) {
        return;
      }

      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}
