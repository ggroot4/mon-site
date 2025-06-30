document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        alert("Veuillez entrer quelque chose à chercher !");
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Chargement des vidéos...'; // Message d'attente

    try {
        // C'est ici qu'on va appeler notre fonction serverless
        // L'URL exacte dépendra de comment vous la nommez et où vous la déployez
        // Par convention, souvent les fonctions serverless sont dans /api/nom-de-la-fonction
        const response = await fetch(`/api/Youtube?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur du serveur: ${response.status} - ${errorData.error || response.statusText}`);
        }

        const data = await response.json();

        resultsDiv.innerHTML = ''; // Nettoie le message de chargement
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const description = item.snippet.description;
                const thumbnailUrl = item.snippet.thumbnails.high.url;

                const videoElement = document.createElement('div');
                videoElement.className = 'video-item';
                videoElement.innerHTML = `
                    <h3>${title}</h3>
                    <img src="${thumbnailUrl}" alt="${title}">
                    <p>${description}</p>
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Regarder sur YouTube</a>
                `;
                resultsDiv.appendChild(videoElement);
            });
        } else {
            resultsDiv.innerHTML = 'Aucune vidéo trouvée pour cette recherche.';
        }

    } catch (error) {
        console.error("Erreur lors de la recherche YouTube:", error);
        resultsDiv.innerHTML = `Erreur : Impossible de charger les vidéos. (${error.message})`;
    }
});
