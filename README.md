# mastermind-bot

Discord Bot To Play Mastermind With Friends

Currently using discord.js v14 (https://discordjs.guide/)


# Getting Started With Development

- Node v.18.12.1 (https://nodejs.org/en/download/)
- Might wanna do an `npm install` from the root here...
- Set up your config.json (Might need token from me for shared dev server, or just roll your own)
    - `clientId` can be found in the "OAuth2" section of discord dev app
    - `guildId` can be found by right clicking on the server icon and "Copy ID" where bot as been added
    - `token` obtained in "Bot" section of discord dev app if reset is needed
- Run `node ./index.js` (You should see a console message that says "Ready!")

# Commands 

`/ping` - Bot replies with "Pong"... quick test to see if we are up and running

`/play` - Currently the main entry point for our Mastermind game

# TODO: 

- Add ability to reset game

- Add feature for remaining guesses (losing case)

- Add a way to see previous guesses (and responses)

- Organize things away from index.js
