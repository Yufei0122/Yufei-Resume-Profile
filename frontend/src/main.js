import { bootstrap } from "./app/bootstrap";
import { hydrateHomePage, teardownHomePage } from "./pages/homePage";
import { hydrateIntegratedStoryPage } from "./pages/integratedStoryPage";
import { hydrateLensPage } from "./pages/lensPage";

function renderApp() {
  teardownHomePage();
  const result = bootstrap();

  if (result.page === "home") {
    hydrateHomePage();

    if (result.sectionId) {
      requestAnimationFrame(() => {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
        document.getElementById(result.sectionId)?.scrollIntoView({ behavior, block: "start" });
      });
    }
  }

  if (result.page === "lens") {
    hydrateLensPage();
  }

  if (result.page === "integrated-story") {
    hydrateIntegratedStoryPage();
  }
}

const isReload = performance.getEntriesByType("navigation")[0]?.type === "reload";

renderApp();
if (isReload) {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
window.addEventListener("hashchange", renderApp);
