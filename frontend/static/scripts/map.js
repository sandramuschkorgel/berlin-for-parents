// frontend/static/scripts/map.js

document.addEventListener("DOMContentLoaded", function () {
    // Initialize map centered on Berlin
    const berlinCoords = [52.52, 13.405]; // lat, lon

    const map = L.map("map").setView(berlinCoords, 12);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ["a", "b", "c"],
        minZoom: 10,
        maxZoom: 18,
        tileSize: 256,
    }).addTo(map);

    // Optional marker to show Berlin center
    L.marker(berlinCoords).addTo(map).bindPopup("Berlin City Center");

    // 🚀 Fetch playgrounds from backend
    fetch("/api/playgrounds")
        .then(res => res.json())
        .then(playgrounds => {

            playgrounds.forEach(pg => {
                L.marker([pg.lat, pg.lon])
                    .addTo(map)
                    .bindPopup(`Playground ID: ${pg.id}`);
            });

        })
        .catch(err => console.error("Failed to load playgrounds", err));
});
