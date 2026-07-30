function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function mixVector(start, end, t) {
  return {
    x: mix(start.x, end.x, t),
    y: mix(start.y, end.y, t),
    z: mix(start.z, end.z, t),
  };
}

function ramp(progress, start, end) {
  if (progress <= start) {
    return 0;
  }
  if (progress >= end) {
    return 1;
  }
  return smoothstep((progress - start) / (end - start));
}

function plateau(progress, enterStart, enterEnd, exitStart, exitEnd) {
  const fadeIn = ramp(progress, enterStart, enterEnd);
  const fadeOut = 1 - ramp(progress, exitStart, exitEnd);
  return clamp(Math.min(fadeIn, fadeOut));
}

export function getCareerUniverseStoryState(progress) {
  const overviewStart = {
    camera: { x: -0.46, y: 0.18, z: 12.8 },
    target: { x: -0.9, y: -0.7, z: -0.06 },
    emphasis: { survey: 0.82, gis: 0.96, it: 0.88 },
    satellites: { survey: 0, gis: 0, it: 0 },
    activeIndex: 0,
  };
  const surveyFocus = {
    camera: { x: 3.12, y: -0.14, z: 4.78 },
    target: { x: 1.32, y: -0.74, z: -0.56 },
    emphasis: { survey: 1, gis: 0.44, it: 0.3 },
    satellites: { survey: 1, gis: 0, it: 0 },
    activeIndex: 1,
  };
  const gisFocus = {
    camera: { x: -3.84, y: -0.08, z: 5.76 },
    target: { x: -2.52, y: -0.74, z: -0.06 },
    emphasis: { survey: 0.3, gis: 1, it: 0.44 },
    satellites: { survey: 0, gis: 1, it: 0 },
    activeIndex: 2,
  };
  const itFocus = {
    camera: { x: 1.68, y: 1.94, z: 4.94 },
    target: { x: -0.08, y: 1.22, z: 0.34 },
    emphasis: { survey: 0.28, gis: 0.38, it: 1 },
    satellites: { survey: 0, gis: 0, it: 1 },
    activeIndex: 3,
  };
  const overviewEnd = {
    ...overviewStart,
    camera: { ...overviewStart.camera },
    target: { ...overviewStart.target },
    emphasis: { ...overviewStart.emphasis },
    satellites: { ...overviewStart.satellites },
    activeIndex: 4,
  };

  if (progress <= 0.4) {
    return overviewStart;
  }

  if (progress <= 0.58) {
    const t = smoothstep((progress - 0.4) / 0.18);
    return {
      camera: mixVector(overviewStart.camera, surveyFocus.camera, t),
      target: mixVector(overviewStart.target, surveyFocus.target, t),
      emphasis: {
        survey: mix(overviewStart.emphasis.survey, surveyFocus.emphasis.survey, t),
        gis: mix(overviewStart.emphasis.gis, surveyFocus.emphasis.gis, t),
        it: mix(overviewStart.emphasis.it, surveyFocus.emphasis.it, t),
      },
      satellites: {
        survey: ramp(progress, 0.48, 0.58),
        gis: 0,
        it: 0,
      },
      activeIndex: 1,
    };
  }

  if (progress <= 0.62) {
    return {
      ...surveyFocus,
      satellites: {
        survey: 0.82 + ramp(progress, 0.58, 0.62) * 0.18,
        gis: 0,
        it: 0,
      },
    };
  }

  if (progress <= 0.74) {
    const t = smoothstep((progress - 0.62) / 0.12);
    return {
      camera: mixVector(surveyFocus.camera, gisFocus.camera, t),
      target: mixVector(surveyFocus.target, gisFocus.target, t),
      emphasis: {
        survey: mix(surveyFocus.emphasis.survey, gisFocus.emphasis.survey, t),
        gis: mix(surveyFocus.emphasis.gis, gisFocus.emphasis.gis, t),
        it: mix(surveyFocus.emphasis.it, gisFocus.emphasis.it, t),
      },
      satellites: {
        survey: mix(1, 0, t),
        gis: ramp(progress, 0.68, 0.74),
        it: 0,
      },
      activeIndex: 2,
    };
  }

  if (progress <= 0.78) {
    return {
      ...gisFocus,
      satellites: {
        survey: 0,
        gis: 0.86 + ramp(progress, 0.74, 0.78) * 0.14,
        it: 0,
      },
    };
  }

  if (progress <= 0.92) {
    const t = smoothstep((progress - 0.78) / 0.14);
    return {
      camera: mixVector(gisFocus.camera, itFocus.camera, t),
      target: mixVector(gisFocus.target, itFocus.target, t),
      emphasis: {
        survey: mix(gisFocus.emphasis.survey, itFocus.emphasis.survey, t),
        gis: mix(gisFocus.emphasis.gis, itFocus.emphasis.gis, t),
        it: mix(gisFocus.emphasis.it, itFocus.emphasis.it, t),
      },
      satellites: {
        survey: 0,
        gis: mix(1, 0, t),
        it: ramp(progress, 0.86, 0.92),
      },
      activeIndex: 3,
    };
  }

  if (progress <= 0.95) {
    return {
      ...itFocus,
      satellites: {
        survey: 0,
        gis: 0,
        it: 0.88 + ramp(progress, 0.92, 0.95) * 0.12,
      },
    };
  }

  const t = smoothstep((progress - 0.95) / 0.05);
  return {
    camera: mixVector(itFocus.camera, overviewEnd.camera, t),
    target: mixVector(itFocus.target, overviewEnd.target, t),
    emphasis: {
      survey: mix(itFocus.emphasis.survey, overviewEnd.emphasis.survey, t),
      gis: mix(itFocus.emphasis.gis, overviewEnd.emphasis.gis, t),
      it: mix(itFocus.emphasis.it, overviewEnd.emphasis.it, t),
    },
    satellites: {
      survey: 0,
      gis: 0,
      it: mix(itFocus.satellites.it, 0, t),
    },
    activeIndex: 4,
  };
}

export function createCareerUniverseScrollController({ section, sceneApi }) {
  if (!section || !sceneApi) {
    return () => {};
  }

  const stage = section.querySelector(".career-universe-stage");
  const progressItems = Array.from(section.querySelectorAll(".career-progress-marker"));
  const intro = section.querySelector('[data-story-copy="intro"]');
  const surveyPanel = section.querySelector('[data-story-panel="survey"]');
  const gisPanel = section.querySelector('[data-story-panel="gis"]');
  const itPanel = section.querySelector('[data-story-panel="it"]');
  const integratedPanel = section.querySelector('[data-story-panel="integrated"]');
  let rafId = 0;
  let currentProgress = 0;
  let targetProgress = 0;
  let hasMeasured = false;

  function applyPanelState(element, amount) {
    if (!element) {
      return;
    }

    const clamped = clamp(amount);
    element.style.opacity = clamped.toFixed(4);
    element.style.transform = `translate3d(0, ${18 - clamped * 18}px, 0)`;
    element.style.pointerEvents = clamped > 0.45 ? "auto" : "none";
    element.setAttribute("aria-hidden", clamped < 0.08 ? "true" : "false");
  }

  function applyState(progress) {
    const state = getCareerUniverseStoryState(progress);
    const surveyAmount = plateau(progress, 0.4, 0.5, 0.58, 0.68);
    const gisAmount = plateau(progress, 0.68, 0.76, 0.8, 0.9);
    const itAmount = plateau(progress, 0.86, 0.93, 0.96, 0.995);
    const integratedAmount = plateau(progress, 0.95, 0.985, 0.999, 1);
    sceneApi.setStoryView({ ...state, integration: integratedAmount });
    section.style.setProperty("--career-story-progress", progress.toFixed(4));
    progressItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === state.activeIndex);
    });
    const chapterDominance = Math.max(surveyAmount, gisAmount, itAmount, integratedAmount);
    const introAmount = clamp((1 - ramp(progress, 0.4, 0.5)) * (1 - chapterDominance * 0.55));

    applyPanelState(intro, introAmount);
    applyPanelState(surveyPanel, surveyAmount);
    applyPanelState(gisPanel, gisAmount);
    applyPanelState(itPanel, itAmount);
    applyPanelState(integratedPanel, integratedAmount);
    if (stage) {
      stage.classList.toggle("is-story-focus", progress > 0.4);
      stage.classList.toggle("is-story-hero", progress <= 0.4);
      stage.classList.toggle("is-story-conclusion", progress > 0.94);
      stage.style.setProperty("--story-layout-progress", ramp(progress, 0.4, 0.52).toFixed(4));
      stage.style.opacity = "";
      stage.style.transform = "";
    }
  }

  function measureProgress() {
    const rect = section.getBoundingClientRect();
    const total = Math.max(rect.height - window.innerHeight, 1);
    return clamp((-rect.top) / total);
  }

  function step() {
    const delta = targetProgress - currentProgress;
    const isSettled = Math.abs(delta) < 0.0005;

    currentProgress = isSettled ? targetProgress : currentProgress + delta * 0.14;
    applyState(currentProgress);

    if (!isSettled) {
      rafId = window.requestAnimationFrame(step);
      return;
    }

    rafId = 0;
  }

  function requestUpdate(immediate = false) {
    targetProgress = measureProgress();

    if (!hasMeasured || immediate) {
      hasMeasured = true;
      currentProgress = targetProgress;
      applyState(currentProgress);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      return;
    }

    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(step);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => requestUpdate(true));
  requestUpdate(true);

  return () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}
