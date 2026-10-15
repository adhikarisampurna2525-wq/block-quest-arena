# Block Quest Arena — Online Multiplayer

This is the renamed **Block Quest Arena** browser game plus its Socket.IO multiplayer server. Players can join the same room through the same website URL and room code. The project is not hosted publicly yet; you must run it or deploy it to get a public URL.

## Step-by-step: run it on your computer

1. Download and extract `Block-Quest-Arena-Online-Multiplayer.zip`.
2. Install **Node.js 18 or newer** from https://nodejs.org/ if it is not already installed.
3. Open the extracted `block-quest-public-multiplayer` folder.
4. In that folder, open a terminal/Command Prompt. On Windows, you can click the folder address bar, type `cmd`, and press Enter.
5. Run `npm install` and wait for it to finish.
6. Run `npm start`.
7. Open http://localhost:3000 in your browser.
8. Create or join a room in the game. To test on the same computer, open the site in another browser window and use the same room code.

## Step-by-step: let friends join from anywhere

1. Deploy this project to a hosting service that supports Node.js and WebSockets (for example Render, Railway, or a VPS).
2. Configure the service to install dependencies with `npm install` and start with `npm start`.
3. Wait for the hosting service to provide a public HTTPS URL.
4. Share that public URL and the room code with friends.

**Important:** Downloading this ZIP does not automatically publish the game to the internet. I have not deployed it, so there is no public live link yet. Voice chat needs HTTPS and microphone permission when deployed.

## Project contents

- `public/index.html` — the renamed game webpage
- `server.js` — room and multiplayer signaling server
- `package.json` — server dependencies and start command
