let playgroundMarkersLayer;
let map;
let allPlaygrounds = []; 

document.addEventListener("DOMContentLoaded", function () {
    // Initialize map centered on Berlin
    const berlinCoords = [52.52, 13.405];

    map = L.map("map").setView(berlinCoords, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
        minZoom: 10,
        maxZoom: 18,
        tileSize: 256,
    }).addTo(map);

    playgroundMarkersLayer = L.layerGroup().addTo(map);

    // Fetch playgrounds
    fetchFromAPI('/api/playgrounds')
        .then(playgrounds => {
            console.log(`Loaded ${playgrounds.length} playgrounds`);
            allPlaygrounds = playgrounds; // Store for filtering
            renderPlaygrounds(playgrounds);
        })
        .catch(err => {
            alert("Failed to load playgrounds. Make sure the backend is running at " + CONFIG.API_BASE_URL);
        });
});

// Render playgrounds on map
function renderPlaygrounds(playgrounds) {
    // Clear existing markers
    playgroundMarkersLayer.clearLayers();

    playgrounds.forEach(pg => {
        const modernIcon = L.divIcon({
            html: '<div class="simple-marker"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8],
            className: 'custom-marker-icon'
        });

        const marker = L.marker([pg.lat, pg.lon], { icon: modernIcon })
            .addTo(playgroundMarkersLayer);

        // Build popup content
        let popupContent = `<strong>${pg.name || 'Unnamed Playground'}</strong><br>`;
        popupContent += `Category: ${pg.category}<br>`;
        if (pg.barrier_type) {
            popupContent += `Barrier: ${pg.barrier_type}`;
        } else {
            popupContent += `Barrier: Unknown`;
        }

        marker.bindPopup(popupContent);
    });

    console.log(`Rendered ${playgrounds.length} playgrounds`);
}

// Toggle filter panel
window.toggleFilterPanel = function() {
    const panel = document.getElementById('filterPanel');
    panel.classList.toggle('open'); 
};

// Apply filters
window.applyFilters = function() {
    // Get filter states
    const barrierOnly = document.getElementById('filterBarrierOnly').checked;
    const selectedCategory = document.getElementById('filterCategory').value;

    // Filter playgrounds
    const filtered = allPlaygrounds.filter(pg => {
        // Check barrier filter
        const barrierMatch = barrierOnly ? pg.barrier === 'yes' : true;
        
        // Check category filter
        const categoryMatch = selectedCategory === 'all' || pg.category === selectedCategory;

        return barrierMatch && categoryMatch;
    });

    console.log(`Filtered: ${filtered.length} of ${allPlaygrounds.length} playgrounds`);
    
    // Re-render with filtered data
    renderPlaygrounds(filtered);
};

// Reset filters
window.resetFilters = function() {
    // Uncheck barrier filter
    document.getElementById('filterBarrierOnly').checked = false;
    
    // Reset category to "All"
    document.getElementById('filterCategory').value = 'all';

    // Reapply filters (shows all)
    applyFilters();
};
