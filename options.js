// options.js
document.addEventListener('DOMContentLoaded', function () {
    const apiUrlInput = document.getElementById('api-url');
    const modelNameInput = document.getElementById('model-name');
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');

    // Charger les paramètres à partir du stockage et les afficher dans les champs d'entrée
    chrome.storage.sync.get(['apiUrl', 'modelName'], function (result) {
        if (result.apiUrl) {
            apiUrlInput.value = result.apiUrl;
        }
        if (result.modelName) {
            modelNameInput.value = result.modelName;
        }
    });

    // Sauvegarder les paramètres lorsque l'utilisateur clique sur le bouton "Save"
    saveButton.addEventListener('click', function () {
        const apiUrl = apiUrlInput.value;
        const modelName = modelNameInput.value;
        chrome.storage.sync.set({ apiUrl: apiUrl, modelName: modelName }, function () {
            status.textContent = 'Preferences saved successfully!';
            setTimeout(() => status.textContent = '', 2000);
        });
    });
});
