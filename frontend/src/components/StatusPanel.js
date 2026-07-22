export function renderStatusPanel(apiUrl) {
  return `
    <section id="status" class="panel">
      <div>
        <p class="label">Backend endpoint</p>
        <p class="value">${apiUrl}/api/v1/health</p>
      </div>
      <div>
        <p class="label">Runtime status</p>
        <p id="health-status" class="value">Loading...</p>
      </div>
    </section>
  `;
}

