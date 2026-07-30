import * as THREE from "three";

function drawContourRegion(context, region) {
  const {
    centerX,
    centerY,
    radiusX,
    radiusY,
    levels,
    step,
    angleOffset = 0,
    strokeStyle,
    lineWidth = 1,
    pointCount = 220,
    waveFrequencies = [3, 5, 7],
    waveAmplitudes = [0.085, 0.045, 0.025],
    wavePhase = 1,
  } = region;

  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;

  for (let level = 0; level < levels; level += 1) {
    const scale = 1 - level * step;
    if (scale <= 0) {
      break;
    }

    context.beginPath();

    for (let pointIndex = 0; pointIndex <= pointCount; pointIndex += 1) {
      const t = (pointIndex / pointCount) * Math.PI * 2;
      const waveA =
        Math.sin(t * waveFrequencies[0] + angleOffset + level * 0.35 * wavePhase) *
        waveAmplitudes[0];
      const waveB =
        Math.cos(t * waveFrequencies[1] - angleOffset * 0.6 + level * 0.22 * wavePhase) *
        waveAmplitudes[1];
      const waveC =
        Math.sin(t * waveFrequencies[2] + angleOffset * 1.2 - level * 0.18 * wavePhase) *
        waveAmplitudes[2];
      const irregularity = 1 + waveA + waveB + waveC;
      const x = centerX + Math.cos(t) * radiusX * scale * irregularity;
      const y = centerY + Math.sin(t) * radiusY * scale * irregularity;

      if (pointIndex === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }

    context.stroke();
  }
}

function drawSpatialPoints(context, options = {}) {
  const {
    width,
    height,
    count = 64,
    columns = 8,
    seamMargin = width * 0.08,
    topMargin = height * 0.08,
    bottomMargin = height * 0.08,
    pointColor = "rgba(233, 243, 221, 0.34)",
  } = options;

  const rows = Math.ceil(count / columns);
  const usableWidth = width - seamMargin * 2;
  const usableHeight = height - topMargin - bottomMargin;

  context.fillStyle = pointColor;

  for (let index = 0; index < count; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const baseX = seamMargin + ((column + 0.5) / columns) * usableWidth;
    const baseY = topMargin + ((row + 0.5) / rows) * usableHeight;

    const offsetX =
      Math.sin(index * 1.73 + row * 0.61) * (usableWidth / columns) * 0.16 +
      Math.cos(index * 0.49 + column * 0.85) * (usableWidth / columns) * 0.08;
    const offsetY =
      Math.cos(index * 1.21 + column * 0.44) * (usableHeight / rows) * 0.18 +
      Math.sin(index * 0.67 + row * 0.92) * (usableHeight / rows) * 0.07;

    const x = Math.min(width - seamMargin, Math.max(seamMargin, baseX + offsetX));
    const y = Math.min(height - bottomMargin, Math.max(topMargin, baseY + offsetY));
    const radius = 1 + ((Math.sin(index * 2.17) + 1) * 0.5) * 1.1;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

function drawTopologyPolygons(context, options = {}) {
  const {
    polygons = [],
    strokeStyle = "rgba(214, 235, 220, 0.14)",
    lineWidth = 0.8,
  } = options;

  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineJoin = "round";
  context.lineCap = "round";

  polygons.forEach((polygon) => {
    if (!polygon.length) {
      return;
    }

    context.beginPath();
    polygon.forEach(([x, y], index) => {
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.closePath();
    context.stroke();
  });
}

export function createGISTexture() {
  const canvas = document.createElement("canvas");

  canvas.width = 1024;
  canvas.height = 512;
  const seamMargin = canvas.width * 0.08;

  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawTopologyPolygons(context, {
    strokeStyle: "rgba(214, 235, 220, 0.13)",
    lineWidth: 0.75,
    polygons: [
      [
        [canvas.width * 0.21, canvas.height * 0.2],
        [canvas.width * 0.27, canvas.height * 0.16],
        [canvas.width * 0.33, canvas.height * 0.19],
        [canvas.width * 0.35, canvas.height * 0.27],
        [canvas.width * 0.3, canvas.height * 0.32],
        [canvas.width * 0.23, canvas.height * 0.29],
      ],
      [
        [canvas.width * 0.53, canvas.height * 0.14],
        [canvas.width * 0.61, canvas.height * 0.12],
        [canvas.width * 0.69, canvas.height * 0.17],
        [canvas.width * 0.67, canvas.height * 0.25],
        [canvas.width * 0.58, canvas.height * 0.28],
        [canvas.width * 0.5, canvas.height * 0.23],
      ],
      [
        [canvas.width * 0.37, canvas.height * 0.61],
        [canvas.width * 0.43, canvas.height * 0.56],
        [canvas.width * 0.51, canvas.height * 0.58],
        [canvas.width * 0.54, canvas.height * 0.67],
        [canvas.width * 0.49, canvas.height * 0.74],
        [canvas.width * 0.4, canvas.height * 0.73],
        [canvas.width * 0.35, canvas.height * 0.67],
      ],
      [
        [canvas.width * 0.71, canvas.height * 0.49],
        [canvas.width * 0.76, canvas.height * 0.45],
        [canvas.width * 0.8, canvas.height * 0.5],
        [canvas.width * 0.79, canvas.height * 0.59],
        [canvas.width * 0.74, canvas.height * 0.64],
        [canvas.width * 0.69, canvas.height * 0.59],
      ],
    ],
  });

  drawContourRegion(context, {
    centerX: canvas.width * 0.26,
    centerY: canvas.height * 0.36,
    radiusX: canvas.width * 0.12,
    radiusY: canvas.height * 0.18,
    levels: 6,
    step: 0.11,
    angleOffset: 0.35,
    strokeStyle: "rgba(223, 242, 227, 0.22)",
    lineWidth: 0.9,
    waveFrequencies: [3, 5, 8],
    waveAmplitudes: [0.07, 0.038, 0.02],
    wavePhase: 0.95,
  });
  drawContourRegion(context, {
    centerX: canvas.width * 0.58,
    centerY: canvas.height * 0.26,
    radiusX: canvas.width * 0.16,
    radiusY: canvas.height * 0.1,
    levels: 7,
    step: 0.102,
    angleOffset: 1.05,
    strokeStyle: "rgba(212, 239, 220, 0.18)",
    lineWidth: 0.85,
    waveFrequencies: [4, 6, 9],
    waveAmplitudes: [0.062, 0.034, 0.018],
    wavePhase: 1.08,
  });
  drawContourRegion(context, {
    centerX: canvas.width * 0.44,
    centerY: canvas.height * 0.7,
    radiusX: canvas.width * 0.14,
    radiusY: canvas.height * 0.12,
    levels: 5,
    step: 0.12,
    angleOffset: -0.72,
    strokeStyle: "rgba(232, 245, 235, 0.16)",
    lineWidth: 0.8,
    waveFrequencies: [3, 4, 7],
    waveAmplitudes: [0.058, 0.03, 0.016],
    wavePhase: 0.9,
  });
  drawContourRegion(context, {
    centerX: canvas.width * 0.72,
    centerY: canvas.height * 0.62,
    radiusX: canvas.width * 0.08,
    radiusY: canvas.height * 0.16,
    levels: 5,
    step: 0.118,
    angleOffset: 2.1,
    strokeStyle: "rgba(204, 236, 213, 0.17)",
    lineWidth: 0.82,
    waveFrequencies: [5, 7, 9],
    waveAmplitudes: [0.054, 0.028, 0.014],
    wavePhase: 1.12,
  });
  drawSpatialPoints(context, {
    width: canvas.width,
    height: canvas.height,
    count: 64,
    columns: 8,
    seamMargin,
    topMargin: canvas.height * 0.1,
    bottomMargin: canvas.height * 0.1,
    pointColor: "rgba(232, 241, 216, 0.3)",
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
