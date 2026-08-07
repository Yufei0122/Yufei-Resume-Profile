export function renderCareerUniverseSection() {
  return `
    <section class="career-universe-story" id="home">
      <div class="career-universe-mobile-hero">
        <div class="career-universe-mobile-copy">
          <p class="section-kicker">Career Universe</p>
          <h1 class="career-universe-headline">
            I connect the
            <span class="text-terracotta">physical</span>,
            <span class="text-green">spatial</span>
            and
            <span class="text-blue">digital</span>
            worlds.
          </h1>
          <p class="hero-keywords">Surveying &middot; GIS &middot; Information Technology</p>
          <p class="hero-journey">Measure &middot; Understand &middot; Build</p>
          <div class="hero-accent-line" aria-hidden="true"></div>
        </div>
      </div>

      <div class="career-universe-stage hero-section career-universe-section">
        <div class="hero-copy">
          <div class="career-universe-intro" data-story-copy="intro">
            <p class="section-kicker">Career Universe</p>
            <h1 class="career-universe-headline">
              I connect the
              <span class="text-terracotta">physical</span>,
              <span class="text-green">spatial</span>
              and
              <span class="text-blue">digital</span>
              worlds.
            </h1>
            <p class="hero-keywords">Surveying &middot; GIS &middot; Information Technology</p>
            <p class="hero-journey">Measure &middot; Understand &middot; Build</p>
            <div class="hero-accent-line" aria-hidden="true"></div>
            <div class="hero-scroll-cue">
              <span class="hero-scroll-icon" aria-hidden="true">&darr;</span>
              <span>Scroll to explore</span>
            </div>
          </div>

          <div class="career-universe-story-panels" aria-label="Career universe chapters">
            <article class="career-story-panel overview" data-story-panel="overview">
              <p class="career-story-step">00 &mdash; About Me</p>
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
            </article>

            <article class="career-story-panel survey" data-story-panel="survey">
              <p class="career-story-step">01 &mdash; Measure</p>
              <h2>Surveying</h2>
              <p class="career-story-body">
                Capturing the physical world with precise and reliable data.
              </p>
              <dl class="career-story-education">
                <div>
                  <dt>Education</dt>
                  <dd>Bachelor of Surveying and Mapping Engineering</dd>
                  <ddd>City Institution of Dalian University of Technology</ddd>
                  <dd>GPA:3.71/4.0</dd>
                </div>
                <button class="project-link" type="button">
                    View Project Details &rarr;
                </button>
              </dl>
            </article>

            <article class="career-story-panel gis" data-story-panel="gis">
              <p class="career-story-step">02 &mdash; Understand</p>
              <h2>GIS</h2>
              <p class="career-story-body">
                Transforming spatial data into insight and understanding.
              </p>
              <dl class="career-story-education">
                <div>
                  <dt>Education</dt>
                  <dd>Master of Geographic Information Science</dd>
                  <ddd>The University of Queensland</ddd>
                  <dd>GPA:5.83/7.0</dd>
                </div>
                <button class="project-link" type="button">
                  Explore projects &rarr;
                </button>
              </dl>
            </article>

            <article class="career-story-panel it" data-story-panel="it">
              <p class="career-story-step">03 &mdash; Build</p>
              <h2>Information Technology</h2>
              <p class="career-story-body">
                Building software, automation and digital solutions.
              </p>
              <dl class="career-story-education">
                <div>
                  <dt>Education</dt>
                  <dd>Master of Information Technology (Computer Science)</dd>
                  <ddd>Queensland University of Technology</ddd>
                  <dd>GPA:5.875/7.0</dd>
                </div>
                <button class="project-link" type="button">
                    Explore projects &rarr;
                  </button>
              </dl>
            </article>
          </div>
          
          <div class="career-universe-progress" aria-label="Career universe navigation">
           <article class="career-progress-card intro">
              <span class="career-progress-icon" aria-hidden="true">T</span>
              <div class="career-progress-copy">
              <span class="career-progress-index">00</span>
                <span class="career-progress-title">Introduction</span>
              </div>
            </article>
            <button class="career-progress-marker" type="button" data-story-target="overview">Overview</button>
            <article class="career-progress-card survey">
              <span class="career-progress-icon" aria-hidden="true">T</span>
              <div class="career-progress-copy">
                <span class="career-progress-index">01</span>
                <span class="career-progress-title">Measure</span>
              </div>
            </article>
            <button class="career-progress-marker" type="button" data-story-target="survey">Surveying</button>
            <article class="career-progress-card gis">
              <span class="career-progress-icon" aria-hidden="true">&#9633;</span>
              <div class="career-progress-copy">
                <span class="career-progress-index">02</span>
                <span class="career-progress-title">Understand</span>
              </div>
            </article>
            <button class="career-progress-marker" type="button" data-story-target="gis">GIS</button>
            <article class="career-progress-card it">
              <span class="career-progress-icon" aria-hidden="true">&lt;/&gt;</span>
              <div class="career-progress-copy">
                <span class="career-progress-index">03</span>
                <span class="career-progress-title">Build</span>
              </div>
            </article>
            <button class="career-progress-marker" type="button" data-story-target="it">IT</button>
          </div>
        </div>
        
        <div class="hero-visual career-universe-visual">
          <div id="career-universe-canvas" class="career-universe-canvas" aria-label="Three-planet career universe overview"></div>
        </div>
      </div>
      <div class="career-universe-summaries sr-only" aria-label="Career universe summary">
        <article class="career-universe-summary-card">
          <p class="career-story-step">01 &mdash; Measure</p>
          <h2>Surveying</h2>
          <p class="career-story-body">
            Capturing the physical world with precise and reliable data.
          </p>
          <h3>Key Skills</h3>
          <ul>
            <li>GNSS / GPS</li>
            <li>Total Station</li>
            <li>AutoCAD</li>
            <li>Point Cloud</li>
            <li>Survey Data Processing</li>
          </ul>
        </article>
        <article class="career-universe-summary-card">
          <p class="career-story-step">02 &mdash; Understand</p>
          <h2>GIS</h2>
          <p class="career-story-body">
            Transforming spatial data into insight and understanding.
          </p>
          <p class="career-story-body">
            Master of Geographic Information Systems
            <br />
            The University of Queensland
          </p>
          <h3>Key Skills</h3>
          <ul>
            <li>ArcGIS Pro</li>
            <li>QGIS</li>
            <li>Spatial Analysis</li>
            <li>Geospatial Data</li>
            <li>Python GIS</li>
            <li>Mapping</li>
          </ul>
        </article>
        <article class="career-universe-summary-card">
          <p class="career-story-step">03 &mdash; Build</p>
          <h2>Information Technology</h2>
          <p class="career-story-body">
            Building software, automation and digital solutions.
          </p>
          <p class="career-story-body">
            Master of Information Technology
            <br />
            Queensland University of Technology
          </p>
          <h3>Key Skills</h3>
          <ul>
            <li>Python</li>
            <li>JavaScript</li>
            <li>C#</li>
            <li>React</li>
            <li>SQL</li>
            <li>REST APIs</li>
            <li>Automation</li>
            <li>Databases</li>
          </ul>
        </article>
      </div>
      <div class="career-universe-scroll-track" aria-hidden="true"></div>
    </section>
  `;
}
