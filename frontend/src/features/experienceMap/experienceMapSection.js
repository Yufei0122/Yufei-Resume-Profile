import { experienceCategories, experiencePlaces, experiences, getExperiences, getVisiblePlaces } from "./experienceMapData.js";
import "./experienceMap.css";

const categoryLabels = { education: "Education", work: "Work", origin: "Origins" };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function renderPlaceDetails(placeId = null, category = "all", order = "newest") {
  const place = experiencePlaces.find((item) => item.id === placeId);
  const entries = getExperiences({ placeId, category, order });
  return `
    <div class="experience-place-heading">
      <p class="experience-eyebrow">${place ? "Selected location" : "Across all places"}</p>
      <h3>${place?.name ?? "My timeline"}</h3>
      <p>${place?.region ?? "Education, work and where it all began."}</p>
      <p class="experience-order-note">${order === "oldest" ? "Oldest first" : "Newest first"} · By start date</p>
    </div>
    <div class="experience-entries">
      ${entries.map((entry) => `
        <article class="experience-entry experience-${entry.category}" data-experience-id="${entry.id}" data-experience-place="${entry.placeId}">
          <div class="experience-entry-meta">
            <span class="experience-type">${categoryLabels[entry.category]}</span>
            <span>${entry.period}</span>
          </div>
          <h4>${escapeHtml(entry.title)}</h4>
          <p class="experience-organization">${escapeHtml(entry.organization)}</p>
          <span class="experience-entry-location">${escapeHtml(experiencePlaces.find((item) => item.id === entry.placeId).name)}</span>
          <p>${escapeHtml(entry.summary)}</p>
          ${entry.highlights.length ? `<ul>${entry.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}</ul>` : ""}
          <div class="experience-tags">${entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </article>
      `).join("")}
    </div>
  `;
}

export function renderExperienceMapSection() {
  return `
    <section class="experience-section section-card" id="experience" aria-labelledby="experience-title">
      <div class="experience-heading">
        <div>
          <p class="section-kicker">My journey</p>
          <h2 id="experience-title">Places that <span class="text-green">shaped my path.</span></h2>
          <p>From my roots in Jiaxing to studying and building in Brisbane. Explore the places behind my education and work.</p>
        </div>
        <div class="experience-stats" aria-label="Journey overview">
          <span><strong>2</strong> countries</span>
          <span><strong>${experiences.filter((entry) => entry.category === "education").length}</strong> study programs</span>
          <span><strong>${experiences.filter((entry) => entry.category === "work").length}</strong> roles</span>
        </div>
      </div>
      <div class="experience-toolbar">
        <div class="experience-filters" role="group" aria-label="Filter experiences">
          ${experienceCategories.map((category) => `<button type="button" class="experience-filter" data-experience-filter="${category.id}" aria-pressed="${category.id === "all"}">${category.label}</button>`).join("")}
        </div>
        <div class="experience-view-controls">
          <label class="experience-sort" for="experience-order">Order
            <select id="experience-order" data-experience-order>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
          <button class="experience-reset" type="button" data-experience-reset>Show all places <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <div class="experience-layout">
        <div class="experience-geography">
          <div class="experience-map-wrap">
            <div id="experience-map" class="experience-map" role="region" aria-label="Interactive map of education, work and birthplace" aria-describedby="experience-map-hint"></div>
            <p class="experience-map-status" data-map-status role="status">Loading map…</p>
            <p class="experience-map-detail-status" data-map-detail-status role="status" hidden></p>
            <span class="experience-map-north" aria-hidden="true">↑<br>N</span>
          </div>
          <p class="experience-map-hint" id="experience-map-hint">Select a map pin to explore my experiences. Use + / − for city details or the full journey. Pins mark cities, counties and study or work locations.</p>
        </div>
        <div class="experience-details" id="experience-details" role="region" aria-label="Experience timeline" tabindex="0">
          ${renderPlaceDetails()}
        </div>
      </div>
      <p class="sr-only" data-experience-announcement role="status" aria-live="polite"></p>
    </section>
  `;
}

export function mountExperienceMapSection() {
  const section = document.getElementById("experience");
  if (!section) return () => {};

  let category = "all";
  let selectedPlaceId = null;
  let order = "newest";
  let mapApi = null;
  let disposed = false;
  const details = section.querySelector("#experience-details");
  const status = section.querySelector("[data-map-status]");
  const detailStatus = section.querySelector("[data-map-detail-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let experienceObserver = null;
  let hasScrolledExperience = false;

  function markExperienceScrolled() {
    hasScrolledExperience = true;
  }

  function updateContent() {
    section.querySelectorAll("[data-experience-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.experienceFilter === category));
    });
    const places = getVisiblePlaces(category, order);
    details.innerHTML = renderPlaceDetails(selectedPlaceId, category, order);
    details.scrollTop = 0;
    experienceObserver?.disconnect();
    const place = experiencePlaces.find((item) => item.id === selectedPlaceId);
    const count = getExperiences({ placeId: selectedPlaceId, category }).length;
    section.querySelector("[data-experience-announcement]").textContent = `${place?.name ?? "All places"}: ${count} ${count === 1 ? "experience" : "experiences"}, ${order === "oldest" ? "oldest first" : "newest first"}.`;
    mapApi?.update(places, selectedPlaceId, category);
    details.querySelectorAll("[data-experience-id]").forEach((entry) => experienceObserver?.observe(entry));
  }

  function focusExperienceEntry(entry) {
    const placeId = entry.dataset.experiencePlace;
    if (!placeId || placeId === selectedPlaceId && mapApi) return;
    selectedPlaceId = placeId;
    const places = getVisiblePlaces(category, order);
    mapApi?.update(places, selectedPlaceId, category);
    mapApi?.focus(placeId);
  }

  function selectPlace(placeId, { focus = true } = {}) {
    selectedPlaceId = placeId;
    updateContent();
    if (focus) mapApi?.focus(placeId);
  }

  function handleClick(event) {
    const filter = event.target.closest("[data-experience-filter]");
    if (filter) {
      category = filter.dataset.experienceFilter;
      const places = getVisiblePlaces(category, order);
      if (!places.some((place) => place.id === selectedPlaceId)) selectedPlaceId = null;
      updateContent();
      mapApi?.fit();
    } else if (event.target.closest("[data-experience-reset]")) {
      category = "all";
      selectedPlaceId = null;
      updateContent();
      mapApi?.fit();
    }
  }

  section.addEventListener("click", handleClick);
  function handleOrderChange(event) {
    if (!event.target.matches("[data-experience-order]")) return;
    order = event.target.value;
    updateContent();
  }
  section.addEventListener("change", handleOrderChange);
  details.addEventListener("scroll", markExperienceScrolled, { passive: true });
  window.addEventListener("scroll", markExperienceScrolled, { passive: true });
  experienceObserver = new IntersectionObserver((entries) => {
    if (!hasScrolledExperience) return;
    const activeEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (activeEntry) focusExperienceEntry(activeEntry.target);
  }, { threshold: [0.45, 0.7], rootMargin: "-18% 0px -42%" });
  let observer = null;
  async function loadMap() {
    observer?.disconnect();
    try {
      const { createExperienceMap } = await import("./experienceMap.js");
      if (disposed) return;
      mapApi = createExperienceMap(section.querySelector("#experience-map"), {
        onSelect: selectPlace, reducedMotion,
        onDetailStatus(message) {
          detailStatus.textContent = message;
          detailStatus.hidden = !message;
        },
      });
      mapApi.update(getVisiblePlaces(category, order), selectedPlaceId, category);
      if (selectedPlaceId) mapApi.focus(selectedPlaceId);
      else mapApi.fit();
      status.hidden = true;
    } catch (error) {
      if (disposed) return;
      status.textContent = "The map could not load. You can still browse, filter and sort the experience timeline.";
      console.error("Experience map could not load:", error);
    }
  }

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMap(); }, { rootMargin: "400px" });
    observer.observe(section);
  } else {
    loadMap();
  }

  return () => {
    disposed = true;
    observer?.disconnect();
    experienceObserver?.disconnect();
    section.removeEventListener("click", handleClick);
    section.removeEventListener("change", handleOrderChange);
    details.removeEventListener("scroll", markExperienceScrolled);
    window.removeEventListener("scroll", markExperienceScrolled);
    mapApi?.destroy();
  };
}
