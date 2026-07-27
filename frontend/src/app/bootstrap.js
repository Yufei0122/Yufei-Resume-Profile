import { renderHomePage } from "../pages/homePage";
import "../styles/global.css";

export function bootstrap() {
  const appRoot = document.querySelector("#app");
  appRoot.innerHTML = renderHomePage();
}

