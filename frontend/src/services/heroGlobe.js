import * as THREE from "three";
import earthMap from "../source/world-map.png";

function createLatitudeLine(radius, segments, color, opacity, y) {
  const points = [];
  const ringRadius = Math.sqrt(Math.max(radius * radius - y * y, 0));

  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * ringRadius,
        y,
        Math.sin(theta) * ringRadius
      )
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });

  return new THREE.LineLoop(geometry, material);
}

function createLongitudeLine(radius, segments, color, opacity, rotationY) {
  const points = [];

  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        0,
        Math.cos(theta) * radius,
        Math.sin(theta) * radius
      )
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  const line = new THREE.LineLoop(geometry, material);
  line.rotation.y = rotationY;
  return line;
}

function createGraticule(radius) {
  const group = new THREE.Group();
  const color = 0x6dbb94;
  const opacity = 0.32;
  const segments = 192;

  for (let lat = -75; lat <= 75; lat += 15) {
    const phi = THREE.MathUtils.degToRad(lat);
    const y = Math.sin(phi) * radius;
    group.add(createLatitudeLine(radius, segments, color, opacity, y));
  }

  for (let lon = 0; lon < 180; lon += 15) {
    const rotationY = THREE.MathUtils.degToRad(lon);
    group.add(
      createLongitudeLine(radius, segments, color, opacity, rotationY)
    );
  }

  return group;
}

function createTextSprite(text, color) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 96;

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = "700 30px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, 42);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.64, 0.24, 1);
  return sprite;
}

function createSatellite({
  radius,
  color,
  label,
  tiltX = 0,
  tiltZ = 0,
  phase = 0,
  index,
}) {
  const group = new THREE.Group();
  const pivot = new THREE.Group();
  const satelliteAnchor = new THREE.Group();
  group.add(pivot);

  satelliteAnchor.position.set(radius, 0, 0);
  pivot.add(satelliteAnchor);

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 24, 24),
    new THREE.MeshBasicMaterial({ color })
  );
  satelliteAnchor.add(body);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.095, 24, 24),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.16,
    })
  );
  satelliteAnchor.add(glow);

  const labelSprite = createTextSprite(label, `#${color.toString(16).padStart(6, "0")}`);
  if (labelSprite) {
    labelSprite.position.set(0, 0.18, 0);
    satelliteAnchor.add(labelSprite);
  }

  group.rotation.x = tiltX;
  group.rotation.z = tiltZ;
  pivot.rotation.y = phase;

  body.userData.isSatellite = true;
  body.userData.satelliteIndex = index;
  glow.userData.isSatellite = true;
  glow.userData.satelliteIndex = index;

  return { group, pivot, body, glow, labelSprite };
}

export function mountHeroGlobe() {
  const container = document.querySelector("#hero-globe");
  if (!container) {
    return;
  }

  if (container.dataset.mounted === "true") {
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) {
    return;
  }

  const scene = new THREE.Scene();
  scene.background = null;

  const systemGroup = new THREE.Group();
  scene.add(systemGroup);

  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.1,
    1000
  );
  camera.position.z = 4.8;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  container.dataset.mounted = "true";

  const globeGroup = new THREE.Group();
  systemGroup.add(globeGroup);
  systemGroup.scale.set(1.34, 1.34, 1.34);
  systemGroup.position.y = -0.12;

  const globeGeometry = new THREE.SphereGeometry(1.2, 64, 64);
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load(earthMap);
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  const globeMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
    color: 0xffffff,
  });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  globe.rotation.y = Math.PI;
  globeGroup.add(globe);

  const graticule = createGraticule(1.205);
  graticule.rotation.y = Math.PI;
  globeGroup.add(graticule);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.235, 64, 64),
    new THREE.MeshBasicMaterial({
      color: 0xcdf4dd,
      transparent: true,
      opacity: 0.04,
    })
  );
  globeGroup.add(atmosphere);

  const satellites = [
    {
      ...createSatellite({
      radius: 1.58,
      color: 0x3a9d6b,
      label: "GIS",
      tiltX: 0.45,
      tiltZ: -0.2,
      phase: 0.35,
      index: 0,
      }),
      speed: 0.008,
    },
    {
      ...createSatellite({
      radius: 1.72,
      color: 0xef8a2c,
      label: "IT",
      tiltX: -0.85,
      tiltZ: 0.3,
      phase: 2.2,
      index: 1,
      }),
      speed: -0.0062,
    },
    {
      ...createSatellite({
      radius: 1.82,
      color: 0x8077ef,
      label: "Integrated",
      tiltX: 0.2,
      tiltZ: 0.95,
      phase: 4.0,
      index: 2,
      }),
      speed: 0.0048,
    },
    {
      ...createSatellite({
      radius: 1.94,
      color: 0x5b8bd9,
      label: "Survey",
      tiltX: -0.35,
      tiltZ: -0.88,
      phase: 5.1,
      index: 3,
      }),
      speed: -0.0052,
    },
  ];

  satellites.forEach(({ group }, index) => {
    group.userData.satelliteIndex = index;
    systemGroup.add(group);
  });

  const labelGroups = [
    [0, 1],
    [2, 3],
  ];
  let activeLabelGroupIndex = 0;
  let hoveredSatelliteIndex = null;
  let labelCyclePaused = false;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hoverTargets = satellites.flatMap(({ body, glow }) => [body, glow]);

  function updateVisibleLabels() {
    const activeGroup =
      hoveredSatelliteIndex === null
        ? labelGroups[activeLabelGroupIndex]
        : [hoveredSatelliteIndex];

    satellites.forEach(({ labelSprite }, index) => {
      if (labelSprite) {
        labelSprite.visible = activeGroup.includes(index);
      }
    });
  }

  updateVisibleLabels();

  const labelCycleId = window.setInterval(() => {
    if (labelCyclePaused) {
      return;
    }
    activeLabelGroupIndex = (activeLabelGroupIndex + 1) % labelGroups.length;
    updateVisibleLabels();
  }, 3000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.35);
  directionalLight.position.set(4, 3, 5);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xf4fff8, 0.2);
  fillLight.position.set(-3, 1, 4);
  scene.add(fillLight);

  let isRightDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;

  function handleContextMenu(event) {
    event.preventDefault();
  }

  function handlePointerDown(event) {
    if (event.button !== 2) {
      return;
    }

    event.preventDefault();
    isRightDragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  }

  function handlePointerMove(event) {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (!isRightDragging) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(hoverTargets, false)[0];
      const nextHoveredIndex = hit?.object?.userData?.satelliteIndex ?? null;

      if (nextHoveredIndex !== hoveredSatelliteIndex) {
        if (hoveredSatelliteIndex !== null) {
          const previous = satellites[hoveredSatelliteIndex];
          previous.body.scale.setScalar(1);
          previous.glow.scale.setScalar(1);
        }

        hoveredSatelliteIndex = nextHoveredIndex;
        labelCyclePaused = hoveredSatelliteIndex !== null;

        if (hoveredSatelliteIndex !== null) {
          const current = satellites[hoveredSatelliteIndex];
          current.body.scale.setScalar(1.35);
          current.glow.scale.setScalar(1.25);
        }

        container.style.cursor = hoveredSatelliteIndex !== null ? "pointer" : "default";
        updateVisibleLabels();
      }
      return;
    }

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    targetRotationY += deltaX * 0.0055;
    targetRotationX += deltaY * 0.0035;
    targetRotationX = THREE.MathUtils.clamp(targetRotationX, -0.55, 0.55);

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  }

  function handlePointerUp() {
    isRightDragging = false;
  }

  function handlePointerLeave() {
    if (hoveredSatelliteIndex !== null) {
      const current = satellites[hoveredSatelliteIndex];
      current.body.scale.setScalar(1);
      current.glow.scale.setScalar(1);
    }

    hoveredSatelliteIndex = null;
    labelCyclePaused = false;
    container.style.cursor = "default";
    updateVisibleLabels();
    isRightDragging = false;
  }

  container.addEventListener("contextmenu", handleContextMenu);
  container.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  container.addEventListener("pointerleave", handlePointerLeave);

  function animate() {
    requestAnimationFrame(animate);
    targetRotationY += 0.0035;
    globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.08;
    globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.08;
    satellites.forEach(({ pivot, speed }, index) => {
      if (hoveredSatelliteIndex !== index) {
        pivot.rotation.y += speed;
      }
    });
    satellites.forEach(({ labelSprite }) => {
      labelSprite?.lookAt(camera.position);
    });
    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", handleResize);
  container.dataset.labelCycleId = String(labelCycleId);
}
