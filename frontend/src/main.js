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
        document.getElementById(result.sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

renderApp();
window.addEventListener("hashchange", renderApp);
