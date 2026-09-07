# Experience map

The home page's Experience section displays seven entries across five cities or counties: Jiaxing (birthplace), Dalian (bachelor's degree), Jiashan (GIS internship), Hangzhou (GIS engineering role), and Brisbane (UQ St Lucia, QUT Gardens Point and an IT internship).

Experience text is consolidated from the user-provided `Yufei_He_IT_26.pdf` and `Yufei He_GIS_26.pdf`. Birthplace was supplied directly by the user. QUT is displayed as `2025 – Present`; the meaning of the GIS resume's `2026.12` date has not been confirmed, so no graduation date is asserted. The Jiashan employer is located at county level; campus pins are approximate campus locations, and other pins do not assert an exact office or birth address.

The section renders readable location details before the map loads. Leaflet and its basemap load when the section approaches the viewport. The timeline, category filters and order selector remain available if the map module fails. Nearby Zhejiang pins group below zoom level 8; selecting the group reveals Jiaxing, Jiashan and Hangzhou. Brisbane locations group below zoom level 13. Hash navigation disconnects observers and removes the Leaflet instance.

The default panel is a complete timeline across all locations, sorted by start date from newest to oldest. The order selector also supports oldest first. Date fields retain the year or month precision given in the resumes; the undated birthplace is always the chronological origin. Category and location filters preserve the selected order. Each timeline entry displays its location as plain text; clicking an entry or its location does not navigate the map. Locations are selected through map pins; there is no row of place buttons below the map. Show all places restores the complete timeline. Keyboard activation of an individual map pin moves focus to the timeline.

Selecting a place focuses zoom level 11 by default; QUT uses zoom level 13 so its campus pin remains visible outside the Brisbane group. The map supports zoom levels 2–13, from the international overview to city detail. Zoom level 6 and above loads OpenStreetMap tiles for roads, rivers, urban areas and geographic labels. Interface text, experience descriptions and custom pins remain in English; third-party basemap labels follow the local map language. Resizing preserves an active city view. The scale control displays metric distances.

## Map data

- Basemap: [Natural Earth 1:50m land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson), downloaded 2026-09-05. Properties were removed and coordinate precision reduced to three decimal places in `frontend/src/features/experienceMap/land.json`.
- License: [Natural Earth public domain terms](https://www.naturalearthdata.com/about/terms-of-use/). Attribution is retained in the map.
- Jiaxing centre: [Apple Maps](https://maps.apple.com/place?auid=1117323569305372&lsp=57879).
- Jiashan centre: [Apple Maps](https://maps.apple.com/place?auid=1117323568216836&lsp=57879).
- QUT campus: the [official Master of Information Technology page](https://www.qut.edu.au/courses/master-of-information-technology) lists Gardens Point. The pin uses the approximate campus location `[-27.47724, 153.02834]` from [OpenStreetMap campus data via Mapcarta](https://mapcarta.com/W758850257), consistent with [QUT's campus map](https://www.qut.edu.au/about/campuses-and-facilities/maps-and-getting-here/gardens-point).
- City detail: [OpenStreetMap standard tiles](https://tile.openstreetmap.org/{z}/{x}/{y}.png), credited to [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Requests follow the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/): visible map areas only, browser caching and referrers retained, with no bulk download or offline tile prefetch.

The overview is bundled locally; city detail requires internet access to the tile service. Failed city tiles reveal the bundled overview and display a short status message while all pins and timeline controls remain usable. No API key, geocoding or location permission is required.

Timeline checks: `node --test frontend/tests/experienceMapData.test.js`.
