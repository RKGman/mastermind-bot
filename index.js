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

const secretCode = ["🟡", "🔴", "🟢", "🔵"];

// Current Guesses
const guesses = ["blue_peg", "green_peg", "red_peg", "yellow_peg"];

const guessDisplay = ["⭕", "⭕", "⭕", "⭕"];

const response =  ["⭕", "⭕", "⭕", "⭕"];

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
            updateGuesses(selected, 0);                  
        } else if (interaction.customId == "peg-selector-2") {
            updateGuesses(selected, 1);
        } else if (interaction.customId == "peg-selector-3") {
            updateGuesses(selected, 2);
        } else if (interaction.customId == "peg-selector-4") {
            updateGuesses(selected, 3);
        }  

        await updateDisplay(interaction);
    }	

    if (interaction.isButton()) {
        console.log("Button Press Detected...");
        if (interaction.customId == "submit-btn") {
            // Process the guess
            processGuess();
            var responseString = getResponse();

            if (isGameOver() == true) {
                interaction.reply({ content: `YOU WIN : ${responseString}`, ephemeral: true });

            } else {
                interaction.reply({ content: `Response : ${responseString}`, ephemeral: true });

            }

            resetResponse();
        } else {
            // TODO: Reset the game...
            interaction.reply({ content: 'Resetting Game...', ephemeral: true });
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
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Helper methods

async function updateDisplay(interaction) {
        await interaction.update(`${guessDisplay[0]} ${guessDisplay[1]}  ${guessDisplay[2]} ${guessDisplay[3]}`); 
}

function updateGuesses(value, position) {
    if (value == 'blue_peg') {
		guesses[position] = "blue_peg";   
        guessDisplay[position] = '🔵'; 
	} else if (value == 'green_peg') {
		guesses[position] = "green_peg";
        guessDisplay[position] = '🟢'; 
	} else if (value == 'red_peg') {
		guesses[position] = "red_peg";   
        guessDisplay[position] = '🔴';  
	} else if (value == 'yellow_peg') {
        guesses[position] = "yellow_peg";   
        guessDisplay[position] = '🟡'; 
	} else if (value == 'orange_peg') {
        guesses[position] = "orange_peg";   
        guessDisplay[position] = '🟠';
	} else if (value == 'purple_peg') {
        guesses[position] = "purple_peg";   
        guessDisplay[position] = '🟣';
	} else if (value == 'white_peg') {
        guesses[position] = "white_peg";   
        guessDisplay[position] = '⚪';
	} else if (value == 'black_peg') {
        guesses[position] = "black_peg";   
        guessDisplay[position] = '⚫';
	} 
}

function resetResponse() {
    for (var i = 0; i < response.length; i++) {
        response[i] = "⭕";
    }
}

function processGuess() {
    for (var x = 0; x < secretCode.length; x++) {
        var matchFound = false;

        for (var y = 0; y < guessDisplay.length; y++) {
            if (matchFound) {
                break; // TODO: Handel duplicates? For now we will only handle unique pegs.
            }
           
            if (guessDisplay[y] == secretCode[x]) {

                // If the peg matches position exactly, add a red peg to the response.
                if (x == y) {
                    addValueToResponse("🔴");
                } else { // Otherwise, the peg matches but isn't in the right spot.
                    addValueToResponse("⚪");
                }

                matchFound = true;
            }
        }
    }
}

function isGameOver() {
    var returnValue = true;

    for (var i = 0; i< response.length; i++) {
        if (response[i] != "🔴") {
            returnValue = false;
            break;
        }
    }

    return returnValue;
}

function getResponse() {
    var returnValue = "";

    var totalRed = 0;
    var totalWhite = 0;
    var totalBlank = 0;

    for (var i = 0; i < response.length; i++) {
        if (response[i] == "🔴") {
            totalRed++;
        } else if (response[i] == "⚪") {
            totalWhite++;
        } else {
            totalBlank++;
        }
    }

    for (var i = 0; i < totalRed; i++) {
        returnValue += "🔴 ";
    }

    for (var i = 0; i < totalWhite; i++) {
        returnValue += "⚪ ";
    }

    for (var i = 0; i < totalBlank; i++) {
        returnValue += "⭕ ";
    }

    return returnValue;
}

function addValueToResponse(result) {
    for (var i = 0; i < response.length; i++) {
        if (response[i] == "⭕") {
            response[i] = result;
            break;
        }
    }
}

// This logs in as the bot and sets up all the client event handlers
client.login(token); 