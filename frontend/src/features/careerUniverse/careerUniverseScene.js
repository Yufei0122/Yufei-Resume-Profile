import * as THREE from "three";
import { careerUniversePlanets } from "./careerUniverseData.js";
import { createGISTexture } from "./textures/createGISTexture";

const SURFACE_NORMAL = new THREE.Vector3(0, 0, 1);

function createLabelSprite(text, color, options = {}) {
  const {
    width = 256,
    height = 96,
    font = "700 30px Space Grotesk, Arial, sans-serif",
    scale = { x: 1.18, y: 0.42, z: 1 },
  } = options;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = font;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale.x, scale.y, scale.z);
  return sprite;
}

function resolveLayout(width, height) {
  const shortSide = Math.min(width, height);
  const scale = shortSide < 620 ? 0.78 : shortSide < 760 ? 0.86 : width > 1440 ? 1.1 : width > 1240 ? 1.03 : 0.97;
  const cameraZ = width > 1440 ? 8.6 : width > 1240 ? 8.85 : width > 1080 ? 9.05 : 9.35;
  return { scale, cameraZ };
}

function createOrbitPath(radius, color) {
  const geometry = new THREE.RingGeometry(radius - 0.012, radius + 0.012, 96);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geometry, material);
}

function createLineLoop(points, color, opacity) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.LineLoop(geometry, material);
}

function createLine(points, color, opacity) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.Line(geometry, material);
}

function latLonToVector3(radius, latitude, longitude, scale = 1) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);
  const radial = radius * scale;
  return new THREE.Vector3(
    -(radial * Math.sin(phi) * Math.cos(theta)),
    radial * Math.cos(phi),
    radial * Math.sin(phi) * Math.sin(theta)
  );
}

function addRenderable(target, renderable, materials, geometries) {
  if (!renderable?.mesh) {
    return;
  }
  target.add(renderable.mesh);
  if (renderable.material) {
    materials.push(renderable.material);
  }
  if (renderable.geometry) {
    geometries.push(renderable.geometry);
  }
}

function createSurfaceDisc(radius, latitude, longitude, size, color, options = {}) {
  const {
    elevation = 1.012,
    opacity = 0.72,
    segments = 24,
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
    roughness = 0.74,
    metalness = 0.04,
    emissive = null,
    emissiveIntensity = 0,
  } = options;

  const geometry = new THREE.CircleGeometry(size, segments);
  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity,
    roughness,
    metalness,
    side: THREE.DoubleSide,
    emissive: emissive ?? color,
    emissiveIntensity,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  const position = latLonToVector3(radius, latitude, longitude, elevation);
  const normal = position.clone().normalize();
  mesh.position.copy(position);
  mesh.quaternion.setFromUnitVectors(SURFACE_NORMAL, normal);
  mesh.rotateZ(rotate);
  mesh.scale.set(scaleX, scaleY, 1);
  return { mesh, material, geometry };
}

function createSurfaceNode(radius, latitude, longitude, size, color, options = {}) {
  const {
    elevation = 1.03,
    opacity = 0.86,
    detail = 16,
    emissive = color,
    emissiveIntensity = 0.18,
  } = options;
  const geometry = new THREE.SphereGeometry(size, detail, detail);
  const material = new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.38,
    metalness: 0.08,
    emissive,
    emissiveIntensity,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(latLonToVector3(radius, latitude, longitude, elevation));
  return { mesh, material, geometry };
}

function createSurfaceArc(radius, points, color, opacity = 0.18, elevation = 1.045) {
  const vectors = points.map(({ lat, lon }) => latLonToVector3(radius, lat, lon, elevation));
  const curve = new THREE.CatmullRomCurve3(vectors, false, "centripetal");
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  return { mesh: line, material, geometry };
}

function createSurveyVisuals(config) {
  const visualGroup = new THREE.Group();
  const materials = [];
  const geometries = [];
  const lineColor = new THREE.Color("#b86a3d");
  const pointColor = new THREE.Color("#f1dcc7");
  const gridColor = new THREE.Color("#d59a70");
  const radius = config.radius * 1.02;

  [
    { lat: 34, lon: -18, size: radius * 0.28, scaleX: 1.32, scaleY: 0.8, rotate: 0.42 },
    { lat: 8, lon: 18, size: radius * 0.2, scaleX: 1.18, scaleY: 0.74, rotate: -0.22 },
    { lat: -18, lon: 48, size: radius * 0.24, scaleX: 1.28, scaleY: 0.88, rotate: 0.16 },
    { lat: -34, lon: -26, size: radius * 0.18, scaleX: 1.1, scaleY: 0.72, rotate: -0.6 },
  ].forEach((patch) => {
    addRenderable(
      visualGroup,
      createSurfaceDisc(radius, patch.lat, patch.lon, patch.size, "#efc58d", {
        elevation: 1.008,
        opacity: 0.78,
        scaleX: patch.scaleX,
        scaleY: patch.scaleY,
        rotate: patch.rotate,
        roughness: 0.66,
        metalness: 0.03,
      }),
      materials,
      geometries
    );
    addRenderable(
      visualGroup,
      createSurfaceDisc(radius, patch.lat + 3, patch.lon - 3, patch.size * 0.76, "#d69458", {
        elevation: 1.014,
        opacity: 0.46,
        scaleX: patch.scaleX * 0.92,
        scaleY: patch.scaleY * 0.82,
        rotate: patch.rotate + 0.2,
        roughness: 0.72,
        metalness: 0.02,
      }),
      materials,
      geometries
    );
  });

  [-0.24, -0.08, 0.08, 0.24].forEach((yOffset, index) => {
    const points = [];
    const ringRadius = Math.sqrt(Math.max(radius * radius - yOffset * yOffset, 0));
    for (let i = 0; i <= 72; i += 1) {
      const theta = (i / 72) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * ringRadius, yOffset, Math.sin(theta) * ringRadius));
    }
    const loop = createLineLoop(points, index % 2 === 0 ? gridColor : lineColor, 0.1);
    visualGroup.add(loop);
    materials.push(loop.material);
    geometries.push(loop.geometry);
  });

  [0, Math.PI / 4, Math.PI / 2, (Math.PI / 4) * 3].forEach((rotationY, index) => {
    const points = [];
    for (let i = 0; i <= 72; i += 1) {
      const theta = (i / 72) * Math.PI * 2;
      points.push(new THREE.Vector3(0, Math.cos(theta) * radius, Math.sin(theta) * radius));
    }
    const loop = createLineLoop(points, index % 2 === 0 ? gridColor : lineColor, 0.09);
    loop.rotation.y = rotationY;
    visualGroup.add(loop);
    materials.push(loop.material);
    geometries.push(loop.geometry);
  });

  const controlPointPositions = [
    new THREE.Vector3(radius * 0.6, radius * 0.28, radius * 0.18),
    new THREE.Vector3(-radius * 0.48, radius * 0.36, -radius * 0.16),
    new THREE.Vector3(radius * 0.2, -radius * 0.42, -radius * 0.52),
    new THREE.Vector3(-radius * 0.18, -radius * 0.24, radius * 0.58),
  ];

  const pointGeometry = new THREE.SphereGeometry(config.radius * 0.038, 10, 10);
  const pointMaterial = new THREE.MeshBasicMaterial({
    color: pointColor,
    transparent: true,
    opacity: 0.3,
  });
  controlPointPositions.forEach((position) => {
    const marker = new THREE.Mesh(pointGeometry, pointMaterial);
    marker.position.copy(position);
    visualGroup.add(marker);
  });
  materials.push(pointMaterial);
  geometries.push(pointGeometry);

  const traversePoints = [
    controlPointPositions[0],
    controlPointPositions[1],
    controlPointPositions[2],
    controlPointPositions[3],
  ];
  const traverse = createLine(traversePoints, lineColor, 0.18);
  visualGroup.add(traverse);
  materials.push(traverse.material);
  geometries.push(traverse.geometry);

  const triangle = createLineLoop(
    [
      new THREE.Vector3(radius * 0.24, radius * 0.12, radius * 0.68),
      new THREE.Vector3(radius * 0.48, radius * 0.28, radius * 0.42),
      new THREE.Vector3(radius * 0.12, radius * 0.44, radius * 0.46),
    ],
    lineColor,
    0.16
  );
  visualGroup.add(triangle);
  materials.push(triangle.material);
  geometries.push(triangle.geometry);

  const measurementFrame = createLineLoop(
    [
      new THREE.Vector3(-radius * 0.42, -radius * 0.18, radius * 0.48),
      new THREE.Vector3(-radius * 0.08, -radius * 0.06, radius * 0.62),
      new THREE.Vector3(radius * 0.18, -radius * 0.16, radius * 0.56),
      new THREE.Vector3(radius * 0.1, -radius * 0.42, radius * 0.4),
      new THREE.Vector3(-radius * 0.26, -radius * 0.38, radius * 0.34),
    ],
    gridColor,
    0.13
  );
  visualGroup.add(measurementFrame);
  materials.push(measurementFrame.material);
  geometries.push(measurementFrame.geometry);

  const sightLine = createLine(
    [
      new THREE.Vector3(-radius * 0.56, radius * 0.06, -radius * 0.22),
      new THREE.Vector3(-radius * 0.08, radius * 0.18, radius * 0.12),
      new THREE.Vector3(radius * 0.36, radius * 0.32, radius * 0.4),
    ],
    pointColor,
    0.16
  );
  visualGroup.add(sightLine);
  materials.push(sightLine.material);
  geometries.push(sightLine.geometry);

  [
    { lat: 28, lon: -12 },
    { lat: 12, lon: 34 },
    { lat: -8, lon: 56 },
    { lat: -22, lon: -18 },
    { lat: -34, lon: 22 },
  ].forEach((node) => {
    addRenderable(
      visualGroup,
      createSurfaceNode(radius, node.lat, node.lon, config.radius * 0.034, "#fff2dd", {
        elevation: 1.035,
        opacity: 0.82,
        emissive: "#ffd9aa",
        emissiveIntensity: 0.22,
      }),
      materials,
      geometries
    );
  });

  [
    [{ lat: 26, lon: -10 }, { lat: 18, lon: 10 }, { lat: 8, lon: 30 }],
    [{ lat: -6, lon: 54 }, { lat: -14, lon: 32 }, { lat: -24, lon: 4 }],
  ].forEach((path) => {
    addRenderable(
      visualGroup,
      createSurfaceArc(radius, path, "#f4d2a8", 0.17, 1.05),
      materials,
      geometries
    );
  });

  return { visualGroup, materials, geometries };
}

function createGISVisuals(config) {
  const visualGroup = new THREE.Group();
  const materials = [];
  const geometries = [];
  const lineColor = new THREE.Color("#3d8d60");
  const pointColor = new THREE.Color("#9cddb2");
  const contourColor = new THREE.Color("#62b97a");
  const radius = config.radius * 1.015;

  [
    { lat: 36, lon: -18, size: radius * 0.24, scaleX: 1.45, scaleY: 0.84, rotate: 0.34 },
    { lat: 10, lon: 24, size: radius * 0.28, scaleX: 1.36, scaleY: 0.9, rotate: -0.18 },
    { lat: -12, lon: 58, size: radius * 0.2, scaleX: 1.18, scaleY: 0.76, rotate: 0.12 },
    { lat: -34, lon: -12, size: radius * 0.18, scaleX: 1.12, scaleY: 0.7, rotate: -0.52 },
  ].forEach((patch) => {
    addRenderable(
      visualGroup,
      createSurfaceDisc(radius, patch.lat, patch.lon, patch.size, "#7fd08a", {
        elevation: 1.008,
        opacity: 0.74,
        scaleX: patch.scaleX,
        scaleY: patch.scaleY,
        rotate: patch.rotate,
        roughness: 0.72,
        metalness: 0.02,
      }),
      materials,
      geometries
    );
    addRenderable(
      visualGroup,
      createSurfaceDisc(radius, patch.lat + 3, patch.lon - 5, patch.size * 0.7, "#cde79a", {
        elevation: 1.012,
        opacity: 0.32,
        scaleX: patch.scaleX * 0.9,
        scaleY: patch.scaleY * 0.76,
        rotate: patch.rotate + 0.24,
        roughness: 0.76,
        metalness: 0.02,
      }),
      materials,
      geometries
    );
  });

  const contourOffsets = [-0.3, -0.16, -0.02, 0.12, 0.26];
  contourOffsets.forEach((offset, contourIndex) => {
    const points = [];
    const contourRadius = radius * (0.46 + contourIndex * 0.1);
    for (let i = 0; i <= 88; i += 1) {
      const theta = (i / 88) * Math.PI * 2;
      const x = Math.cos(theta) * contourRadius * (1 + Math.sin(theta * 3 + contourIndex) * 0.055);
      const y = offset + Math.sin(theta * 2.2 + contourIndex * 0.8) * 0.036;
      const z = Math.sin(theta) * contourRadius * (1 + Math.cos(theta * 2.5 + contourIndex * 0.2) * 0.05);
      points.push(new THREE.Vector3(x, y, z));
    }
    const contour = createLineLoop(points, contourIndex % 2 === 0 ? contourColor : lineColor, 0.14);
    contour.rotation.x = 0.48;
    contour.rotation.y = -0.34;
    visualGroup.add(contour);
    materials.push(contour.material);
    geometries.push(contour.geometry);
  });

  const polygonLoops = [
    [
      new THREE.Vector3(-radius * 0.22, radius * 0.34, radius * 0.52),
      new THREE.Vector3(radius * 0.04, radius * 0.4, radius * 0.56),
      new THREE.Vector3(radius * 0.2, radius * 0.24, radius * 0.44),
      new THREE.Vector3(radius * 0.08, radius * 0.1, radius * 0.48),
      new THREE.Vector3(-radius * 0.16, radius * 0.16, radius * 0.56),
    ],
    [
      new THREE.Vector3(-radius * 0.48, -radius * 0.02, -radius * 0.32),
      new THREE.Vector3(-radius * 0.22, radius * 0.08, -radius * 0.48),
      new THREE.Vector3(0, -radius * 0.04, -radius * 0.44),
      new THREE.Vector3(-radius * 0.08, -radius * 0.26, -radius * 0.26),
      new THREE.Vector3(-radius * 0.34, -radius * 0.22, -radius * 0.18),
    ],
  ];
  polygonLoops.forEach((loopPoints) => {
    const polygon = createLineLoop(loopPoints, lineColor, 0.16);
    visualGroup.add(polygon);
    materials.push(polygon.material);
    geometries.push(polygon.geometry);
  });

  const terrainPatch = createLineLoop(
    [
      new THREE.Vector3(radius * 0.14, radius * 0.14, radius * 0.58),
      new THREE.Vector3(radius * 0.34, radius * 0.22, radius * 0.5),
      new THREE.Vector3(radius * 0.42, radius * 0.04, radius * 0.44),
      new THREE.Vector3(radius * 0.28, -radius * 0.1, radius * 0.54),
      new THREE.Vector3(radius * 0.1, -radius * 0.04, radius * 0.6),
    ],
    contourColor,
    0.15
  );
  visualGroup.add(terrainPatch);
  materials.push(terrainPatch.material);
  geometries.push(terrainPatch.geometry);

  const gridPointsA = [];
  const gridPointsB = [];
  for (let i = -3; i <= 3; i += 1) {
    gridPointsA.push(new THREE.Vector3(-radius * 0.46, i * radius * 0.1, radius * 0.58));
    gridPointsA.push(new THREE.Vector3(radius * 0.46, i * radius * 0.1, radius * 0.58));
    gridPointsB.push(new THREE.Vector3(i * radius * 0.1, -radius * 0.46, radius * 0.58));
    gridPointsB.push(new THREE.Vector3(i * radius * 0.1, radius * 0.46, radius * 0.58));
  }
  for (let i = 0; i < gridPointsA.length; i += 2) {
    const line = createLine([gridPointsA[i], gridPointsA[i + 1]], contourColor, 0.08);
    visualGroup.add(line);
    materials.push(line.material);
    geometries.push(line.geometry);
  }
  for (let i = 0; i < gridPointsB.length; i += 2) {
    const line = createLine([gridPointsB[i], gridPointsB[i + 1]], lineColor, 0.08);
    visualGroup.add(line);
    materials.push(line.material);
    geometries.push(line.geometry);
  }

  const pointPositions = new Float32Array([
    -radius * 0.16, radius * 0.12, radius * 0.62,
    radius * 0.08, radius * 0.22, radius * 0.56,
    radius * 0.28, -radius * 0.04, radius * 0.58,
    -radius * 0.24, -radius * 0.18, radius * 0.54,
    radius * 0.04, -radius * 0.28, radius * 0.6,
  ]);
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
  const pointsMaterial = new THREE.PointsMaterial({
    color: pointColor,
    size: config.radius * 0.05,
    transparent: true,
    opacity: 0.34,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  visualGroup.add(points);
  materials.push(pointsMaterial);
  geometries.push(pointsGeometry);

  const meridian = createLineLoop(
    Array.from({ length: 73 }, (_, i) => {
      const theta = (i / 72) * Math.PI * 2;
      return new THREE.Vector3(
        0,
        Math.cos(theta) * radius * 0.84,
        Math.sin(theta) * radius * 0.84
      );
    }),
    lineColor,
    0.08
  );
  meridian.rotation.y = Math.PI / 6;
  visualGroup.add(meridian);
  materials.push(meridian.material);
  geometries.push(meridian.geometry);

  [
    { lat: 32, lon: -14 },
    { lat: 22, lon: 8 },
    { lat: 12, lon: 34 },
    { lat: -8, lon: 52 },
    { lat: -24, lon: 18 },
    { lat: -16, lon: -24 },
  ].forEach((node) => {
    addRenderable(
      visualGroup,
      createSurfaceNode(radius, node.lat, node.lon, config.radius * 0.026, "#f4d98f", {
        elevation: 1.04,
        opacity: 0.9,
        emissive: "#f4d98f",
        emissiveIntensity: 0.18,
      }),
      materials,
      geometries
    );
  });

  [
    [{ lat: 30, lon: -14 }, { lat: 26, lon: 0 }, { lat: 18, lon: 24 }, { lat: 6, lon: 48 }],
    [{ lat: -14, lon: -20 }, { lat: -8, lon: 10 }, { lat: -18, lon: 32 }],
  ].forEach((path) => {
    addRenderable(
      visualGroup,
      createSurfaceArc(radius, path, "#eed59b", 0.14, 1.044),
      materials,
      geometries
    );
  });

  return { visualGroup, materials, geometries };
}

function createITVisuals(config) {
  const visualGroup = new THREE.Group();
  const materials = [];
  const geometries = [];
  const lineColor = new THREE.Color("#5d9bd8");
  const nodeColor = new THREE.Color("#9bc7f1");
  const meshColor = new THREE.Color("#3e76b7");
  const radius = config.radius * 1.02;

  [
    { lat: 28, lon: -12, size: radius * 0.22, scaleX: 1.24, scaleY: 0.82, rotate: 0.24 },
    { lat: 6, lon: 28, size: radius * 0.2, scaleX: 1.14, scaleY: 0.72, rotate: -0.34 },
    { lat: -16, lon: 54, size: radius * 0.18, scaleX: 1.08, scaleY: 0.68, rotate: 0.42 },
    { lat: -26, lon: -10, size: radius * 0.16, scaleX: 1.16, scaleY: 0.64, rotate: -0.14 },
  ].forEach((plate) => {
    addRenderable(
      visualGroup,
      createSurfaceDisc(radius, plate.lat, plate.lon, plate.size, "#8cc8ec", {
        elevation: 1.01,
        opacity: 0.34,
        scaleX: plate.scaleX,
        scaleY: plate.scaleY,
        rotate: plate.rotate,
        roughness: 0.36,
        metalness: 0.08,
        emissive: "#69b9e1",
        emissiveIntensity: 0.08,
      }),
      materials,
      geometries
    );
  });

  const nodePositions = [
    new THREE.Vector3(radius * 0.34, radius * 0.3, radius * 0.52),
    new THREE.Vector3(radius * 0.06, radius * 0.46, radius * 0.58),
    new THREE.Vector3(-radius * 0.22, radius * 0.26, radius * 0.54),
    new THREE.Vector3(-radius * 0.32, -radius * 0.02, radius * 0.46),
    new THREE.Vector3(-radius * 0.06, -radius * 0.28, radius * 0.62),
    new THREE.Vector3(radius * 0.24, -radius * 0.18, radius * 0.52),
  ];

  const links = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 5], [2, 4],
  ];
  links.forEach(([a, b]) => {
    const line = createLine([nodePositions[a], nodePositions[b]], lineColor, 0.17);
    visualGroup.add(line);
    materials.push(line.material);
    geometries.push(line.geometry);
  });

  const nodeGeometry = new THREE.SphereGeometry(config.radius * 0.04, 10, 10);
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: nodeColor,
    transparent: true,
    opacity: 0.34,
  });
  nodePositions.forEach((position) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(position);
    visualGroup.add(node);
  });
  materials.push(nodeMaterial);
  geometries.push(nodeGeometry);

  const meshLines = [
    [
      new THREE.Vector3(radius * 0.48, radius * 0.16, -radius * 0.18),
      new THREE.Vector3(radius * 0.22, radius * 0.38, -radius * 0.32),
      new THREE.Vector3(-radius * 0.06, radius * 0.3, -radius * 0.28),
      new THREE.Vector3(radius * 0.12, radius * 0.04, -radius * 0.14),
    ],
    [
      new THREE.Vector3(-radius * 0.42, -radius * 0.04, -radius * 0.18),
      new THREE.Vector3(-radius * 0.24, -radius * 0.28, -radius * 0.36),
      new THREE.Vector3(radius * 0.04, -radius * 0.22, -radius * 0.3),
      new THREE.Vector3(-radius * 0.12, radius * 0.02, -radius * 0.12),
    ],
  ];
  meshLines.forEach((points) => {
    const loop = createLineLoop(points, meshColor, 0.13);
    visualGroup.add(loop);
    materials.push(loop.material);
    geometries.push(loop.geometry);
  });

  const dataPaths = [
    [
      new THREE.Vector3(-radius * 0.46, radius * 0.24, -radius * 0.08),
      new THREE.Vector3(-radius * 0.18, radius * 0.16, radius * 0.1),
      new THREE.Vector3(radius * 0.08, radius * 0.28, radius * 0.26),
      new THREE.Vector3(radius * 0.34, radius * 0.14, radius * 0.14),
    ],
    [
      new THREE.Vector3(-radius * 0.34, -radius * 0.24, radius * 0.16),
      new THREE.Vector3(-radius * 0.06, -radius * 0.1, radius * 0.34),
      new THREE.Vector3(radius * 0.18, -radius * 0.22, radius * 0.18),
      new THREE.Vector3(radius * 0.42, -radius * 0.08, -radius * 0.04),
    ],
  ];
  dataPaths.forEach((pathPoints, index) => {
    const path = createLine(pathPoints, index === 0 ? lineColor : meshColor, 0.14);
    visualGroup.add(path);
    materials.push(path.material);
    geometries.push(path.geometry);
  });

  const bandPoints = [];
  for (let i = 0; i <= 56; i += 1) {
    const theta = (i / 56) * Math.PI * 2;
    bandPoints.push(
      new THREE.Vector3(
        Math.cos(theta) * radius * 0.78,
        Math.sin(theta * 2.1) * radius * 0.1,
        Math.sin(theta) * radius * 0.78
      )
    );
  }
  const band = createLineLoop(bandPoints, meshColor, 0.1);
  band.rotation.x = 0.8;
  band.rotation.y = 0.28;
  visualGroup.add(band);
  materials.push(band.material);
  geometries.push(band.geometry);

  const equatorBand = createLineLoop(
    Array.from({ length: 65 }, (_, i) => {
      const theta = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(
        Math.cos(theta) * radius * 0.84,
        Math.sin(theta * 3) * radius * 0.04,
        Math.sin(theta) * radius * 0.84
      );
    }),
    lineColor,
    0.08
  );
  equatorBand.rotation.x = 0.24;
  equatorBand.rotation.z = -0.18;
  visualGroup.add(equatorBand);
  materials.push(equatorBand.material);
  geometries.push(equatorBand.geometry);

  [
    { lat: 30, lon: -16 },
    { lat: 22, lon: 8 },
    { lat: 10, lon: 34 },
    { lat: -2, lon: 50 },
    { lat: -18, lon: 16 },
    { lat: -24, lon: -18 },
  ].forEach((node) => {
    addRenderable(
      visualGroup,
      createSurfaceNode(radius, node.lat, node.lon, config.radius * 0.024, "#ffffff", {
        elevation: 1.05,
        opacity: 0.92,
        emissive: "#c8ebff",
        emissiveIntensity: 0.24,
      }),
      materials,
      geometries
    );
  });

  [
    [{ lat: 28, lon: -12 }, { lat: 22, lon: 8 }, { lat: 10, lon: 34 }, { lat: -2, lon: 50 }],
    [{ lat: -20, lon: -18 }, { lat: -8, lon: 4 }, { lat: -12, lon: 26 }, { lat: -22, lon: 42 }],
  ].forEach((path) => {
    addRenderable(
      visualGroup,
      createSurfaceArc(radius, path, "#d5efff", 0.17, 1.052),
      materials,
      geometries
    );
  });

  return { visualGroup, materials, geometries };
}

function createPlanetVisuals(config) {
  if (config.id === "survey") {
    return createSurveyVisuals(config);
  }
  if (config.id === "gis") {
    return createGISVisuals(config);
  }
  return createITVisuals(config);
}

function createConnectionLine(color) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  return {
    line: new THREE.Line(geometry, material),
    geometry,
    material,
  };
}

function createSatellite(color, satelliteConfig, index) {
  const group = new THREE.Group();
  const pivot = new THREE.Group();
  const anchor = new THREE.Group();
  group.add(pivot);
  pivot.add(anchor);
  anchor.position.set(satelliteConfig.orbitRadius, 0, 0);

  const bodyMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.08,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.04,
    depthWrite: false,
  });

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(satelliteConfig.scale, 18, 18),
    bodyMaterial
  );
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(satelliteConfig.scale * 1.8, 18, 18),
    glowMaterial
  );

  anchor.add(body);
  anchor.add(glow);

  const label = createLabelSprite(satelliteConfig.label, color, {
    width: 320,
    height: 80,
    font: "600 24px Space Grotesk, Arial, sans-serif",
    scale: { x: 0.95, y: 0.24, z: 1 },
  });
  if (label) {
    label.position.set(0, satelliteConfig.scale * 2.6, 0);
    anchor.add(label);
  }

  const orbitPath = createOrbitPath(satelliteConfig.orbitRadius, color);
  orbitPath.rotation.x = Math.PI / 2;
  group.add(orbitPath);

  group.rotation.x = satelliteConfig.orbitTiltX;
  group.rotation.z = satelliteConfig.orbitTiltZ;
  pivot.rotation.y = satelliteConfig.phase;

  return {
    group,
    pivot,
    body,
    glow,
    label,
    orbitPath,
    speed: satelliteConfig.speed,
    revealCurrent: 0,
    revealTarget: 0,
    materials: [bodyMaterial, glowMaterial, orbitPath.material],
    geometry: [body.geometry, glow.geometry, orbitPath.geometry],
    index,
  };
}

function createPlanet(config, sharedSphereGeometry, sharedRingGeometry, options = {}) {
  const group = new THREE.Group();
  const planetShell = new THREE.Group();
  const satelliteLayer = new THREE.Group();
  const disciplineLayer = new THREE.Group();
  const isGIS = config.id === "gis";
  const gisOverlayScale = 1.007;

  const coreColor =
    config.id === "gis" ? "#1c5a43" : config.id === "it" ? "#1f5f84" : "#b46d3d";
  const shellHighlight =
    config.id === "gis" ? "#7fd08a" : config.id === "it" ? "#9ed8f0" : "#f0c78f";

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: coreColor,
    roughness: 0.86,
    metalness: 0.02,
    transparent: true,
    opacity: 0.96,
  });

  const surfaceMaterial = new THREE.MeshPhysicalMaterial({
    color: isGIS ? "#247A57" : config.color,
    roughness: isGIS ? 0.56 : 0.44,
    metalness: isGIS ? 0.02 : 0.04,
    clearcoat: isGIS ? 0.14 : 0.56,
    clearcoatRoughness: isGIS ? 0.62 : 0.48,
    transparent: true,
    opacity: 0.88,
    transmission: isGIS ? 0 : 0.04,
    thickness: isGIS ? 0.2 : 0.6,
  });

  const gisOverlayMaterial = isGIS
    ? new THREE.MeshBasicMaterial({
        map: options.gisTexture ?? null,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      })
    : null;

  const sheenMaterial = new THREE.MeshPhysicalMaterial({
    color: shellHighlight,
    roughness: 0.26,
    metalness: 0.02,
    transparent: true,
    opacity: 0.08,
    transmission: 0.18,
    thickness: 0.4,
    depthWrite: false,
  });

  const haloMaterial = new THREE.MeshBasicMaterial({
    color: config.glow,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });

  const accentMaterial = new THREE.MeshBasicMaterial({
    color: config.color,
    transparent: true,
    opacity: 0.1,
  });

  const core = new THREE.Mesh(sharedSphereGeometry, coreMaterial);
  core.scale.setScalar(config.radius * 0.94);
  planetShell.add(core);

  const planet = new THREE.Mesh(sharedSphereGeometry, surfaceMaterial);
  planet.scale.setScalar(config.radius);
  planetShell.add(planet);

  const gisOverlay = isGIS && gisOverlayMaterial
    ? new THREE.Mesh(sharedSphereGeometry, gisOverlayMaterial)
    : null;
  if (gisOverlay) {
    gisOverlay.scale.setScalar(config.radius * gisOverlayScale);
    planetShell.add(gisOverlay);
  }

  const sheenShell = new THREE.Mesh(sharedSphereGeometry, sheenMaterial);
  sheenShell.scale.setScalar(config.radius * 1.018);
  planetShell.add(sheenShell);

  const halo = new THREE.Mesh(sharedSphereGeometry, haloMaterial);
  halo.scale.setScalar(config.radius * 1.12);
  planetShell.add(halo);

  const accentRing = new THREE.Mesh(sharedRingGeometry, accentMaterial);
  accentRing.scale.setScalar(config.radius * 1.2);
  accentRing.rotation.set(
    config.accentTilt.x,
    config.accentTilt.y,
    config.accentTilt.z
  );
  planetShell.add(accentRing);

  const planetVisuals = createPlanetVisuals(config);
  disciplineLayer.add(planetVisuals.visualGroup);
  planetShell.add(disciplineLayer);

  const label = createLabelSprite(config.label, config.color);
  if (label) {
    label.position.set(0, config.radius * 1.55, 0);
    group.add(label);
  }

  const satellites = (config.satellites || []).map((satelliteConfig, index) => {
    const satellite = createSatellite(config.color, satelliteConfig, index);
    satelliteLayer.add(satellite.group);
    return satellite;
  });

  group.add(planetShell);
  group.add(satelliteLayer);

  return {
    group,
    planetShell,
    core,
    planet,
    gisOverlay,
    sheenShell,
    halo,
    accentRing,
    label,
    satelliteLayer,
    satellites,
    disciplineLayer,
    disciplineMaterials: planetVisuals.materials,
    disciplineGeometries: planetVisuals.geometries,
    materials: [
      coreMaterial,
      surfaceMaterial,
      ...(gisOverlayMaterial ? [gisOverlayMaterial] : []),
      sheenMaterial,
      haloMaterial,
      accentMaterial,
    ],
  };
}

export function mountCareerUniverseScene(options = {}) {
  const {
    staticMode = false,
    compactMode = false,
  } = options;
  const container = document.querySelector("#career-universe-canvas");
  if (!container || container.dataset.mounted === "true") {
    return null;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !compactMode,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactMode ? 1.25 : 1.8));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  container.dataset.mounted = "true";

  const universeGroup = new THREE.Group();
  universeGroup.position.set(0, 0.18, 0);
  scene.add(universeGroup);

  const sphereGeometry = new THREE.SphereGeometry(1, 42, 42);
  const ringGeometry = new THREE.TorusGeometry(1, 0.022, 12, 96);
  const gisTexture = createGISTexture();

  const planetNodes = careerUniversePlanets.map((planetConfig) => {
    const node = createPlanet(planetConfig, sphereGeometry, ringGeometry, {
      gisTexture,
    });
    node.group.position.set(
      planetConfig.basePosition.x,
      planetConfig.basePosition.y,
      planetConfig.basePosition.z
    );
    universeGroup.add(node.group);
    return {
      ...node,
      config: planetConfig,
      emphasisCurrent: 0.8,
      emphasisTarget: 0.8,
      scaleCurrent: 1,
      scaleTarget: 1,
      satelliteRevealCurrent: 0,
      satelliteRevealTarget: 0,
    };
  });

  const connectionColor = new THREE.Color("#99b7a8");
  const connectionDefs = [
    { from: "survey", to: "gis", lineSet: createConnectionLine(connectionColor) },
    { from: "gis", to: "it", lineSet: createConnectionLine(connectionColor) },
  ];
  connectionDefs.forEach(({ lineSet }) => universeGroup.add(lineSet.line));

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  const hemisphereLight = new THREE.HemisphereLight(0xfcfffe, 0xe9ece1, 1.18);
  const keyLight = new THREE.DirectionalLight(0xfffcf6, 1.32);
  keyLight.position.set(3.5, 5.5, 6.5);
  const fillLight = new THREE.DirectionalLight(0xeef8ff, 0.56);
  fillLight.position.set(-4.2, -1.2, 5);
  const rimLight = new THREE.DirectionalLight(0xfff4de, 0.36);
  rimLight.position.set(-2.4, 2.2, -4.6);
  scene.add(ambientLight, hemisphereLight, keyLight, fillLight, rimLight);

  const currentCameraPosition = new THREE.Vector3();
  const targetCameraPosition = new THREE.Vector3(0.06, 0.18, 8.55);
  const currentLookAt = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3(0, 0.02, -0.06);
  let frameId = 0;
  let resizeRafId = 0;
  let layoutWidth = width;
  let layoutHeight = height;
  let latestView = {
    camera: { x: 0.06, y: 0.18, z: 8.55 },
    target: { x: 0, y: 0.02, z: -0.06 },
    emphasis: { survey: 0.82, gis: 0.96, it: 0.88 },
    satellites: { survey: 0, gis: 0, it: 0 },
    integration: 0,
  };

  function setStoryView(view) {
    if (!view) {
      return;
    }

    latestView = view;
    const { scale, cameraZ } = resolveLayout(container.clientWidth, container.clientHeight);
    universeGroup.scale.setScalar(scale);

    targetCameraPosition.set(
      view.camera.x,
      view.camera.y,
      view.camera.z + (cameraZ - 8.25)
    );
    targetLookAt.set(view.target.x, view.target.y, view.target.z);

    planetNodes.forEach((node) => {
      const emphasis = view.emphasis[node.config.id] ?? 0.7;
      node.emphasisTarget = emphasis;
      node.scaleTarget = 0.9 + emphasis * 0.16;
      const nextReveal = view.satellites?.[node.config.id] ?? 0;
      node.satelliteRevealTarget = compactMode ? Math.min(nextReveal, 0.22) : nextReveal;
    });
    connectionDefs.forEach(({ lineSet }) => {
      lineSet.material.opacity = (view.integration ?? 0) * 0.2;
    });
    if (staticMode) {
      renderScene();
    }
  }

  function applyLayout() {
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight;
    if (!nextWidth || !nextHeight) {
      return;
    }
    if (Math.abs(nextWidth - layoutWidth) < 1 && Math.abs(nextHeight - layoutHeight) < 1) {
      return;
    }
    layoutWidth = nextWidth;
    layoutHeight = nextHeight;
    const { scale } = resolveLayout(nextWidth, nextHeight);

    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight, false);

    universeGroup.scale.setScalar(scale);
    setStoryView(latestView);
    if (staticMode) {
      renderScene();
    }
  }

  applyLayout();
  currentCameraPosition.copy(targetCameraPosition);
  currentLookAt.copy(targetLookAt);
  camera.position.copy(currentCameraPosition);
  camera.lookAt(currentLookAt);

  const clock = new THREE.Clock();
  const nodeById = Object.fromEntries(planetNodes.map((node) => [node.config.id, node]));
  let isActive = true;
  let isAnimating = false;

  function renderScene() {
    renderer.render(scene, camera);
  }

  function animate() {
    if (!isAnimating) {
      return;
    }
    if (!staticMode) {
      frameId = window.requestAnimationFrame(animate);
    }
    const elapsed = clock.getElapsedTime();

    if (!staticMode) {
      universeGroup.rotation.z = Math.sin(elapsed * 0.12) * 0.015;
    }

    currentCameraPosition.lerp(targetCameraPosition, 0.07);
    currentLookAt.lerp(targetLookAt, 0.08);
    camera.position.copy(currentCameraPosition);
    camera.lookAt(currentLookAt);

    planetNodes.forEach((node, index) => {
      const {
        config,
        group,
        core,
        planet,
        gisOverlay,
        sheenShell,
        halo,
        accentRing,
        label,
        satellites,
        disciplineLayer,
      } = node;
      group.position.y =
        config.basePosition.y + Math.sin(elapsed * 0.5 + config.floatOffset) * 0.07;
      group.position.x =
        config.basePosition.x + Math.cos(elapsed * 0.32 + index) * 0.04;

      if (!staticMode) {
        core.rotation.y += config.rotationSpeed * 0.42;
        planet.rotation.y += config.rotationSpeed;
        planet.rotation.x += config.rotationSpeed * 0.35;
        sheenShell.rotation.y -= config.rotationSpeed * 0.28;
        sheenShell.rotation.x = Math.sin(elapsed * 0.22 + index) * 0.03;
        halo.rotation.y -= config.rotationSpeed * 0.2;
        accentRing.rotation.z += config.rotationSpeed * 0.65;
        disciplineLayer.rotation.y += config.rotationSpeed * 0.82;
        disciplineLayer.rotation.x = Math.sin(elapsed * 0.18 + index) * 0.05;
      }

      node.emphasisCurrent += (node.emphasisTarget - node.emphasisCurrent) * 0.1;
      node.scaleCurrent += (node.scaleTarget - node.scaleCurrent) * 0.08;
      node.satelliteRevealCurrent +=
        (node.satelliteRevealTarget - node.satelliteRevealCurrent) * 0.08;

      group.scale.setScalar(node.scaleCurrent);
      core.material.opacity = 0.72 + node.emphasisCurrent * 0.22;
      planet.material.opacity = 0.54 + node.emphasisCurrent * 0.38;
      if (gisOverlay?.material) {
        gisOverlay.material.opacity = 0.08 + node.emphasisCurrent * 0.12;
      }
      sheenShell.material.opacity = 0.04 + node.emphasisCurrent * 0.12;
      halo.material.opacity = 0.04 + node.emphasisCurrent * 0.18;
      accentRing.material.opacity = 0.02 + node.emphasisCurrent * 0.12;
      node.disciplineMaterials.forEach((material) => {
        material.opacity = 0.03 + node.emphasisCurrent * 0.16;
      });

      if (label?.material) {
        label.material.opacity = 0.38 + node.emphasisCurrent * 0.62;
        label.lookAt(camera.position);
      }

      satellites.forEach((satellite, satelliteIndex) => {
        const stagger = Math.max(node.satelliteRevealCurrent * 1.28 - satelliteIndex * 0.12, 0);
        const reveal = Math.min(stagger, 1) * node.emphasisCurrent;

        satellite.revealCurrent += (reveal - satellite.revealCurrent) * 0.1;
        if (!staticMode) {
          satellite.pivot.rotation.y += compactMode ? satellite.speed * 0.45 : satellite.speed;
        }

        const scale = 0.1 + satellite.revealCurrent * 0.9;
        satellite.anchorScale = scale;
        satellite.group.scale.setScalar(scale);
        satellite.group.visible = satellite.revealCurrent > 0.015;
        satellite.body.material.opacity = satellite.revealCurrent * 0.92;
        satellite.glow.material.opacity = satellite.revealCurrent * 0.18;
        satellite.orbitPath.material.opacity = satellite.revealCurrent * 0.1;

        if (satellite.label?.material) {
          satellite.label.visible = !compactMode && satellite.revealCurrent > 0.16;
          satellite.label.material.opacity = Math.max(0, satellite.revealCurrent - 0.16) * 1.18;
          satellite.label.lookAt(camera.position);
        }
      });
    });

    connectionDefs.forEach(({ from, to, lineSet }) => {
      const startNode = nodeById[from];
      const endNode = nodeById[to];
      if (!startNode || !endNode) {
        return;
      }

      const positions = lineSet.geometry.attributes.position.array;
      positions[0] = startNode.group.position.x;
      positions[1] = startNode.group.position.y;
      positions[2] = startNode.group.position.z;
      positions[3] = endNode.group.position.x;
      positions[4] = endNode.group.position.y;
      positions[5] = endNode.group.position.z;
      lineSet.geometry.attributes.position.needsUpdate = true;
      lineSet.material.opacity += (((latestView.integration ?? 0) * 0.18) - lineSet.material.opacity) * 0.08;
    });

    renderScene();
  }

  function startAnimation() {
    if (staticMode || isAnimating || !isActive) {
      return;
    }
    isAnimating = true;
    clock.start();
    animate();
  }

  function stopAnimation() {
    if (!isAnimating) {
      return;
    }
    isAnimating = false;
    window.cancelAnimationFrame(frameId);
    clock.stop();
  }

  if (staticMode) {
    renderScene();
  } else {
    startAnimation();
  }

  function requestLayout() {
    if (resizeRafId) {
      return;
    }
    resizeRafId = window.requestAnimationFrame(() => {
      resizeRafId = 0;
      applyLayout();
    });
  }

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => requestLayout())
      : null;
  resizeObserver?.observe(container);
  window.addEventListener("resize", requestLayout);

  return {
    setStoryView,
    setActive(active) {
      isActive = active;
      if (staticMode) {
        renderScene();
        return;
      }
      if (isActive) {
        startAnimation();
      } else {
        stopAnimation();
      }
    },
    cleanup() {
      stopAnimation();
      window.cancelAnimationFrame(resizeRafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", requestLayout);

      planetNodes.forEach((node) => {
        node.materials.forEach((material) => material.dispose());
        node.disciplineMaterials.forEach((material) => material.dispose());
        node.disciplineGeometries.forEach((geometry) => geometry.dispose());
        node.label?.material?.map?.dispose?.();
        node.label?.material?.dispose?.();

        node.satellites.forEach((satellite) => {
          satellite.materials.forEach((material) => material.dispose());
          satellite.geometry.forEach((geometry) => geometry.dispose());
          satellite.label?.material?.map?.dispose?.();
          satellite.label?.material?.dispose?.();
        });
      });

      connectionDefs.forEach(({ lineSet }) => {
        lineSet.material.dispose();
        lineSet.geometry.dispose();
      });

      sphereGeometry.dispose();
      ringGeometry.dispose();
      gisTexture?.dispose?.();
      renderer.dispose();
      container.dataset.mounted = "false";
      container.innerHTML = "";
    },
  };
}
