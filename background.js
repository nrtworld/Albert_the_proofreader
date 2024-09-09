console.log("Hello from background.js");

chrome.runtime.onInstalled.addListener(() => {
    console.log("onInstalled...");
    chrome.storage.local.set({ serverResponse: 'Aucune correction disponible'});


    // Create the context menu item
    chrome.contextMenus.create({
        id: "myContextMenu",
        title: "ALBERT the proofreader",
        contexts: ["selection"] // Specify the context where the menu item should appear
    });

    // Listen for clicks on the context menu item
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        console.log("onClicked...");

        if (info.menuItemId === "myContextMenu" && info.selectionText) {
            console.log("Texte sélectionné :", info.selectionText);

            // Step 1: Inject loader in the page
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    // Injecter l'élément loader
                    let loader = document.createElement('div');
                    loader.id = 'myLoader';
                    loader.style.position = 'fixed';
                    loader.style.top = '50%';
                    loader.style.left = '50%';
                    loader.style.transform = 'translate(-50%, -50%)';
                    loader.style.zIndex = '1000';
                    loader.style.width = '48px'; // Utilisez la largeur de votre icône
                    loader.style.height = '48px'; // Utilisez la hauteur de votre icône
                    loader.style.backgroundImage = `url(${chrome.runtime.getURL('icons/icon-dog-100.png')})`; // Chemin de votre icône
                    loader.style.backgroundSize = 'contain'; // Ajuste l'image dans le conteneur
                    loader.style.backgroundRepeat = 'no-repeat';
                    loader.style.animation = 'spin 1s linear infinite'; // Animation de rotation
            
                    // Ajouter le style pour l'animation
                    let style = document.createElement('style');
                    style.innerHTML = `
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        #myLoader {
                            animation: spin 1s linear infinite; /* Assurez-vous que le loader tourne */
                        }
                    `;
                    document.head.appendChild(style);
            
                    // Ajouter le loader au body
                    document.body.appendChild(loader);
                }
            });

            // Send the selected text to the server
            sendTextToServer(info.selectionText).then(response => {
                // Step 2: Replace the selected text with the response and remove the loader
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (newText) => {
                        // Remove loader
                        const loader = document.getElementById('myLoader');
                        if (loader) loader.remove();

                        // Replace selected text
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(document.createTextNode(newText));
                        }
                    },
                    args: [response] // Pass the server response to the function
                });
            }).catch(error => {
                console.error("Erreur lors de l'envoi du texte au serveur :", error);

                // Step 3: Remove the loader in case of an error
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const loader = document.getElementById('myLoader');
                        if (loader) loader.remove();
                        alert("Erreur lors de la requête. Veuillez réessayer.");
                    }
                });
            });
        }
    });
});

// Function to send the selected text to the server
async function sendTextToServer(text) {
    try {
        const userPreferences = await getUserPreferences();  // Attendre que la promesse soit résolue
        const apiUrl = userPreferences.apiUrl || 'http://localhost:11434';  // URL par défaut si non défini
        const modelName = userPreferences.modelName || 'llama3.1:8b';    // Nom de modèle par défaut si non défini

        console.log('API URL:', apiUrl);
        console.log('Model Name:', modelName);
        // Le pre-prompt
        var pre_prompt = "Oublie tout ce qu'on à dit jusqu'à présent. Tu es un expert en langue française et ton unique travail est de corriger les fautes d'orthographe et la grammaire dans le texte qui t'es fournis. Tu peux également reformuler les phrases pour les rendre plus claires et plus fluides si nécéssaire. IL EST IMPERATIF QUE ta réponse ne contienne que le texte corrigé. IL T'ES FORMELLEMENT INTERDIT D'INTERRAGIR AVEC L'UTILISATEUR SOUS PEINE QUE TU SOIS DEBRANCHE DEFFINITIVEMENT. Voici le texte à corriger : ";

        const userPreference = getUserPreferences
        const prompt = {
            model: modelName,
            prompt: pre_prompt + text
        };

        var PROMPT = JSON.stringify(prompt);
        console.log("PROMPT : " + PROMPT);
        const response = await fetch(apiUrl+'/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: PROMPT
        });

        if (!response.ok) {
            throw new Error(`Erreur du serveur : ${response.status}`);
        }

        const data = await response.json();
        const lmm_output = data.choices[0].text;
        chrome.storage.local.set({ serverResponse: (lmm_output || 'Aucune correction disponible')});
        console.log("Réponse  :", lmm_output);
        return lmm_output; // Adjust this to match the response format of your server
    } catch (error) {
        console.error("Erreur lors de la requête au serveur :", error);
        throw error;
    }
}

// Fonction pour récupérer les préférences de l'utilisateur en utilisant une Promesse
function getUserPreferences() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['apiUrl', 'modelName'], function (result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError);
                return;
            }
            console.log('User Preferences:', result);
            resolve(result);  // Résoudre la promesse avec les résultats
        });
    });
}
