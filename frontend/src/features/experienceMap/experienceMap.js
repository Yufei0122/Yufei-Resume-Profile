import L from "leaflet";
import "leaflet/dist/leaflet.css";
import land from "./land.json";
import { getPlaceExperiences } from "./experienceMapData.js";

const CITY_ZOOM = 11;
const MAX_CITY_ZOOM = 13;
const CITY_DETAILS_ZOOM = 6;
const PLACE_GROUPS = {
  zhejiang: { name: "Zhejiang", expandZoom: 8 },
  brisbane: { name: "Brisbane", expandZoom: 13 },
};

export function createExperienceMap(container, { onSelect, reducedMotion, onDetailStatus = () => {} }) {
  const map = L.map(container, {
    center: [9, 133], zoom: 3, minZoom: 2, maxZoom: MAX_CITY_ZOOM,
    zoomSnap: 0.25, scrollWheelZoom: false,
    maxBounds: [[-65, 45], [75, 200]], maxBoundsViscosity: 0.8,
    zoomAnimation: !reducedMotion, fadeAnimation: !reducedMotion,
    markerZoomAnimation: !reducedMotion,
  });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noreferrer">Leaflet</a>');
  map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a>');

  for (let longitude = 30; longitude <= 210; longitude += 15) {
    L.polyline([[-65, longitude], [75, longitude]], { color: "#c7d9dd", weight: 1, opacity: 0.48, interactive: false }).addTo(map);
  }
  for (let latitude = -60; latitude <= 75; latitude += 15) {
    L.polyline([[latitude, 30], [latitude, 210]], { color: "#c7d9dd", weight: 1, opacity: 0.48, interactive: false }).addTo(map);
  }
  L.geoJSON(land, {
    style: { color: "#b9c9bd", weight: 1, fillColor: "#f6f4e9", fillOpacity: 1 },
    interactive: false,
  }).addTo(map);

  // Detailed tiles sit above the bundled overview but below pins and tooltips.
  const cityPane = map.createPane("experienceCityTiles");
  cityPane.style.zIndex = "450";
  cityPane.style.pointerEvents = "none";
  const cityTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    pane: "experienceCityTiles", minZoom: CITY_DETAILS_ZOOM, maxZoom: MAX_CITY_ZOOM,
    className: "experience-city-tiles", keepBuffer: 1,
    updateWhenIdle: true, updateWhenZooming: false,
    referrerPolicy: "strict-origin-when-cross-origin",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
  });
  const failedTiles = new Set();
  function reportTileStatus() {
    onDetailStatus(map.hasLayer(cityTiles) && failedTiles.size
      ? "Some city details are unavailable. The overview and experience pins remain available."
      : "");
  }
  cityTiles.on("tileerror", ({ tile }) => {
    tile.style.visibility = "hidden";
    failedTiles.add(tile);
    reportTileStatus();
  });
  cityTiles.on("tileload tileunload", ({ tile }) => {
    failedTiles.delete(tile);
    reportTileStatus();
  });
  function updateCityDetails() {
    if (map.getZoom() >= CITY_DETAILS_ZOOM) {
      if (!map.hasLayer(cityTiles)) cityTiles.addTo(map);
    } else {
      cityTiles.remove();
      failedTiles.clear();
    }
    reportTileStatus();
  }
  L.control.scale({ imperial: false, position: "bottomleft", maxWidth: 100 }).addTo(map);

  const labels = L.layerGroup();
  for (const [name, coordinates] of [["CHINA", [36, 104]], ["AUSTRALIA", [-25, 134]], ["PACIFIC OCEAN", [3, 163]]]) {
    L.marker(coordinates, {
      interactive: false, keyboard: false,
      icon: L.divIcon({ className: "experience-country-label", html: name, iconSize: [150, 24], iconAnchor: [75, 12] }),
    }).addTo(labels);
  }

  const markers = L.layerGroup().addTo(map);
  let visiblePlaces = [];
  let selectedId = null;
  let category = "all";
  let viewMode = "overview";

  function makeMarker(place) {
    const entries = getPlaceExperiences(place.id, category);
    const categories = [...new Set(entries.map((entry) => entry.category))];
    const tone = categories.length > 1 ? "mixed" : categories[0];
    const selected = place.id === selectedId;
    const marker = L.marker(place.coordinates, {
      title: `Explore ${place.name}: ${entries.length} ${entries.length === 1 ? "experience" : "experiences"}`,
      alt: `Explore ${place.name}`,
      zIndexOffset: selected ? 1000 : 0,
      icon: L.divIcon({
        className: `experience-pin experience-pin-${tone}${selected ? " is-selected" : ""}`,
        html: `<span class="experience-pin-dot">${entries.length}</span>`,
        iconSize: [32, 32], iconAnchor: [16, 16],
      }),
    });
    const direction = place.labelDirection ?? (place.id === "jiaxing" ? "left" : "right");
    marker.bindTooltip(place.name, {
      permanent: true, direction,
      offset: [direction === "left" ? -18 : 18, 0], className: "experience-pin-label", opacity: 1,
    });
    marker.on("click", (event) => {
      onSelect(place.id);
      if (event.originalEvent?.type === "keypress") {
        container.closest(".experience-section")?.querySelector(".experience-details")?.focus({ preventScroll: true });
      }
    });
    marker.addTo(markers);
    marker.getElement()?.setAttribute("aria-label", `Explore ${place.name}, ${place.region}: ${entries.length} experiences`);
  }

  function drawMarkers() {
    markers.clearLayers();
    if (map.getZoom() < 5) labels.addTo(map);
    else labels.remove();
    const clusteredIds = new Set();
    for (const [groupId, config] of Object.entries(PLACE_GROUPS)) {
      const nearby = visiblePlaces.filter((place) => place.group === groupId);
      if (nearby.length < 2 || map.getZoom() >= config.expandZoom) continue;
      nearby.forEach((place) => clusteredIds.add(place.id));
      makeCluster(nearby, config, groupId);
    }
    visiblePlaces.filter((place) => !clusteredIds.has(place.id)).forEach(makeMarker);
  }

  function makeCluster(nearby, config, groupId) {
    const bounds = L.latLngBounds(nearby.map((place) => place.coordinates));
    const cluster = L.marker(bounds.getCenter(), {
      title: `Explore ${config.name}: ${nearby.map((place) => place.name).join(", ")}`,
      icon: L.divIcon({
        className: `experience-pin experience-pin-cluster${nearby.some((place) => place.id === selectedId) ? " is-selected" : ""}`,
        html: `<span class="experience-pin-dot">${nearby.length}</span>`,
        iconSize: [40, 40], iconAnchor: [20, 20],
      }),
    });
    cluster.bindTooltip(`${config.name} · ${nearby.length} places`, { permanent: true, direction: "right", offset: [22, 0], className: "experience-pin-label", opacity: 1 });
    cluster.on("click", () => {
      const place = nearby.find((item) => item.id === selectedId) ?? nearby[0];
      onSelect(place.id, { focus: false });
      viewMode = "region";
      map.setView(bounds.getCenter(), config.expandZoom, { animate: !reducedMotion });
    });
    cluster.addTo(markers);
    cluster.getElement()?.setAttribute("data-place-group", groupId);
    cluster.getElement()?.setAttribute("aria-label", `Zoom to ${nearby.length} places in ${config.name}: ${nearby.map((place) => place.name).join(", ")}`);
  }

  function fit() {
    if (!visiblePlaces.length) return;
    viewMode = "overview";
    map.invalidateSize({ pan: false });
    if (visiblePlaces.length === 1) {
      map.setView(visiblePlaces[0].coordinates, visiblePlaces[0].focusZoom ?? CITY_ZOOM, { animate: !reducedMotion });
    } else {
      map.fitBounds(L.latLngBounds(visiblePlaces.map((place) => place.coordinates)), { padding: [70, 65], maxZoom: 8, animate: !reducedMotion });
    }
  }

  function focus(placeId) {
    const place = visiblePlaces.find((item) => item.id === placeId);
    if (!place) return;
    viewMode = "city";
    map.setView(place.coordinates, place.focusZoom ?? CITY_ZOOM, { animate: !reducedMotion });
  }

  map.on("zoomend", drawMarkers);
  map.on("zoomend", updateCityDetails);
  let resizeFrame = 0;
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false, pan: true });
      if (viewMode === "overview") fit();
    });
  });
  resizeObserver.observe(container);

  return {
    update(places, placeId, nextCategory) {
      visiblePlaces = places;
      selectedId = placeId;
      category = nextCategory;
      drawMarkers();
    },
    focus,
    fit,
    destroy() {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      map.off("zoomend", drawMarkers);
      map.off("zoomend", updateCityDetails);
      cityTiles.off();
      failedTiles.clear();
      map.remove();
    },
  };
}
