import heroMapPlaceholder from "../source/hero-map-placeholder.png";
import projectGisPlaceholder from "../source/project-gis-placeholder.svg";
import projectIntegratedPlaceholder from "../source/project-integrated-placeholder.svg";
import projectItPlaceholder from "../source/project-it-placeholder.svg";
import projectUiuxPlaceholder from "../source/project-uiux-placeholder.svg";
import {mountHeroGlobe} from "../services/heroGlobe.js";

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

function renderLensCards() {
  return lenses
    .map(
      (lens) => `
        <button class="lens-card ${lens.accent} ${lens.id === "gis" ? "is-active" : ""}" type="button" data-lens="${lens.id}">
          <span class="lens-icon">${lens.id === "gis" ? "◎" : lens.id === "it" ? "</>" : "◌"}</span>
          <div>
            <h3>${lens.title}</h3>
            <p>${lens.desc}</p>
            <span>${lens.cta} →</span>
          </div>
        </button>
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
            View Project Details →
          </button>
        </article>
      `
    )
    .join("");
}

function renderTechnologySystem() {
  const domains = [
    {
      title: "GIS",
      accent: "green",
      note: "Spatial analysis and mapping systems.",
      subnodes: [
        "QGIS",
        "ArcGIS Pro",
        "ArcGIS Enterprise",
        "ArcGIS Engine",
        "Spatial Analysis",
        "Geospatial Modelling",
        "Cartography",
        "Remote Sensing ENVI",
        "DEM/DOM/DLG Processing",
        "Imagery Analysis",
        "AutoCAD",
        "Web GIS",
        "FME",
      ],
    },
    { title: "Survey", accent: "blue", note: "Field data, measurement and site context." },
    {
      title: "IT",
      accent: "orange",
      note: "Software systems, APIs and delivery.",
      subnodes: [
        "Python (Pandas, NumPy)",
        "C# (.NET, WPF)",
        "PHP",
        "JavaScript (ES6+, React)",
        "SQL",
        "Laravel",
        "Flask",
        "React",
        "Vite",
        "HTML5",
        "CSS3",
        "RESTful APIs",
        "AWS",
        "GitHub (CI/CD)",
        "Postman",
        "Vercel",
        "Agile/Scrum",
        "MySQL",
        "MongoDB",
        "SQL Server",
        "Figma",
      ],
    },
    { title: "AI", accent: "violet", note: "Decision support and intelligent workflows." },
  ];

  return `
    <section class="technology-section section-card" id="skills">
      <div class="technology-intro">
        <p class="section-kicker">Technology System</p>
        <h2>Built as a connected <span class="text-green">software system</span></h2>
        <p>
          From interface to backend logic and data services, each layer is designed
          to work together as one practical delivery system for GIS, software and integrated solutions.
        </p>
      </div>
      <div class="technology-graph" aria-label="Yufei technology knowledge graph">
        <div class="technology-graph-stage">
          <div class="graph-orbit orbit-1"></div>
          <div class="graph-orbit orbit-2"></div>
          <div class="graph-axis graph-axis-horizontal"></div>
          <div class="graph-axis graph-axis-vertical"></div>
          <div class="graph-connector graph-connector-1" aria-hidden="true"></div>
          <div class="graph-connector graph-connector-2" aria-hidden="true"></div>
          <div class="graph-connector graph-connector-3" aria-hidden="true"></div>
          <div class="graph-connector graph-connector-4" aria-hidden="true"></div>

          <div class="graph-core">
            <strong>Yufei Technology System</strong>
          </div>

          ${domains
            .map(
              (domain, index) => `
                <article class="graph-node ${domain.accent} graph-node-${index + 1}">
                  <div class="graph-node-circle">
                    <h3>${domain.title}</h3>
                  </div>
                  <div class="graph-node-tooltip" role="tooltip">
                    <strong>${domain.title}</strong>
                    <p>${domain.note}</p>
                  </div>
                  ${domain.subnodes?.length
                    ? `
                      <div class="graph-subnodes" aria-label="${domain.title} knowledge nodes">
                        ${domain.subnodes
                          .map(
                            (subnode, subnodeIndex) => `
                              <span class="graph-subnode graph-subnode-${subnodeIndex + 1}">
                                <span class="graph-subnode-connector" aria-hidden="true"></span>
                                <span class="graph-subnode-label">${subnode}</span>
                              </span>
                            `
                          )
                          .join("")}
                      </div>
                    `
                    : ""}
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function renderHomePage() {
  return `
    <main class="portfolio-shell">
      <header class="topbar">
        <a class="brand" href="#home">
            <strong>Yufei He</strong>
            <small>GIS · IT</small>
          </span>
        </a>
        <nav class="topnav" aria-label="Main Navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section class="hero-section" id="home">
        <div class="hero-copy">
          <h1>
            I build intelligent
            solutions by combining
            <span class="text-green">spatial thinking</span> and
            <span class="text-orange">software engineering.</span>
          </h1>
          <p class="hero-keywords">GIS · Software Engineering · AI</p>
          <p class="hero-description">
            Turning spatial data into insights and building practical systems that solve
            real-world problems.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="#career-lens">Explore My Lens</a>
            <a class="button button-secondary" href="#projects">View My Work</a>
          </div>
        </div>
        <div class="hero-visual">
          <div id="hero-globe" class="hero-globe"></div>
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

      ${renderTechnologySystem()}

      <section class="featured-section section-card" id="experience">
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
          <a href="#contact">Let's connect →</a>
        </div>
      </section>

      <section class="connect-section section-card" id="contact">
        <div class="section-heading center">
          <p class="section-kicker">Let's Connect</p>
          <h2>Let's build <span class="text-green">what matters</span></h2>
          <p>
            I'm open with any opportunities, collaborations and conversations.
            Let's create interactive work that makes a real difference.
          </p>
        </div>
        <div class="contact-grid">
          <a class="contact-card green" href="https://github.com/Yufei0122" target="_blank" rel="noreferrer">
            <span class="contact-icon">◉</span>
            <h3>GitHub</h3>
            <strong>Yufei0122</strong>
            <p>Explore my code and projects.</p>
            <span>View GitHub →</span>
          </a>
          <a class="contact-card orange" href="mailto:hyf0122@gmail.com">
            <span class="contact-icon">@</span>
            <h3>Get in Touch</h3>
            <strong>0423 847 722</strong>
            <p>hyf0122@gmail.com</p>
            <span>Send an Email →</span>
          </a>
          <a class="contact-card violet" href="https://www.linkedin.com/in/yufei-he-2b7bab284/" target="_blank" rel="noreferrer">
            <span class="contact-icon">in</span>
            <h3>LinkedIn</h3>
            <strong>Yufei(Katie) He</strong>
            <p>Let's connect professionally.</p>
            <span>Connect →</span>
          </a>
        </div>
        <div class="availability-note">
          Available for graduate, GIS, software & integrated roles.
        </div>
      </section>
    </main>
  `;
}

function bindLensFiltering() {
  const lensButtons = document.querySelectorAll("[data-lens]");
  const projectGrid = document.querySelector("#projects-grid");

  lensButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lens = button.getAttribute("data-lens") || "all";

      lensButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      if (projectGrid) {
        projectGrid.innerHTML = renderProjectCards(lens);
        bindProjectButtons();
      }
    });
  });
}

function bindProjectButtons() {
  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".project-card");
      card?.classList.toggle("is-expanded");
    });
  });
}

function bindTechnologyGraphInteraction() {
  const stage = document.querySelector(".technology-graph-stage");
  if (!stage) {
    return;
  }

  const nodes = Array.from(stage.querySelectorAll(".graph-node"));
  const connectors = Array.from(stage.querySelectorAll(".graph-connector"));
  const core = stage.querySelector(".graph-core");
  if (!nodes.length) {
    return;
  }

  const pointerTarget = { x: 0, y: 0 };
  const pointerCurrent = { x: 0, y: 0 };
  const baseTransforms = [
    "translateY(-50%)",
    "translateX(-50%)",
    "translateY(-50%)",
    "translateX(-50%)",
  ];
  const floatConfigs = [
    { x: 14, y: 12, speed: 0.0016, phase: 0.2 },
    { x: 11, y: 15, speed: 0.00125, phase: 1.7 },
    { x: 15, y: 10, speed: 0.00145, phase: 2.6 },
    { x: 12, y: 14, speed: 0.0013, phase: 3.9 },
  ];

  function layoutSubnodes() {
    nodes.forEach((node, index) => {
      const subnodesContainer = node.querySelector(".graph-subnodes");
      if (!subnodesContainer) {
        return;
      }

      const subnodes = Array.from(subnodesContainer.querySelectorAll(".graph-subnode"));
      if (!subnodes.length) {
        return;
      }

      const isRightNode = index === 0;
      const isLeftNode = index === 2;
      if (!isRightNode && !isLeftNode) {
        return;
      }

      const groups = subnodes.length > 12
        ? [subnodes.slice(0, Math.ceil(subnodes.length / 2)), subnodes.slice(Math.ceil(subnodes.length / 2))]
        : [subnodes];
      const radii = groups.length === 2 ? [240, 182] : [208];
      const span = isRightNode ? 170 : 178;
      const centerAngle = isRightNode ? 0 : 180;

      groups.forEach((group, groupIndex) => {
        const radius = radii[groupIndex];
        const steps = group.length === 1 ? [centerAngle] : group.map((_, itemIndex) => {
          const start = centerAngle - span / 2;
          const end = centerAngle + span / 2;
          return start + ((end - start) * itemIndex) / (group.length - 1);
        });

        group.forEach((subnode, itemIndex) => {
          const angleDeg = steps[itemIndex];
          const angle = (angleDeg * Math.PI) / 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const label = subnode.querySelector(".graph-subnode-label");
          const connector = subnode.querySelector(".graph-subnode-connector");
          const rect = label?.getBoundingClientRect();
          const labelWidth = rect?.width ?? 110;
          const labelHeight = rect?.height ?? 40;

          subnode.style.left = `calc(50% + ${x}px)`;
          subnode.style.top = `calc(50% + ${y}px)`;
          subnode.style.transform = "translate(-50%, -50%)";

          if (connector) {
            const connectorLength = Math.max(radius - Math.max(labelWidth, labelHeight) * 0.42, 28);
            connector.style.width = `${connectorLength}px`;
            connector.style.transform = `translateY(-50%) rotate(${angleDeg}deg)`;
          }
        });
      });
    });
  }

  function handlePointerMove(event) {
    const rect = stage.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stage.classList.add("is-active");
  }

  function handlePointerLeave() {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
    stage.classList.remove("is-active");
  }

  stage.addEventListener("pointermove", handlePointerMove);
  stage.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("resize", layoutSubnodes);
  layoutSubnodes();

  function animate(time) {
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.08;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.08;

    nodes.forEach((node, index) => {
      const config = floatConfigs[index];
      const phase = time * config.speed + config.phase;
      const floatX = Math.cos(phase) * config.x;
      const floatY = Math.sin(phase * 1.15) * config.y;
      const pointerX = pointerCurrent.x * (10 + index * 1.8);
      const pointerY = pointerCurrent.y * (8 + index * 1.6);

      node.style.transform =
        `${baseTransforms[index]} translate(${floatX + pointerX}px, ${floatY + pointerY}px)`;
    });

    if (core) {
      const stageRect = stage.getBoundingClientRect();
      const coreRect = core.getBoundingClientRect();
      const coreX = coreRect.left - stageRect.left + coreRect.width / 2;
      const coreY = coreRect.top - stageRect.top + coreRect.height / 2;

      nodes.forEach((node, index) => {
        const connector = connectors[index];
        if (!connector) {
          return;
        }

        const nodeRect = node.getBoundingClientRect();
        const nodeX = nodeRect.left - stageRect.left + nodeRect.width / 2;
        const nodeY = nodeRect.top - stageRect.top + nodeRect.height / 2;
        const deltaX = nodeX - coreX;
        const deltaY = nodeY - coreY;
        const length = Math.max(Math.hypot(deltaX, deltaY) - coreRect.width / 2 - 10, 0);
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

        connector.style.left = `${coreX}px`;
        connector.style.top = `${coreY}px`;
        connector.style.width = `${length}px`;
        connector.style.transform = `rotate(${angle}deg)`;
      });
    }

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);
}

export async function hydrateHomePage() {
  bindLensFiltering();
  bindProjectButtons();
  bindTechnologyGraphInteraction();
  mountHeroGlobe();
}
