# Explore Salzburg: Interactive WebGIS Application for Urban Amenities

## Project Overview

**Explore Salzburg** is a professional WebGIS application developed to visualise and analyse selected public amenities in Salzburg, Austria. The project was refined from a Geovisualization and Advanced Cartography assignment into a broader interactive web mapping application that demonstrates cartographic design, spatial communication, layer interaction and simple spatial analysis.

The application focuses on four types of urban amenities: playgrounds, public Wi-Fi hotspots, museums and libraries. These features are displayed as interactive map layers and supported by a dashboard-style interface that includes filters, search, summary statistics, category charts, popups, feature lists and map-based analysis tools.

The aim was not only to place points on a map, but to design a clear and usable WebGIS interface that supports exploration, comparison and interpretation of public services within the city.

## Problem and Motivation

Public amenities are important components of urban life. They influence how residents, visitors, students and families experience a city. However, when such datasets are presented only as tables or basic point maps, it can be difficult to understand their spatial distribution, accessibility and relationship to different parts of the urban environment.

This project addresses that issue by transforming multiple public amenity datasets into an interactive cartographic application. Through filtering, search, visual hierarchy and click-based analysis, the map allows users to explore where amenities are located and how they are distributed across Salzburg.

## Aim and Objectives

The main aim of this project was to design and develop a professional WebGIS application for exploring public amenities in Salzburg.

The objectives were to:

- visualise multiple public amenity datasets in a single interactive map;
- apply clear cartographic symbols and colours for different amenity categories;
- create a user-friendly interface for filtering, searching and exploring features;
- support map-based inspection through popups, tooltips and feature lists;
- add simple spatial analysis tools such as radius-based amenity counting and nearest amenity identification;
- provide export and print options for communication and documentation;
- present the final output as a professional ePortfolio project.

## Data Used

The project uses public geospatial datasets for Salzburg. The datasets include point locations for:

- playgrounds;
- public Wi-Fi hotspots;
- museums;
- libraries.

The data are stored as GeoJSON feature collections and JavaScript files. Each feature contains geometry and descriptive attributes such as name, address, contact information, website links and facility-related details where available.

## Tools and Technologies

The application was developed using a lightweight frontend WebGIS stack:

- **HTML5** for application structure;
- **CSS3** for layout, responsive design and visual styling;
- **JavaScript** for interaction and application logic;
- **Leaflet.js** for web mapping;
- **GeoJSON** for geospatial data representation;
- **OpenStreetMap and CARTO basemaps** for geographic context.

## Methodology

The project began with the organisation of the original Salzburg amenity datasets into separate thematic layers. Each dataset was reviewed and standardised inside the JavaScript application so that names, addresses, category labels, coordinates and additional attributes could be used consistently across the interface.

The WebGIS interface was then redesigned around a dashboard concept. A sidebar was added for project explanation, category filters, search and map tools. The central part of the interface was reserved for the map, while a right-hand insight panel was created for category summaries, selected feature details and the searchable feature list.

Cartographic design decisions were applied to improve readability and interpretation. Each amenity category was assigned a distinctive colour and symbol abbreviation. A dynamic legend was added to communicate category meaning and visible feature counts. The basemap was selected to provide clear background context without overwhelming the thematic data.

Interactive tools were added to make the application more analytical. The click-analysis tool allows users to select a location on the map and count amenities within a chosen radius. It also identifies the nearest visible amenity from each category and draws connecting lines to support spatial interpretation. A distance measurement tool was also included for simple map-based measurement.

Finally, the application was documented and prepared as a GitHub/ePortfolio project, including usage instructions, project explanation, skills demonstrated and suggested future improvements.

## Main Application Features

The refined WebGIS application includes:

- an interactive Leaflet map;
- professional responsive user interface;
- category filters for public amenities;
- keyword search across feature attributes;
- dynamic dashboard statistics;
- custom marker symbology and legend;
- interactive popups and tooltips;
- linked feature list for map navigation;
- click-based radius analysis;
- nearest amenity identification;
- distance measurement;
- user geolocation;
- filtered CSV export;
- print-friendly map view.

## Cartographic and Geovisualization Concepts Demonstrated

This project demonstrates several important concepts from geovisualization and advanced cartography:

- visual hierarchy between basemap and thematic layers;
- colour differentiation for categorical data;
- symbol design for point-based public amenities;
- interactive cartographic communication through popups and tooltips;
- layer filtering and user-controlled map exploration;
- map-based storytelling through statistics and linked panels;
- accessibility-style spatial analysis using radius buffers;
- responsive design for different screen sizes;
- integration of cartography and WebGIS application development.

## Results and Outputs

The final output is a professional WebGIS application that allows users to explore public amenities in Salzburg interactively. Users can switch amenity categories on and off, search for places, inspect detailed feature information, perform simple radius-based analysis, measure distances and export filtered results.

The project shows how open geospatial data can be transformed into a practical and visually clear web mapping application. It also demonstrates how cartographic design and software development can work together to support spatial understanding.

## Skills Demonstrated

This project demonstrates skills in:

- WebGIS development;
- advanced geovisualization;
- interactive cartographic design;
- Leaflet.js mapping;
- JavaScript application logic;
- HTML and CSS interface development;
- GeoJSON data handling;
- spatial querying and distance calculation;
- dashboard-style map design;
- user-centred map communication.

## Reflection

This project helped me move beyond the idea of a map as a static visual product. By developing the project into a full WebGIS application, I learned how cartographic decisions, interface design and spatial analysis can be combined to create a more useful and professional geospatial product.

The most important improvement was the transition from a basic Leaflet map to an interactive application with filtering, search, analysis and documentation. This made the project more suitable for real-world communication and for presentation in a professional geoinformatics portfolio.

Future improvements could include adding more public service categories, integrating walking-distance analysis using a street network, adding administrative district boundaries, connecting to live open data services and deploying the application through GitHub Pages.

## Suggested Portfolio Card Text

**Explore Salzburg** is a professional WebGIS application for visualising and analysing public amenities in Salzburg, including playgrounds, Wi-Fi hotspots, museums and libraries. Built with Leaflet, JavaScript, HTML, CSS and GeoJSON, the application includes category filtering, search, custom symbology, interactive popups, radius-based analysis, nearest amenity identification, distance measurement and CSV export.

## Suggested Tags

Geovisualization · Advanced Cartography · WebGIS · Leaflet · JavaScript · HTML · CSS · GeoJSON · Salzburg · Interactive Mapping · Urban Amenities
