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
            popupContent += `Barrier: ${pg.barrier_type}<br>`;
        }

        if (pg.tags && Object.keys(pg.tags).length > 0) {
            for (const [key, value] of Object.entries(pg.tags)) {
                const displayKey = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());
                
                popupContent += `${displayKey}: ${value}<br>`;
            }
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
    const filters = {
        barrier: document.getElementById('filterBarrier').checked,
        category: document.getElementById('filterCategory').value,
        wheelchair: document.getElementById('filterWheelchair').checked,
        indoor: document.getElementById('filterIndoor').checked,
        dog: document.getElementById('filterDog').value,
        material: document.getElementById('filterMaterial').value
    };

    const filtered = allPlaygrounds.filter(pg => {
        if (filters.barrier && pg.barrier !== 'yes') return false;
        if (filters.category !== 'all' && pg.category !== filters.category) return false;
        if (filters.wheelchair && (!pg.tags || !['yes', 'limited'].includes(pg.tags.wheelchair))) return false;
        if (filters.indoor && (!pg.tags || pg.tags.indoor !== 'yes')) return false;
        if (filters.dog !== 'all' && (!pg.tags || pg.tags.dog !== filters.dog)) return false;
        if (filters.material !== 'all' && (!pg.tags || pg.tags.material !== filters.material)) return false;

        return true;
    });

    console.log(`Filtered: ${filtered.length} of ${allPlaygrounds.length} playgrounds`);

    renderPlaygrounds(filtered);
};

// Reset filters
window.resetFilters = function() {
    document.getElementById('filterBarrier').checked = false;
    document.getElementById('filterWheelchair').checked = false;
    document.getElementById('filterIndoor').checked = false;
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterDog').value = 'all';
    document.getElementById('filterMaterial').value = 'all';

    applyFilters();
};
