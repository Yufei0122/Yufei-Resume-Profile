import { renderHeroSection } from "../components/HeroSection";
import { renderProfilePanel } from "../components/ProfilePanel";
import { renderStatusPanel } from "../components/StatusPanel";
import { env } from "../config/env";
import { fetchHealth, fetchProfile } from "../services/profileService";

export function renderHomePage() {
  return `
    <main class="shell">
      ${renderHeroSection()}
      ${renderStatusPanel(env.apiUrl)}
      ${renderProfilePanel()}
    </main>
  `;
}

export async function hydrateHomePage() {
  const healthTarget = document.querySelector("#health-status");
  const headlineTarget = document.querySelector("#profile-headline");

  try {
    const [health, profile] = await Promise.all([fetchHealth(), fetchProfile()]);
    healthTarget.textContent = `${health.status} | database: ${health.database}`;
    headlineTarget.textContent = profile.headline;
  } catch (error) {
    healthTarget.textContent = `Unavailable | ${error.message}`;
    headlineTarget.textContent = "Unavailable";
  }
}

