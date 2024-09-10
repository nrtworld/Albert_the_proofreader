document.addEventListener('DOMContentLoaded', function () {
    const apiUrlInput = document.getElementById('api-url');
    const modelNameInput = document.getElementById('model-name');
    const serverToUseSelect = document.getElementById('server-to-use');
    const openaiApiKeyInput = document.getElementById('openai-api-key');
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');

    // Charger les paramètres à partir du stockage et les afficher dans les champs d'entrée
    chrome.storage.sync.get(['apiUrl', 'modelName', 'serverToUse', 'openaiApiKey'], function (result) {
        if (result.apiUrl) {
            apiUrlInput.value = result.apiUrl;
        }
        if (result.modelName) {
            modelNameInput.value = result.modelName;
        }
        if (result.serverToUse) {
            serverToUseSelect.value = result.serverToUse;
        }
        if (result.openaiApiKey) {
            openaiApiKeyInput.value = result.openaiApiKey;
        }
    });

    // Sauvegarder les paramètres lorsque l'utilisateur clique sur le bouton "Save"
    saveButton.addEventListener('click', function () {
        const apiUrl = apiUrlInput.value;
        const modelName = modelNameInput.value;
        const serverToUse = serverToUseSelect.value;
        const openaiApiKey = openaiApiKeyInput.value;
        chrome.storage.sync.set({ apiUrl: apiUrl, modelName: modelName, serverToUse: serverToUse, openaiApiKey: openaiApiKey }, function () {
            status.textContent = 'Preferences saved successfully!';
                setTimeout(() => (status.textContent = ''), 2000);
            }
        );
    });
});
