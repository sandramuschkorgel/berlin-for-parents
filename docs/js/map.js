let playgroundMarkersLayer;
let map;

document.addEventListener("DOMContentLoaded", function () {
    // Initialize map centered on Berlin
    const berlinCoords = [52.52, 13.405]; // lat, lon

    map = L.map("map").setView(berlinCoords, 12);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
        minZoom: 10,
        maxZoom: 18,
        tileSize: 256,
    }).addTo(map);

    // Initialize layer group
    playgroundMarkersLayer = L.layerGroup().addTo(map);

    // Fetch playgrounds using shared API function
    fetchFromAPI('/api/playgrounds')
        .then(playgrounds => {
            console.log(`Loaded ${playgrounds.length} playgrounds`);

            playgrounds.forEach(pg => {
                const modernIcon = L.divIcon({
                    html: '<div class="simple-marker"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, -8],
                    className: 'custom-marker-icon'
                });

                L.marker([pg.lat, pg.lon], { icon: modernIcon })
                    .addTo(playgroundMarkersLayer)
                    .bindPopup(`${pg.name || 'Unnamed Playground'}`);
            });
        })
        .catch(err => {
            alert("Failed to load playgrounds. Make sure the backend is running at " + CONFIG.API_BASE_URL);
        });
    
    // Toggle function
    window.togglePlaygroundMarkers = function() {
        const checkbox = document.getElementById('playgroundToggle');
        
        if (checkbox.checked) {
            map.addLayer(playgroundMarkersLayer);
        } else {
            map.removeLayer(playgroundMarkersLayer);
        }
    };
});
