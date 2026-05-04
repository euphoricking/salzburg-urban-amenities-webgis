# Explore Salzburg: Professional WebGIS Application for Urban Amenities

**Explore Salzburg** is a browser-based WebGIS application for visualising and analysing selected public amenities in Salzburg, Austria. The application was developed as a portfolio-ready refinement of a Geovisualization and Advanced Cartography project. It demonstrates interactive web mapping, cartographic design, spatial querying, accessibility-style analysis, and professional interface design using Leaflet, JavaScript, HTML, CSS and GeoJSON.

## Project Purpose

The application helps users explore the spatial distribution of public amenities in Salzburg, including playgrounds, public Wi-Fi hotspots, museums and libraries. Instead of presenting these datasets as a simple static map, the project turns them into a complete WebGIS interface with filters, search, map tools, category summaries, interactive popups and basic spatial analysis.

## Main Features

- Interactive Leaflet web map
- Professional responsive WebGIS layout
- Multiple basemap options
- Category filtering for playgrounds, Wi-Fi hotspots, museums and libraries
- Search by name, address, facility type or attribute
- Custom cartographic symbols and map legend
- Dynamic dashboard statistics
- Category overview chart
- Click-based accessibility analysis using a selected radius
- Nearest amenity identification by category
- Distance measurement tool
- Geolocation tool
- Feature list linked to the map
- Rich popup information for each amenity
- Export of filtered features to CSV
- Print-friendly map layout

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- GeoJSON
- OpenStreetMap / CARTO basemaps

## Project Structure

```text
Salzburg_WebGIS_Professional/
│
├── index.html              # Main application page
├── README.md               # Project documentation
├── portfolio_project_text.md
├── GITHUB_UPLOAD_GUIDE.md
│
├── css/
│   ├── leaflet.css
│   └── style.css
│
├── js/
│   ├── leaflet-src.js
│   ├── leaflet.js
│   └── app.js
│
├── data/
│   ├── spielplatz.js
│   ├── wlanhotspot.js
│   ├── museum.js
│   ├── bibliothek.js
│   ├── *.geojson
│   └── category icons
│
└── docs/
    └── application_overview.md
```

## How to Run Locally

### Option 1: Open directly

Open `index.html` in your browser. Most features will work directly, although some browsers handle local files more strictly.

### Option 2: Run with VS Code Live Server

1. Open the folder in VS Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option 3: Run with Python local server

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to Use the Application

1. Use the category filters to switch amenity layers on or off.
2. Use the search box to find places by name or attribute.
3. Click markers on the map to inspect detailed information.
4. Use **Click analysis** and click anywhere on the map to count nearby amenities within the selected radius.
5. Use **Measure distance** and click two locations to calculate distance.
6. Use **Export CSV** to download the currently visible/filtered amenities.
7. Use **Print view** to generate a clean map output for documentation.

## Data

The project uses open geospatial data for public amenities in Salzburg. The datasets include point locations for playgrounds, Wi-Fi hotspots, museums and libraries. The data files are provided as GeoJSON and JavaScript feature collections.

## Portfolio Context

This project belongs to the **Geovisualization and Advanced Cartography** section of an MSc Applied Geoinformatics ePortfolio. It demonstrates how cartographic principles can be implemented in a web-based GIS environment to support urban data exploration and communication.

## Author

Ekata Leo Oni  
MSc Applied Geoinformatics  
University of Salzburg
