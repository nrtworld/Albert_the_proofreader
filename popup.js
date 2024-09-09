document.addEventListener('DOMContentLoaded', () => {
    // Get the server response from chrome storage
    chrome.storage.local.get('serverResponse', (data) => {
        console.log('data server response' + data.serverResponse)
        if (data) {
            document.getElementById('response').textContent = data.serverResponse;
        } else {
            document.getElementById('response').textContent = "Aucune réponse disponible.";
        }
    });
});
