import { renderHomePage } from "../pages/homePage";
import { renderIntegratedStoryPage } from "../pages/integratedStoryPage";
import { renderLensPage } from "../pages/lensPage";
import "../styles/global.css";

export function bootstrap() {
  const appRoot = document.querySelector("#app");
  const hash = window.location.hash || "#";

  if (hash.startsWith("#/lens/")) {
    const lensId = hash.replace("#/lens/", "").split("#")[0];

    if (lensId === "integrated") {
      appRoot.innerHTML = renderIntegratedStoryPage();
      return { page: "integrated-story", lensId };
    }

    appRoot.innerHTML = renderLensPage(lensId);
    return { page: "lens", lensId };
  }

  if (hash === "#/integrated-story") {
    appRoot.innerHTML = renderIntegratedStoryPage();
    return { page: "integrated-story" };
  }

  if (hash.startsWith("#/section/")) {
    const sectionId = hash.replace("#/section/", "");
    appRoot.innerHTML = renderHomePage();
    return { page: "home", sectionId };
  }

  appRoot.innerHTML = renderHomePage();
  return { page: "home" };
}

