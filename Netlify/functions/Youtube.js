// netlify/functions/Youtube.js

const fetch = require('node-fetch'); // Pour faire des requêtes HTTP dans Node.js

exports.handler = async function(event, context) {
    // 1. Récupérer le mot-clé de recherche envoyé par le frontend
    const query = event.queryStringParameters.query || 'programmation'; // Valeur par défaut

    // 2. Récupérer la clé API YouTube (elle sera injectée par Netlify, pas visible ici)
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    // Vérifier si la clé API est bien configurée
    if (!YOUTUBE_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Clé API YouTube non configurée sur le serveur." }),
        };
    }

    // 3. Construire l'URL de l'API YouTube
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video`;

    try {
        // 4. Faire la requête à l'API YouTube
        const response = await fetch(youtubeApiUrl);
        const data = await response.json(); // Convertir la réponse en JSON

        // 5. Renvoyer les données au frontend
        return {
            statusCode: 200, // Tout s'est bien passé
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
    } catch (error) {
        // Gérer les erreurs si l'appel à YouTube échoue
        console.error("Erreur lors de l'appel à l'API YouTube:", error);
        return {
            statusCode: 500, // Erreur interne du serveur
            body: JSON.stringify({ error: "Échec de la récupération des vidéos de YouTube." }),
        };
    }
};
