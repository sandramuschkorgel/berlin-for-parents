document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.getElementById('playgrounds-grid');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    // Fetch playgrounds using shared API function
    fetchFromAPI('/api/playgrounds')
        .then(playgrounds => {
            console.log(`Loaded ${playgrounds.length} playgrounds`);
            
            // Hide loading
            loadingDiv.style.display = 'none';

            // Render playgrounds
            if (playgrounds.length === 0) {
                gridContainer.innerHTML = '<p>No playgrounds found.</p>';
                return;
            }

            gridContainer.innerHTML = playgrounds.map(pg => `
                <article class="pg-card">
                    <div class="pg-content">
                        <h2 class="pg-title">${pg.name || 'Unnamed Playground'}</h2>
                        <p>ID: ${pg.id}</p>
                        <p>Latitude: ${pg.lat.toFixed(6)}</p>
                        <p>Longitude: ${pg.lon.toFixed(6)}</p>
                    </div>
                </article>
            `).join('');
        })
        .catch(err => {
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Failed to load playgrounds. Make sure the backend is running at ' + CONFIG.API_BASE_URL;
        });
});
