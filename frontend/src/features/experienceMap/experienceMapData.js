// City / county centres and the Brisbane study/work locations.
export const experiencePlaces = [
  { id: "dalian", name: "Dalian", region: "Liaoning, China", coordinates: [38.914, 121.6147] },
  { id: "jiashan", name: "Jiashan", region: "Jiaxing, Zhejiang, China", coordinates: [30.83085, 120.92603], group: "zhejiang" },
  { id: "hangzhou", name: "Hangzhou", region: "Zhejiang, China", coordinates: [30.2741, 120.1551], group: "zhejiang" },
  { id: "uq-st-lucia", name: "UQ St Lucia", region: "Brisbane, Queensland, Australia", coordinates: [-27.4975, 153.0137], group: "brisbane" },
  { id: "qut-gardens-point", name: "QUT Gardens Point", region: "Brisbane, Queensland, Australia", coordinates: [-27.47724, 153.02834], group: "brisbane", focusZoom: 13 },
  { id: "city-1", name: "Brisbane City", region: "Brisbane, Queensland, Australia", coordinates: [-27.4698, 153.0251], group: "brisbane" },
  { id: "city-2", name: "95 North Quay, Brisbane City", region: "Brisbane, Queensland, Australia", coordinates: [-27.4695079,153.0207943,267], group: "brisbane" },
];

export const experienceCategories = [
  { id: "all", label: "All experiences" },
  { id: "education", label: "Education" },
  { id: "work", label: "Work" },
  { id: "origin", label: "Origins" },
];

export const experiences = [
  {
    id: "birthplace", placeId: "jiashan", category: "origin", period: "Where it began",
    startDate: null,
    title: "Born in Jiaxing jiashan", organization: "Zhejiang, China",
    summary: "My journey began in Jiaxing, Zhejiang, China.",
    highlights: [], tags: ["Birthplace"],
  },
  {
    id: "bachelor", placeId: "dalian", category: "education", period: "2018 – 2022",
    startDate: "2018",
    title: "Bachelor of Surveying and Mapping Engineering",
    organization: "City Institute, Dalian University of Technology",
    summary: "Built an academic foundation in surveying, mapping and geospatial engineering.",
    highlights: ["GPA: 3.71 / 4"], tags: ["Surveying", "Mapping"],
  },
  {
    id: "gis-intern", placeId: "jiashan", category: "work", period: "Jan – Mar 2022",
    startDate: "2022-01",
    title: "GIS Intern",
    organization: "Jiashan County 3D Surveying, Mapping and Geographic Information Institute Co., Ltd.",
    summary: "Supported regional planning and spatial data management through GIS mapping.",
    highlights: [
      "Created thematic maps for large regional planning projects, including the Yangtze River Delta project.",
      "Applied YOLOv5 to geospatial object detection and feature extraction.",
    ], tags: ["Cartography", "Spatial Data", "YOLOv5"],
  },
  {
    id: "gis-engineer", placeId: "hangzhou", category: "work", period: "Jul 2022 – Jul 2023",
    startDate: "2022-07",
    title: "GIS Software Development Engineer", organization: "Hangzhou Fast Software Co., Ltd.",
    summary: "Developed enterprise GIS desktop software and automated spatial data workflows.",
    highlights: [
      "Developed and enhanced FastMCI using C# and .NET.",
      "Independently delivered the Shaoxing Future Community GIS Platform with a WPF interface and GIS functionality.",
      "Built reusable GIS plugins and automated spatial analysis with Python and ArcPy.",
    ], tags: ["C# / .NET", "WPF", "ArcGIS Engine", "Python / ArcPy"],
  },
  {
    id: "qut", placeId: "qut-gardens-point", category: "education", period: "2025 – Present",
    startDate: "2025",
    title: "Master of Information Technology", organization: "Queensland University of Technology",
    summary: "Postgraduate study in information technology, software development and data analytics.",
    highlights: ["GPA: 5.875 / 7", "Coursework: Web Computing, Software Development and Data Analytics."],
    tags: ["Information Technology", "Software Development"],
  },
  {
    id: "ai-mmi", placeId: "city-1", category: "work", period: "Dec 2025 – Feb 2026",
    startDate: "2025-12",
    title: "IT Intern · Full-Stack & UI/UX", organization: "AI-mmi",
    summary: "Contributed to the company's website and improved its interface and user experience.",
    highlights: [
      "Helped develop and deploy a responsive website with mobile-first design and cross-browser compatibility.",
      "Conducted user research and improved navigation and interface design in Figma.",
      "Used AI-agent assisted programming to accelerate development within an Agile team.",
    ], tags: ["Web Development", "Figma", "UI/UX", "AI-Assisted Development"],
  },
  {
    id: "uq", placeId: "uq-st-lucia", category: "education", period: "2023 – 2024",
    startDate: "2023",
    title: "Master of Geographic Information Science", organization: "The University of Queensland",
    summary: "Postgraduate study in geographic information science and spatial analysis.",
    highlights: ["GPA: 5.83 / 7"], tags: ["GIS", "Spatial Analysis"],
  },
  {
    id: "onterris", placeId: "city-2", category: "work", period: "Sep 2026 – Present",
    startDate: "2026-09",
    title: "GIS Intern", organization: "Onterris",
    summary: "Contributed to the company's GIS Team.",
    highlights: [
      "Conducted spatial analysis and data visualization for various projects.",
    ], tags: ["GIS"],
  },
];

export function getExperiences({ placeId = null, category = "all", order = "newest" } = {}) {
  return experiences
    .filter((entry) => (!placeId || entry.placeId === placeId) && (category === "all" || entry.category === category))
    .sort((a, b) => {
      // Preserve the resume's date precision; the undated birthplace is the origin.
      const comparison = (a.startDate ?? "").localeCompare(b.startDate ?? "");
      return (order === "oldest" ? comparison : -comparison) || a.id.localeCompare(b.id);
    });
}

export function getPlaceExperiences(placeId, category = "all", order = "newest") {
  return getExperiences({ placeId, category, order });
}

export function getVisiblePlaces(category = "all", order = "newest") {
  const placeIds = [...new Set(getExperiences({ category, order }).map((entry) => entry.placeId))];
  return placeIds.map((id) => experiencePlaces.find((place) => place.id === id));
}
