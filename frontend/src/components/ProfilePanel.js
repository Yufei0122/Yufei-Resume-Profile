export function renderProfilePanel() {
  return `
    <section id="profile" class="panel">
      <div>
        <p class="label">Profile endpoint</p>
        <p class="value" id="profile-endpoint">/api/v1/profile</p>
      </div>
      <div>
        <p class="label">Current headline</p>
        <p class="value" id="profile-headline">Loading...</p>
      </div>
    </section>
  `;
}

