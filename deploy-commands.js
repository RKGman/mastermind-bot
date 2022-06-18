/* 
This file is used to deploy all commands under the commands directory.  See ping.js for an example to set up a slash command.
To deploy this to a specific server (guild), update the guildId in the config.json and run `node deploy-commands.js` 

NOTE: Permissions for applications.commands must be set in the oauth section for the bot (in addition to the bot of course when getting url to add to server)

You will probably need to create a config.json, for example:

{
	"clientId": "123456789987654321",
	"guildId": "123456789987654321",
	"token": "token-goes-here"
}
*/

const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const rest = new REST({ version: '9' }).setToken(token);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);