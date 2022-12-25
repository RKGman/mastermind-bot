/* 
Main entry point for the bot.  

You will probably need to create a config.json, for example:

{
    "clientId": "123456789987654321",
    "guildId": "123456789987654321",
    "token": "token-goes-here"
}
*/

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Set up the client and intents
const client = new Client({ intents: [GatewayIntentBits.Guilds]});

// ========= Set up the collection of commands =========
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
// ====================================================== 

// Current Guesses
const guesses = ["blue_peg", "green_peg", "red_peg", "yellow_peg"];

const guessDisplay = ["⭕", "⭕", "⭕", "⭕"];

// A message to let us know the bot spun up correctly...
client.once('ready', () => {
    console.log('Ready!');
});

// Event handler for when an incoming message is sent.  Can trigger things here.
client.on('messageCreate', async message => {
    console.log("We got a message: " + message.content);

    if (message.author.bot) {
        return;
    }
});

// Event handler for interactions from slash commands or buttons... See deploy-commands.js for more info on how commands are set up.
client.on('interactionCreate', async interaction => {
    console.log("We got an interaction: " + interaction.id);

    if (interaction.isStringSelectMenu()) {

        const selected = interaction.values[0];

        // TODO: Figure out if state can be kept here in index for now...
        if (interaction.customId == "peg-selector-1") {
            if (selected == "red_peg") {
                guesses[0] = "red_peg";              
                //await interaction.update('🔴' + "selected");
                await interaction.update("⭕, ⭕, ⭕, ⭕");
            } else if (selected == "blue_peg") {
                guesses[0] = "blue_peg";
                await interaction.update('🔵' + "selected");
            } else if (selected == "green_peg") {
                guesses[0] = "green_peg";
                await interaction.update('🟢' + "selected");
            }          
        }
    }	

    if (interaction.isButton()) {
        console.log("Button Press Detected...");
        if (interaction.customId == "start-game-btn") {
            interaction.reply({ content: 'Starting Game...', ephemeral: true });
        } else {
            interaction.reply({ content: 'You pressed a different button...', ephemeral: true });
        }
    }

    if (!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        await command.execute(interaction, guesses);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token); // This logs in as the bot and sets up all the client event handlers