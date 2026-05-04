/* Salzburg Urban Amenities WebGIS
   A portfolio-ready Leaflet application for geovisualization and advanced cartography.
*/

const CATEGORIES = {
  playgrounds: {
    label: "Playgrounds",
    singular: "Playground",
    color: "#16a34a",
    short: "P",
    data: typeof spielplatz !== "undefined" ? spielplatz : { type: "FeatureCollection", features: [] },
    icon: "data/spielplatz.png"
  },
  wifi: {
    label: "Wi-Fi hotspots",
    singular: "Wi-Fi hotspot",
    color: "#2563eb",
    short: "W",
    data: typeof wlanhotspot !== "undefined" ? wlanhotspot : { type: "FeatureCollection", features: [] },
    icon: "data/wlanhotspot.png"
  },
  museums: {
    label: "Museums",
    singular: "Museum",
    color: "#dc2626",
    short: "M",
    data: typeof museum !== "undefined" ? museum : { type: "FeatureCollection", features: [] },
    icon: "data/museum.png"
  },
  libraries: {
    label: "Libraries",
    singular: "Library",
    color: "#7c3aed",
    short: "L",
    data: typeof bibliothek !== "undefined" ? bibliothek : { type: "FeatureCollection", features: [] },
    icon: "data/bibliothek.png"
  }
};

const INITIAL_VIEW = { center: [47.8000, 13.0450], zoom: 13 };
const state = {
  activeCategories: new Set(Object.keys(CATEGORIES)),
  search: "",
  filteredFeatures: [],
  analysisMode: false,
  measureMode: false,
  measurePoints: [],
  selectedFeatureId: null
};

const map = L.map("map", { zoomControl: false }).setView(INITIAL_VIEW.center, INITIAL_VIEW.zoom);
L.control.zoom({ position: "topright" }).addTo(map);
L.control.scale({ position: "bottomright", imperial: false }).addTo(map);

const basemaps = {
  "OpenStreetMap": L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  "Carto Light": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }),
  "Carto Dark": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  })
};
basemaps["Carto Light"].addTo(map);
L.control.layers(basemaps, null, { position: "topright", collapsed: true }).addTo(map);

const markerLayer = L.layerGroup().addTo(map);
const analysisLayer = L.layerGroup().addTo(map);
const measureLayer = L.layerGroup().addTo(map);

const allFeatures = normaliseFeatures();

function normaliseFeatures() {
  const features = [];
  Object.entries(CATEGORIES).forEach(([categoryKey, category]) => {
    (category.data.features || []).forEach((feature, idx) => {
      if (!feature.geometry || feature.geometry.type !== "Point") return;
      const props = extractProperties(feature.properties || {});
      const coords = feature.geometry.coordinates;
      features.push({
        id: `${categoryKey}-${idx}`,
        categoryKey,
        categoryLabel: category.label,
        categorySingular: category.singular,
        color: category.color,
        short: category.short,
        lng: Number(coords[0]),
        lat: Number(coords[1]),
        name: props.NAME || props.STANDORTNAME || props.Name || props.ID || `${category.singular} ${idx + 1}`,
        address: props.ADRESSE || [props.STRASSENNAME, props.HAUSNR].filter(Boolean).join(" ") || "Address not available",
        street: props.STRASSENNAME || "",
        offer: props.ANGEBOT || "",
        size: props.GROESSE_M2 || "",
        phone: props.TELEFON || "",
        email: props.EMAIL || "",
        homepage: props.HOMEPAGE || "",
        original: feature
      });
    });
  });
  return features;
}

function extractProperties(properties) {
  const output = { ...properties };
  const html = properties.description || "";
  const regex = /<span class="atr-name">([^<]+)<\/span>:\s*<\/strong>\s*<span class="atr-value">([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const key = cleanText(match[1]);
    const value = cleanText(match[2]);
    if (key) output[key] = value;
  }
  return output;
}

function cleanText(value) {
  const temp = document.createElement("div");
  temp.innerHTML = String(value || "");
  return temp.textContent.replace(/\s+/g, " ").trim();
}

function markerIcon(item, selected = false) {
  const size = selected ? 34 : 26;
  return L.divIcon({
    className: "",
    html: `<div class="custom-marker" style="width:${size}px;height:${size}px;background:${item.color};font-size:${selected ? 15 : 12}px">${item.short}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

function popupHtml(item) {
  const home = item.homepage ? `<p><strong>Website:</strong> <a href="${item.homepage}" target="_blank" rel="noopener">Open link</a></p>` : "";
  const email = item.email ? `<p><strong>Email:</strong> ${item.email}</p>` : "";
  const phone = item.phone ? `<p><strong>Phone:</strong> ${item.phone}</p>` : "";
  const offer = item.offer ? `<p><strong>Facilities:</strong> ${item.offer}</p>` : "";
  const size = item.size ? `<p><strong>Area:</strong> ${item.size} m²</p>` : "";
  return `
    <div class="popup-card">
      <h3>${escapeHtml(item.name)}</h3>
      <p><strong>Category:</strong> ${item.categorySingular}</p>
      <p><strong>Address:</strong> ${escapeHtml(item.address)}</p>
      ${offer}${size}${phone}${email}${home}
      <p><strong>Coordinates:</strong> ${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</p>
    </div>`;
}

function escapeHtml(text) {
  return String(text || "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function renderCategoryControls() {
  const container = document.getElementById("categoryControls");
  container.innerHTML = "";
  Object.entries(CATEGORIES).forEach(([key, category]) => {
    const count = allFeatures.filter(f => f.categoryKey === key).length;
    const button = document.createElement("button");
    button.className = `category-toggle ${state.activeCategories.has(key) ? "" : "off"}`;
    button.innerHTML = `<span class="category-left"><span class="dot" style="background:${category.color}"></span>${category.label}</span><span>${count}</span>`;
    button.addEventListener("click", () => {
      if (state.activeCategories.has(key)) state.activeCategories.delete(key); else state.activeCategories.add(key);
      renderCategoryControls();
      refresh();
    });
    container.appendChild(button);
  });
}

function filterFeatures() {
  const term = state.search.trim().toLowerCase();
  return allFeatures.filter(item => {
    const categoryMatch = state.activeCategories.has(item.categoryKey);
    const searchText = [item.name, item.address, item.offer, item.phone, item.email, item.categoryLabel].join(" ").toLowerCase();
    const searchMatch = !term || searchText.includes(term);
    return categoryMatch && searchMatch;
  });
}

function refresh() {
  markerLayer.clearLayers();
  state.filteredFeatures = filterFeatures();
  state.filteredFeatures.forEach(item => {
    const marker = L.marker([item.lat, item.lng], { icon: markerIcon(item, item.id === state.selectedFeatureId), title: item.name });
    marker.bindPopup(popupHtml(item));
    marker.bindTooltip(`${item.categorySingular}: ${item.name}`, { direction: "top", opacity: 0.9 });
    marker.on("click", () => selectFeature(item));
    markerLayer.addLayer(marker);
    item._marker = marker;
  });
  updateStats();
  updateLegend();
  updateChart();
  updateFeatureList();
}

function updateStats() {
  const counts = categoryCounts(state.filteredFeatures);
  const stats = [
    { label: "Visible places", value: state.filteredFeatures.length },
    { label: "Playgrounds", value: counts.playgrounds || 0 },
    { label: "Wi-Fi hotspots", value: counts.wifi || 0 },
    { label: "Cultural / learning places", value: (counts.museums || 0) + (counts.libraries || 0) }
  ];
  document.getElementById("statsGrid").innerHTML = stats.map(s => `<article class="stat-card"><div class="label">${s.label}</div><div class="value">${s.value}</div></article>`).join("");
  document.getElementById("visibleCount").textContent = `${state.filteredFeatures.length} visible`;
}

function categoryCounts(features) {
  return features.reduce((acc, item) => {
    acc[item.categoryKey] = (acc[item.categoryKey] || 0) + 1;
    return acc;
  }, {});
}

function updateLegend() {
  const counts = categoryCounts(state.filteredFeatures);
  document.getElementById("legend").innerHTML = `
    <h3>Legend</h3>
    ${Object.entries(CATEGORIES).map(([key, cat]) => `
      <div class="legend-row"><span><span class="dot" style="background:${cat.color}"></span> ${cat.label}</span><strong>${counts[key] || 0}</strong></div>
    `).join("")}
    <div class="legend-row"><span>Analysis radius</span><strong>${document.getElementById("radiusSelect").value} m</strong></div>`;
}

function updateChart() {
  const counts = categoryCounts(state.filteredFeatures);
  const max = Math.max(1, ...Object.values(counts));
  document.getElementById("barChart").innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => {
    const value = counts[key] || 0;
    const width = Math.max(4, (value / max) * 100);
    return `<div class="bar-row"><span>${cat.label}</span><div class="bar-track"><div class="bar-fill" style="width:${width}%;background:${cat.color}"></div></div><strong>${value}</strong></div>`;
  }).join("");
}

function updateFeatureList() {
  const list = document.getElementById("featureList");
  const items = state.filteredFeatures.slice().sort((a, b) => a.name.localeCompare(b.name));
  list.innerHTML = items.length ? items.map(item => `
    <article class="feature-item" data-id="${item.id}">
      <h3>${escapeHtml(item.name)}</h3>
      <p>${item.categorySingular} · ${escapeHtml(item.address)}</p>
    </article>`).join("") : `<p class="muted">No places match the current filter.</p>`;
  list.querySelectorAll(".feature-item").forEach(el => {
    el.addEventListener("click", () => {
      const item = allFeatures.find(f => f.id === el.dataset.id);
      if (item) {
        selectFeature(item);
        map.setView([item.lat, item.lng], 16);
        if (item._marker) item._marker.openPopup();
      }
    });
  });
}

function selectFeature(item) {
  state.selectedFeatureId = item.id;
  document.getElementById("selectedFeature").innerHTML = `
    <h3 style="margin:0 0 8px">${escapeHtml(item.name)}</h3>
    <p><strong>Category:</strong> ${item.categorySingular}</p>
    <p><strong>Address:</strong> ${escapeHtml(item.address)}</p>
    ${item.offer ? `<p><strong>Facilities:</strong> ${escapeHtml(item.offer)}</p>` : ""}
    ${item.homepage ? `<p><strong>Website:</strong> <a href="${item.homepage}" target="_blank" rel="noopener">Open official page</a></p>` : ""}
    <p class="muted">Coordinates: ${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</p>`;
  refresh();
}

function fitFiltered() {
  if (!state.filteredFeatures.length) return;
  const bounds = L.latLngBounds(state.filteredFeatures.map(f => [f.lat, f.lng]));
  map.fitBounds(bounds.pad(0.18));
}

function runClickAnalysis(latlng) {
  analysisLayer.clearLayers();
  const radius = Number(document.getElementById("radiusSelect").value);
  const circle = L.circle(latlng, { radius, color: "#0f172a", weight: 2, fillColor: "#38bdf8", fillOpacity: 0.12 }).addTo(analysisLayer);
  const pointMarker = L.marker(latlng, { title: "Analysis point" }).addTo(analysisLayer).bindPopup("Analysis point").openPopup();
  const nearby = state.filteredFeatures
    .map(item => ({ ...item, distance: distanceMeters(latlng.lat, latlng.lng, item.lat, item.lng) }))
    .filter(item => item.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
  const nearestByCategory = Object.keys(CATEGORIES).map(key => {
    const nearest = state.filteredFeatures
      .filter(item => item.categoryKey === key)
      .map(item => ({ ...item, distance: distanceMeters(latlng.lat, latlng.lng, item.lat, item.lng) }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearest) L.polyline([latlng, [nearest.lat, nearest.lng]], { color: nearest.color, weight: 2, dashArray: "5 5" }).addTo(analysisLayer);
    return nearest;
  }).filter(Boolean);
  const counts = categoryCounts(nearby);
  document.getElementById("analysisStatus").textContent = `${nearby.length} within ${radius} m`;
  document.getElementById("analysisOutput").innerHTML = `
    <p><strong>Selected location:</strong> ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}</p>
    <p><strong>Total amenities within radius:</strong> ${nearby.length}</p>
    <div class="bar-chart">
      ${Object.entries(CATEGORIES).map(([key, cat]) => `<div class="legend-row"><span><span class="dot" style="background:${cat.color}"></span> ${cat.label}</span><strong>${counts[key] || 0}</strong></div>`).join("")}
    </div>
    <p><strong>Nearest visible amenities:</strong></p>
    ${nearestByCategory.map(item => `<p>• ${item.categorySingular}: <strong>${escapeHtml(item.name)}</strong> (${Math.round(item.distance)} m)</p>`).join("") || `<p class="muted">No visible amenities found.</p>`}`;
  map.fitBounds(circle.getBounds().pad(0.15));
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toggleMode(mode) {
  if (mode === "analysis") {
    state.analysisMode = !state.analysisMode;
    state.measureMode = false;
  } else {
    state.measureMode = !state.measureMode;
    state.analysisMode = false;
    state.measurePoints = [];
    measureLayer.clearLayers();
  }
  document.getElementById("analysisModeBtn").classList.toggle("active", state.analysisMode);
  document.getElementById("measureModeBtn").classList.toggle("active", state.measureMode);
  map.getContainer().style.cursor = (state.analysisMode || state.measureMode) ? "crosshair" : "";
}

function handleMeasure(latlng) {
  state.measurePoints.push(latlng);
  L.circleMarker(latlng, { radius: 5, color: "#0f172a", fillColor: "#f97316", fillOpacity: 1 }).addTo(measureLayer);
  if (state.measurePoints.length === 2) {
    const [a, b] = state.measurePoints;
    const dist = distanceMeters(a.lat, a.lng, b.lat, b.lng);
    L.polyline([a, b], { color: "#f97316", weight: 4 }).addTo(measureLayer);
    L.popup().setLatLng(b).setContent(`<strong>Measured distance:</strong> ${dist >= 1000 ? (dist / 1000).toFixed(2) + " km" : Math.round(dist) + " m"}`).openOn(map);
    state.measurePoints = [];
  }
}

function exportCSV() {
  const rows = [["name", "category", "address", "latitude", "longitude", "homepage"]];
  state.filteredFeatures.forEach(item => rows.push([item.name, item.categorySingular, item.address, item.lat, item.lng, item.homepage]));
  const csv = rows.map(row => row.map(value => `"${String(value || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "salzburg_filtered_amenities.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function initEvents() {
  document.getElementById("searchInput").addEventListener("input", event => { state.search = event.target.value; refresh(); });
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    state.activeCategories = new Set(Object.keys(CATEGORIES));
    state.search = "";
    document.getElementById("searchInput").value = "";
    renderCategoryControls();
    refresh();
  });
  document.getElementById("resetViewBtn").addEventListener("click", () => map.setView(INITIAL_VIEW.center, INITIAL_VIEW.zoom));
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("analysisModeBtn").addEventListener("click", () => toggleMode("analysis"));
  document.getElementById("measureModeBtn").addEventListener("click", () => toggleMode("measure"));
  document.getElementById("radiusSelect").addEventListener("change", updateLegend);
  document.getElementById("fitFilteredBtn").addEventListener("click", fitFiltered);
  document.getElementById("exportBtn").addEventListener("click", exportCSV);
  document.getElementById("locateBtn").addEventListener("click", () => map.locate({ setView: true, maxZoom: 16 }));
  document.getElementById("mobileToggle").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
  map.on("locationfound", event => L.circle(event.latlng, { radius: event.accuracy, color: "#1d4ed8", fillOpacity: 0.08 }).addTo(analysisLayer));
  map.on("locationerror", () => alert("Your browser could not access your location."));
  map.on("click", event => {
    if (state.analysisMode) runClickAnalysis(event.latlng);
    if (state.measureMode) handleMeasure(event.latlng);
  });
}

renderCategoryControls();
initEvents();
refresh();
fitFiltered();
