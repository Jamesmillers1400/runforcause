// Référence API Velo : https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {
import { fetch } from 'wetch';

// URL de votre base de données Firebase (chemin des participants)
const FIREBASE_URL = "https://runforcause1400-default-rtdb.europe-west1.firebasedatabase.app/participants.json";

$w.onReady(function () {
    // Charger les données dès l'ouverture de la page
    loadParticipantsData();

    // Actualiser automatiquement toutes les 5 secondes pour voir les positions en direct
    setInterval(() => {
        loadParticipantsData();
    }, 5000);
});

async function loadParticipantsData() {
    try {
        const response = await fetch(FIREBASE_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données Firebase");
        }

        const data = await response.json();

        if (data) {
            // Transformation des données Firebase en tableau exploitable
            const participantsArray = Object.keys(data).map(key => ({
                _id: key,
                name: data[key].name || "Anonyme",
                distanceKm: data[key].distanceKm || "0.000",
                lat: data[key].lat,
                lng: data[key].lng,
                lastUpdate: new Date(data[key].updatedAt).toLocaleTimeString()
            }));

            console.log("Participants en direct :", participantsArray);

            // Si vous ajoutez un élément Tableau nommé "#tableParticipants" sur votre page Wix, 
            // décommentez la ligne ci-dessous :
            // $w("#tableParticipants").rows = participantsArray;

        } else {
            console.log("Aucun participant en cours de route pour le moment.");
        }

    } catch (error) {
        console.error("Erreur de synchronisation Firebase :", error);
    }
}
	// Écrivez votre code JavaScript ici en utilisant l'API du framework Velo

	// Affichez « Hello World » :
	// console.log("Hello world!");

	// Appelez des fonctions sur des éléments de la page. Par exemple :
	// $w("#button1").label = « Cliquez‑moi ! »;

	// Cliquez sur « Tester » ou accédez à l'aperçu de votre site pour exécuter votre code

});