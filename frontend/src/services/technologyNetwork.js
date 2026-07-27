import * as THREE from "three";

function createLabelSprite(text, color, background) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 320;
  canvas.height = 120;

  if (!context) {
    return null;
  }

  const radius = 24;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = background;
  context.strokeStyle = color;
  context.lineWidth = 3;

  context.beginPath();
  context.moveTo(radius, 14);
  context.lineTo(canvas.width - radius, 14);
  context.quadraticCurveTo(canvas.width - 14, 14, canvas.width - 14, radius);
  context.lineTo(canvas.width - 14, canvas.height - radius);
  context.quadraticCurveTo(
    canvas.width - 14,
    canvas.height - 14,
    canvas.width - radius,
    canvas.height - 14
  );
  context.lineTo(radius, canvas.height - 14);
  context.quadraticCurveTo(14, canvas.height - 14, 14, canvas.height - radius);
  context.lineTo(14, radius);
  context.quadraticCurveTo(14, 14, radius, 14);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = color;
  context.font = "700 34px Space Grotesk, Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.7, 0.64, 1);
  return sprite;
}

function createCoreLabelSprite() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 240;

  if (!context) {
    return null;
  }

  const radius = 34;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(255,255,255,0.96)";
  context.strokeStyle = "rgba(58,157,107,0.28)";
  context.lineWidth = 4;

  context.beginPath();
  context.moveTo(radius, 20);
  context.lineTo(canvas.width - radius, 20);
  context.quadraticCurveTo(canvas.width - 20, 20, canvas.width - 20, radius);
  context.lineTo(canvas.width - 20, canvas.height - radius);
  context.quadraticCurveTo(
    canvas.width - 20,
    canvas.height - 20,
    canvas.width - radius,
    canvas.height - 20
  );
  context.lineTo(radius, canvas.height - 20);
  context.quadraticCurveTo(20, canvas.height - 20, 20, canvas.height - radius);
  context.lineTo(20, radius);
  context.quadraticCurveTo(20, 20, radius, 20);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = "#3a9d6b";
  context.font = "700 26px Space Grotesk, Arial";
  context.textAlign = "center";
  context.fillText("Core Platform", canvas.width / 2, 74);

  context.fillStyle = "#223048";
  context.font = "700 40px Space Grotesk, Arial";
  context.fillText("Integrated GIS + Software System", canvas.width / 2, 134);

  context.fillStyle = "#708197";
  context.font = "500 23px Space Grotesk, Arial";
  context.fillText("Spatial thinking, software delivery and connected workflows", canvas.width / 2, 182);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4.4, 1.48, 1);
  return sprite;
}

function createGlow(color, radius, opacity) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
    })
  );
}

export function mountTechnologyNetwork() {
  const container = document.querySelector("#technology-network");
  if (!container || container.dataset.mounted === "true") {
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
  camera.position.set(0, 0, 11.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  container.dataset.mounted = "true";

  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.55, 0.025, 16, 180),
    new THREE.MeshBasicMaterial({
      color: 0xcfe8dc,
      transparent: true,
      opacity: 0.88,
    })
  );
  ring.rotation.x = Math.PI / 2.8;
  networkGroup.add(ring);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.45, 0.018, 16, 160),
    new THREE.MeshBasicMaterial({
      color: 0xe0ece6,
      transparent: true,
      opacity: 0.9,
    })
  );
  innerRing.rotation.x = Math.PI / 2.8;
  networkGroup.add(innerRing);

  const coreGroup = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
    })
  );
  const coreGlow = createGlow(0x3a9d6b, 0.95, 0.1);
  coreGroup.add(coreGlow);
  coreGroup.add(core);
  const coreLabel = createCoreLabelSprite();
  if (coreLabel) {
    coreLabel.position.set(0, -1.58, 0);
    coreGroup.add(coreLabel);
  }
  networkGroup.add(coreGroup);

  const nodeConfigs = [
    {
      label: "GIS",
      color: 0x3a9d6b,
      bg: "rgba(237,248,241,0.96)",
      angle: -0.1,
      radius: 3.65,
      speed: 0.0036,
    },
    {
      label: "IT",
      color: 0xef8a2c,
      bg: "rgba(255,244,234,0.96)",
      angle: Math.PI / 2 - 0.25,
      radius: 3.3,
      speed: -0.003,
    },
    {
      label: "Survey",
      color: 0x5b8bd9,
      bg: "rgba(236,243,255,0.96)",
      angle: Math.PI + 0.4,
      radius: 3.75,
      speed: 0.0028,
    },
    {
      label: "AI",
      color: 0x8077ef,
      bg: "rgba(242,239,255,0.96)",
      angle: (Math.PI * 3) / 2 + 0.2,
      radius: 3.38,
      speed: -0.0033,
    },
  ];

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredNodeIndex = null;

  const nodes = nodeConfigs.map((config, index) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshBasicMaterial({ color: config.color })
    );
    const glow = createGlow(config.color, 0.34, 0.18);
    const label = createLabelSprite(config.label, `#${config.color.toString(16).padStart(6, "0")}`, config.bg);
    if (label) {
      label.position.set(0, 0.58, 0);
      group.add(label);
    }

    const hitArea = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 24, 24),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      })
    );
    hitArea.userData.nodeIndex = index;

    group.add(glow);
    group.add(body);
    group.add(hitArea);

    const lineMaterial = new THREE.LineDashedMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.42,
      dashSize: 0.16,
      gapSize: 0.08,
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.computeLineDistances();
    networkGroup.add(line);

    networkGroup.add(group);

    return {
      ...config,
      group,
      body,
      glow,
      label,
      hitArea,
      line,
      angleOffset: config.angle,
      phase: Math.random() * Math.PI * 2,
    };
  });

  function updatePointer(event) {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function handlePointerMove(event) {
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(nodes.map((node) => node.hitArea), false)[0];
    const nextIndex = hit?.object?.userData?.nodeIndex ?? null;

    if (nextIndex === hoveredNodeIndex) {
      return;
    }

    if (hoveredNodeIndex !== null) {
      const previous = nodes[hoveredNodeIndex];
      previous.body.scale.setScalar(1);
      previous.glow.scale.setScalar(1);
      if (previous.label) {
        previous.label.scale.set(1.7, 0.64, 1);
      }
    }

    hoveredNodeIndex = nextIndex;
    container.style.cursor = hoveredNodeIndex !== null ? "pointer" : "default";

    if (hoveredNodeIndex !== null) {
      const current = nodes[hoveredNodeIndex];
      current.body.scale.setScalar(1.2);
      current.glow.scale.setScalar(1.16);
      if (current.label) {
        current.label.scale.set(1.9, 0.72, 1);
      }
    }
  }

  function handlePointerLeave() {
    if (hoveredNodeIndex !== null) {
      const current = nodes[hoveredNodeIndex];
      current.body.scale.setScalar(1);
      current.glow.scale.setScalar(1);
      if (current.label) {
        current.label.scale.set(1.7, 0.64, 1);
      }
    }

    hoveredNodeIndex = null;
    container.style.cursor = "default";
  }

  container.addEventListener("pointermove", handlePointerMove);
  container.addEventListener("pointerleave", handlePointerLeave);

  function animate() {
    requestAnimationFrame(animate);
    networkGroup.rotation.z += 0.0012;
    ring.rotation.z += 0.00045;
    innerRing.rotation.z -= 0.00055;

    nodes.forEach((node, index) => {
      if (hoveredNodeIndex !== index) {
        node.angleOffset += node.speed;
      }

      const x = Math.cos(node.angleOffset) * node.radius;
      const y = Math.sin(node.angleOffset) * node.radius * 0.72;
      const z = Math.sin(node.angleOffset * 1.6 + node.phase) * 0.32;

      node.group.position.set(x, y, z);
      node.glow.material.opacity = hoveredNodeIndex === index ? 0.28 : 0.18;

      const linePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
      node.line.geometry.setFromPoints(linePoints);
      node.line.computeLineDistances();

      if (node.label) {
        node.label.lookAt(camera.position);
      }
    });

    if (coreLabel) {
      coreLabel.lookAt(camera.position);
    }

    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight;
    if (!nextWidth || !nextHeight) {
      return;
    }

    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
  }

  window.addEventListener("resize", handleResize);
}
