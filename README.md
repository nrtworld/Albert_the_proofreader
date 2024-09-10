# ALBERT the Proofreader - Chrome Extension

ALBERT is a Chrome extension designed to help users improve their writing by selecting text and correcting grammar, spelling, and syntax errors. The extension uses a local language model (LLM) running on Ollama to provide accurate and contextual corrections.

## Features

- **Context Menu Integration**: Right-click to select any text on a webpage and get instant corrections.
- **Customizable LLM Settings**: Configure your preferred model and API endpoint for text correction.
- **Real-time Feedback**: Corrections are applied directly on the page, providing a seamless user experience.
- **Loading Indicator**: A dynamic loader shows the progress while the text is being corrected.

## How It Works

1. **Select Text**: Highlight the text on any webpage that you want to correct.
2. **Context Menu**: Right-click and choose "ALBERT the proofreader" from the context menu.
3. **Processing**: The extension sends the selected text to the LLM server running on your machine.
4. **Correction**: The LLM processes the text and returns a corrected version.
5. **Apply Correction**: The selected text is replaced with the corrected version directly on the webpage.

## Installation

To use this extension, follow these steps:

1. Clone or download the repository containing this extension.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing the extension files.
5. The extension should now appear in your list of installed extensions.

## Setup

Before using the extension, make sure you have the following requirements set up:

- **Ollama**: The local LLM server must be installed and running on your machine.
- **Model and API URL Configuration**: Configure the model and API URL in the extension settings.

### Configuration

By default, the extension connects to a local server running at `http://localhost:11434` and uses the model `llama3.1:8b`. You can customize these settings:

1. Open the Chrome extension settings for ALBERT.
2. Set the `API URL` and `Model Name` to your desired values.

## Usage

1. Highlight the text you want to correct.
2. Right-click and select "ALBERT the proofreader" from the context menu.
3. A loader will appear indicating that the text is being processed.
4. Once processed, the selected text will be replaced with the corrected version.

## Error Handling

If there is an error while connecting to the server or processing the text, the extension will:

- Display an error message to the user.
- Remove the loader to ensure the UI remains clean.

## Permissions

The extension requires the following permissions:

- `contextMenus`: To add a context menu item for text correction.
- `scripting`: To inject scripts for UI updates and applying corrections.
- `storage`: To store user preferences and server responses.

## Contributing

If you have any suggestions, bug reports, or feature requests, feel free to open an issue or submit a pull request. Contributions are welcome!

## License

This project is licensed under the MIT License.