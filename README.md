# Albert the Proofreader - Chrome Extension

Albert the Proofreader is a Chrome extension designed to help users correct grammar, spelling mistakes, and enhance the clarity of their selected text in any browser window. This extension allows users to choose between using a local `Ollama` server or OpenAI for text correction, offering flexibility depending on available resources.

## Features

- Context menu integration to correct selected text directly in the browser.
- Support for both `Ollama` (local server) and `OpenAI` for text correction.
- Customizable options such as server URL, model name, and API keys.
- Dynamic loading of available models based on the selected server.
- Visual feedback (loading spinner) while corrections are being processed.

## Installation

1. Clone or download the repository containing the extension files.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click on **Load unpacked** and select the directory containing the extension's files.

## Usage

1. After installation, right-click on any selected text in the browser and choose **ALBERT the proofreader** from the context menu.
2. The selected text will be corrected based on your server and model preferences.
3. The corrected text will replace the original text in the web page.

## Configuration

1. Click on the extension icon in the toolbar and select **Options** to open the settings page.
2. Configure your preferred server:
   - **Ollama**: A local language model server.
   - **OpenAI**: Use GPT models from OpenAI.
3. For Ollama, input the server URL (default: `http://localhost:11434`) and select the model to use.
4. For OpenAI, provide your API key and select the desired model (e.g., GPT-4, GPT-3.5-turbo).

### Configuring CORS for Ollama

To enable CORS for Ollama by allowing all origins, you can use the following commands for different operating systems.

#### macOS
Use `launchctl` to set the environment variable:
```bash
launchctl setenv OLLAMA_ORIGINS "*"
```

To set this environment variable permanently:
```bash
echo 'launchctl setenv OLLAMA_ORIGINS "*"' >> ~/.zshrc
source ~/.zshrc
```

#### Linux

You can temporarily set the environment variable in the terminal using the following command:
```bash
export OLLAMA_ORIGINS="*"
```

To make this permanent (for future terminal sessions), add it to your `~/.bashrc` or `~/.bash_profile` file:
```bash
echo 'export OLLAMA_ORIGINS="*"' >> ~/.bashrc
```
Then, run:
```bash
source ~/.bashrc
```

For `zsh` users (default on some Linux distros):
```bash
echo 'export OLLAMA_ORIGINS="*"' >> ~/.zshrc
source ~/.zshrc
```

#### Windows

###### Command Prompt (temporary):
```cmd
set OLLAMA_ORIGINS=*
```

###### PowerShell (temporary):
```powershell
$env:OLLAMA_ORIGINS = "*"
```

To set this environment variable permanently in Windows, use the following PowerShell command:
```powershell
[System.Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", [System.EnvironmentVariableTarget]::Machine)
```
This will set the environment variable globally (for all users and sessions). Restart any open applications or command prompts for the changes to take effect.

## Options
The extension offers the following configurable options:

- **Server to use** : Select either Ollama (local) or OpenAI.
- **Ollama Server URL** : The URL for the local Ollama server (default: http://localhost:11434).
- **Model Name** : Select the model to use for text correction. The options will be dynamically loaded depending on the selected server.
- **OpenAI API Key** : Enter your OpenAI API key for using OpenAI's language models.

## How It Works
When a user selects text and invokes the ALBERT the proofreader option from the context menu:

1. A spinner is displayed to indicate that the text is being processed.
2. The selected text is sent to either the Ollama or OpenAI server, depending on the user’s preferences.
3. The corrected text is received from the server and replaces the original selection.
4. If the selected text cannot be modified, click on the extension icon in the address bar to make a popup appear with the latest correction.

## Ollama Server Integration

- The extension sends a POST request to the Ollama server with the selected text and the chosen model.
- Ensure that the Ollama server is running locally and CORS is properly configured.

## OpenAI Integration

- The extension uses the OpenAI API to send the selected text for correction.
- You must provide your OpenAI API key in the options for this functionality.

## Development

### Prerequisites
- Node.js (for local development)
- Chrome browser (or chromium like Arc)
- firefox browser ( not tested, this extension should work on Firefox.)

### Commands

To build the extension for development:
```bash
npm install
npm run build
``` 
To test the extension:
 1. Open Chrome, navigate to chrome://extensions/.
 2. Load the unpacked extension from the build/ directory.

## Known Issues
- **CORS with Ollama** : Ensure CORS is properly configured for the Ollama server to avoid issues with cross-origin requests.
- **Model Selection** : Ensure that the local server is running and available models are correctly listed.

## Contributing
Feel free to fork the repository, make your changes, and submit a pull request. Contributions and suggestions are welcome!

## License
This project is licensed under the MIT License.