// Script Variant 1
document.getElementById('extractBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('appUrl').value.trim();
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error');
    const loader = document.getElementById('loader');

    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    resultsDiv.innerHTML = '';

    if (!urlInput) {
        errorDiv.textContent = 'Please enter an App Store URL.';
        errorDiv.classList.remove('hidden');
        return;
    }

    const match = urlInput.match(/id(\d+)/);
    if (!match) {
        errorDiv.textContent = 'Invalid App Store URL. Could not find App ID.';
        errorDiv.classList.remove('hidden');
        return;
    }

    const appId = match[1];
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`https://itunes.apple.com/lookup?id=${appId}`);
        const data = await response.json();

        loader.classList.add('hidden');

        if (!data.results || data.results.length === 0) {
            errorDiv.textContent = 'No application found with this ID.';
            errorDiv.classList.remove('hidden');
            return;
        }

        const app = data.results[0];
        const baseIconUrl = app.artworkUrl512 || app.artworkUrl100;
        
        if (!baseIconUrl) {
            errorDiv.textContent = 'No icons found for this application.';
            errorDiv.classList.remove('hidden');
            return;
        }

        const sizes = [60, 100, 180, 512, 1024];
        sizes.forEach(size => {
            const resizedUrl = baseIconUrl.replace(/512x512bb|100x100bb/, `${size}x${size}bb`);
            const card = document.createElement('div');
            card.className = 'icon-card';
            card.innerHTML = `
                <img src="${resizedUrl}" alt="${size}x${size}">
                <p><strong>${size}x${size}</strong></p>
                <a href="${resizedUrl}" target="_blank">Download</a>
            `;
            resultsDiv.appendChild(card);
        });

        resultsDiv.classList.remove('hidden');
    } catch (err) {
        loader.classList.add('hidden');
        errorDiv.textContent = 'Failed to fetch data from iTunes API. Check internet connection.';
        errorDiv.classList.remove('hidden');
    }
});