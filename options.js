document.addEventListener('DOMContentLoaded', function () {
    const apiUrlInput = document.getElementById('api-url');
    const modelNameInput = document.getElementById('model-name');
    const serverToUseSelect = document.getElementById('server-to-use');
    const openaiApiKeyInput = document.getElementById('openai-api-key');
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');

    // Fonction pour afficher ou cacher les champs en fonction du serveur sélectionné
    function toggleFieldsVisibility() {
        const serverToUse = serverToUseSelect.value;
        if (serverToUse === 'ollama') {
            apiUrlInput.parentElement.style.display = 'block';  // Afficher "api-url"
            openaiApiKeyInput.parentElement.style.display = 'none';  // Masquer "openai-api-key"
        } else if (serverToUse === 'openai') {
            apiUrlInput.parentElement.style.display = 'none';  // Masquer "api-url"
            openaiApiKeyInput.parentElement.style.display = 'block';  // Afficher "openai-api-key"
        }
    }

    // Fonction pour récupérer les noms de modèles pour Ollama
    async function fetchOllamaModels() {
        try {
            console.log('Récupération des modèles d\'Ollama...');
            const response = await fetch('http://localhost:11434/api/tags');
            if (response.ok) {
                const data = await response.json();
                return data.models.map(model => model.name);  // En supposant que la réponse contient un champ 'name'
            } else {
                console.error('Échec de la récupération des modèles d\'Ollama');
                return [];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des modèles :', error);
            return [];
        }
    }

    // Remplir la liste déroulante des noms de modèles en fonction du serveur sélectionné
    async function populateModelNames(server, savedModelName = null) {
        modelNameInput.innerHTML = '';  // Effacer les options existantes
        let modelOptions = [];

        if (server === 'ollama') {
            modelOptions = await fetchOllamaModels();
        } else if (server === 'openai') {
            modelOptions = ["gpt-4o", "gpt-4o-mini", "gpt-4", "gpt-3.5-turbo"];
        }

        modelOptions.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option;
            optElement.textContent = option;
            modelNameInput.appendChild(optElement);
        });

        // Sélectionner le modèle précédemment sauvegardé s'il est dans la liste
        if (savedModelName && modelOptions.includes(savedModelName)) {
            modelNameInput.value = savedModelName;
        }
    }

    // Initialiser les options à partir du stockage
    chrome.storage.sync.get(['apiUrl', 'modelName', 'serverToUse', 'openaiApiKey'], async function (result) {
        if (result.apiUrl) {
            apiUrlInput.value = result.apiUrl;
        }
        if (result.serverToUse) {
            serverToUseSelect.value = result.serverToUse;
            toggleFieldsVisibility();  // Ajuster la visibilité des champs en fonction du serveur stocké
            
            // Remplir les modèles en fonction du serveur stocké et pré-sélectionner le modèle si disponible
            await populateModelNames(result.serverToUse, result.modelName);
        }
        if (result.openaiApiKey) {
            openaiApiKeyInput.value = result.openaiApiKey;
        }
    });

    // Mettre à jour la liste déroulante des noms de modèles et la visibilité des champs lorsque le serveur à utiliser est modifié
    serverToUseSelect.addEventListener('change', function () {
        populateModelNames(serverToUseSelect.value);
        toggleFieldsVisibility();  // Ajuster la visibilité des champs
    });

    // Sauvegarder les préférences lorsque l'utilisateur clique sur le bouton "Save"
    saveButton.addEventListener('click', async function () {
        const apiUrl = apiUrlInput.value;
        const modelName = modelNameInput.value;
        const serverToUse = serverToUseSelect.value;
        const openaiApiKey = openaiApiKeyInput.value;

        // Sauvegarder les paramètres
        chrome.storage.sync.set({ apiUrl: apiUrl, modelName: modelName, serverToUse: serverToUse, openaiApiKey: openaiApiKey }, async function () {
            status.textContent = 'Preferences saved successfully!';
            setTimeout(() => (status.textContent = ''), 2000);

            // Envoyer une requête à Ollama si le serveur sélectionné est 'ollama'
            if (serverToUse === 'ollama') {
                try {
                    const response = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ model: modelName })
                    });

                    if (response.ok) {
                        console.log('Requête envoyée avec succès à Ollama.');
                    } else {
                        console.error('Erreur lors de l\'envoi de la requête à Ollama.');
                    }
                } catch (error) {
                    console.error('Erreur réseau lors de l\'envoi de la requête à Ollama:', error);
                }
            }
        });
    });

    // Initialiser la visibilité des champs
    toggleFieldsVisibility();
});
