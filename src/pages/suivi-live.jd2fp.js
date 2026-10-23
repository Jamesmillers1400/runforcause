// Référence API Velo : https://www.wix.com/velo/reference/api-overview/introduction
import wixData from 'wix-data';

let watchId = null;
let runnerId = "";
let runnerName = "";

$w.onReady(function () {
    // Gestion du bouton Démarrer
    $w("#button11").onClick(() => {
        runnerName = $w("#input36").value;
        
        if (!runnerName || runnerName.trim() === "") {
            $w("#text16").text = "Veuillez entrer votre nom ou prénom avant de démarrer.";
            return;
        }

        runnerId = runnerName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        startTracking();
    });
    
    // Gestion du bouton Arrêter
    $w("#button12").onClick(() => {
        stopTracking();
    });
});

function startTracking() {
    // Diagnostic dans la console du navigateur
    console.log("window existe ?", typeof window !== 'undefined');
    console.log("navigator existe ?", typeof navigator !== 'undefined');
    
    // On force l'accès via l'objet window du navigateur
    const nav = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;
    
    if (nav && nav.geolocation) {
        $w("#text16").text = `C'est parti ${runnerName} ! Recherche du signal GPS...`;
        
        $w("#input36").disable();
        $w("#button11").disable();

        watchId = nav.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                $w("#text16").text = `En direct - Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
                updatePositionInWix(lat, lon);
            },
            (error) => {
                $w("#text16").text = "Erreur GPS : " + error.message;
                console.error("Détail erreur GPS :", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 10000
            }
        );
    } else {
        $w("#text16").text = "Erreur : Géolocalisation non disponible sur ce support (testez sur le site publié).";
    }
}
async function updatePositionInWix(lat, lon) {
    try {
        let results = await wixData.query("SuiviLive")
            .eq("runnerId", runnerId)
            .find();

        let toSave = {
            title: runnerName,
            runnerId: runnerId,
            latitude: lat,
            longitude: lon,
            lastUpdate: new Date()
        };

        if (results.items.length > 0) {
            toSave._id = results.items[0]._id;
            await wixData.update("SuiviLive", toSave);
        } else {
            await wixData.insert("SuiviLive", toSave);
        }
    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
    }
}

function stopTracking() {
    try {
        const nav = typeof window !== 'undefined' ? window.navigator : (typeof navigator !== 'undefined' ? navigator : null);
        if (watchId !== null && watchId !== undefined) {
            if (nav && nav.geolocation) {
                nav.geolocation.clearWatch(watchId);
            }
            watchId = null;
        }
    } catch (e) {
        console.error("Erreur clearWatch :", e);
    }

    // Remet l'interface dans son état initial
    $w("#text16").text = "Suivi arrêté.";
    try { $w("#input36").enable(); } catch(err) {}
    try { $w("#button11").enable(); } catch(err) {}
}