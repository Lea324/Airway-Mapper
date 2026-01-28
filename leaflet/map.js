// map.js
export async function getMap(map, maptype) {
  const prom1 = fetch(`./data/${maptype}/airports.json`).then((res) =>
    res.json()
  );
  const prom2 = fetch(`./data/${maptype}/routes.json`).then((res) =>
    res.json()
  );
  var [airports, routes] = await Promise.all([prom1, prom2]);

  var filterRouteLayer = L.layerGroup();
  var filterAirportLayer = L.layerGroup();
  var filterLabelLayer = L.layerGroup();

  function getConnections(id) {
    var connections = new Set();
    connections.add(id);
    routes.features.forEach((x) => {
      var label = x.id.split("_");
      if (label[0] == id) {
        connections.add(label[1]);
      }
      if (label[1] == id) {
        connections.add(label[0]);
      }
    });
    return connections;
  }

  function filterId(id) {
    if (!map.hasLayer(filterRouteLayer)) {
      var connections = getConnections(id);
      map.removeLayer(lineLayer);
      map.removeLayer(halfLineLayer);
      map.removeLayer(clearLineLayer);
      map.removeLayer(airportLayer);
      map.removeLayer(labelLayer);
      filterAirportLayer = L.geoJSON(airports, {
        onEachFeature: onEachAirport,
        pointToLayer: airportToCircleMarker,
        filter: (feature, layer) => connections.has(feature.id),
      }).addTo(map);
      filterLabelLayer = L.geoJSON(airports, {
        onEachFeature: onEachAirport,
        pointToLayer: (feature, latlng) => airportToLabel(feature, latlng, true),
        filter: (feature, layer) => connections.has(feature.id),
      }).addTo(map);
      filterRouteLayer = L.geoJSON(routes, {
        style: (feature) => feature.properties.style,
        filter: (feature, layer) => feature.id.includes(id),
      }).addTo(map);
    }
  }

  function showAll() {
    if (map.hasLayer(filterLabelLayer)) {
      map.removeLayer(filterAirportLayer);
      map.removeLayer(filterLabelLayer);
      map.removeLayer(filterRouteLayer);
      map.addLayer(lineLayer);
      map.addLayer(halfLineLayer);
      map.addLayer(clearLineLayer);
      map.addLayer(airportLayer);
      map.addLayer(labelLayer);
    }
  }
  map.on("click", () => showAll());

  function onEachAirport(feature, layer) {
    layer.on("click", () => filterId(feature.id));
    layer.on("mouseover", () => filterId(feature.id));
    layer.on("mouseout", showAll);
  }

  function airportToCircleMarker(feature, latlng) {
  const isNightMode = window.isNightMode || false;
  const fillColor = isNightMode ? "white" : "black";
  
  return L.circleMarker(latlng, {
    radius: 2,
    color: "white",        
    weight: 1,            
    opacity: 1,           
    fillColor: fillColor, 
    fillOpacity: 1,       
    pane: "airports",
    bubblingMouseEvents: false,
  });
}

  function airportToCircle(feature, latlng) {
    return L.circle(latlng, {
      radius: 20000,
      color: "green",
      opacity: 0,
      fillOpacity: 0,
      pane: "circles",
      bubblingMouseEvents: false,
    });
  }

  function airportToLabel(feature, latlng, isHighlighted = false) {
    const isNightMode = window.isNightMode || false;
    const labelColor = isHighlighted ? '#97d4f5' : (isNightMode ? 'white' : '#333');
    const textShadow = isNightMode 
      ? '1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black'
      : '1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white';
    
    return L.marker(latlng, {
      icon: L.divIcon({
        className: "codes airport-label",
        iconAnchor: [0, 22],
        iconSize: [0, 0],
        html: `<span style="color: ${labelColor}; text-shadow: ${textShadow}; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;">${feature.id}</span>`,
      }),
    });
  }

  function styleLine(feature) {
    return { color: feature.properties.style.color, weight: 0.6 };
  }

  function styleClearLine(feature) {
    return { weight: 10, opacity: 0, fill: false };
  }

  var airportLayer = L.geoJSON(airports, {
    pointToLayer: airportToCircleMarker,
  });
  var clearAirportLayer = L.geoJSON(airports, {
    onEachFeature: onEachAirport,
    pointToLayer: airportToCircle,
  });
  var labelLayer = L.geoJSON(airports, { pointToLayer: airportToLabel });
  var lineLayer = L.geoJSON(routes, { style: styleLine });
  var clearLineLayer = L.geoJSON(routes, {
    style: styleClearLine,
  });

  let halfRoutes = JSON.parse(JSON.stringify(routes));
  halfRoutes.features.forEach(
    (x) => (x.geometry.coordinates = x.geometry.coordinates.slice(0, 3))
  );
  var halfLineLayer = L.geoJSON(halfRoutes, { style: styleLine });

  var layerGroup = L.layerGroup([
    airportLayer,
    clearAirportLayer,
    labelLayer,
    lineLayer,
    clearLineLayer,
    halfLineLayer,
  ]);

  // Store route data for search functionality
  layerGroup._routesData = routes;
  layerGroup._airportsData = airports;
  
  return layerGroup;
}