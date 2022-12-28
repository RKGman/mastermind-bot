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
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

const pegOptions = ["🔵", "🟢", "🔴", "🟡", "🟠", "🟣", "⚪", "🟤"];

const secretCode = ["🟡", "🔴", "🟢", "🔵"];

// Current Guesses
const guesses = ["blue_peg", "green_peg", "red_peg", "yellow_peg"];

const guessDisplay = ["⭕", "⭕", "⭕", "⭕"];

const lastGuess = ["⭕", "⭕", "⭕", "⭕"];

const response = ["⭕", "⭕", "⭕", "⭕"];

var guessesRemaining = 10;

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
            var result = processGuess();

            // Handle invalid guess.
            if (result == false) {
                interaction.reply({ content: "Invalid Guess. Please Set 4 Pegs To Submit A Guess.", ephemeral: false });
                return;
            }

            // Get the response and last guess
            var replyString = getReplyString(interaction.user.username);

            if (isGameOver() == true) {
                if (guessesRemaining == -1) {
                    interaction.reply({ content: `${replyString}\r\rGAME OVER! THE BOTS HAVE TAKEN OVER! Try Again... Game Resetting...`, ephemeral: false });
                } else {
                    interaction.reply({ content: `${replyString}\r\rYOU WIN! Thanks For Saving The World! ... Game Resetting...`, ephemeral: false });

                }

                resetGame();

            } else {
                interaction.reply({ content: `${replyString}`, ephemeral: false });
            }

            resetResponseAndLastGuess();
        } else if (interaction.customId == "reset-btn") {
            interaction.reply({ content: 'Resetting Game...', ephemeral: false });

            resetGame();
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
    } else if (value == 'brown_peg') {
        guesses[position] = "brown_peg";
        guessDisplay[position] = '🟤';
    }
}

function resetGame() {
    // Get a new set of unique pegs, randomly selected
    var randomSelection = ["⭕", "⭕", "⭕", "⭕"];

    var randomPegPosition = Math.floor(Math.random() * pegOptions.length);

    randomSelection[0] = pegOptions[randomPegPosition];

    var remainingSelections = pegOptions.filter((data, index) => index !== randomPegPosition);

    randomPegPosition = Math.floor(Math.random() * remainingSelections.length);

    randomSelection[1] = remainingSelections[randomPegPosition];

    remainingSelections = remainingSelections.filter((data, index) => index !== randomPegPosition);

    randomPegPosition = Math.floor(Math.random() * remainingSelections.length);

    randomSelection[2] = remainingSelections[randomPegPosition];

    remainingSelections = remainingSelections.filter((data, index) => index !== randomPegPosition);

    randomPegPosition = Math.floor(Math.random() * remainingSelections.length);

    randomSelection[3] = remainingSelections[randomPegPosition];

    remainingSelections = remainingSelections.filter((data, index) => index !== randomPegPosition);

    // Update the secret code.
    for (var i = 0; i < secretCode.length; i++) {
        secretCode[i] = randomSelection[i];
    }

    resetResponseAndLastGuess();

    guessesRemaining = 10;
}

function resetResponseAndLastGuess() {
    for (var i = 0; i < response.length; i++) {
        response[i] = "⭕";
        lastGuess[i] = "⭕";
    }
}

function processGuess() {
    var result = true;

    // Check for valid response
    for (var x = 0; x < guessDisplay.length; x++) {
        if (guessDisplay[x] == "⭕") {
            result = false;
            break;
        }
    }

    if (result == true) {
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

        // Copy the last guess for the display
        for (var i = 0; i < guessDisplay.length; i++) {
            lastGuess[i] = guessDisplay[i];
        }

        guessesRemaining--;
    }

    return result;
}

function isGameOver() {
    var returnValue = true;

    for (var i = 0; i < response.length; i++) {
        if (response[i] != "🔴") {
            returnValue = false;
            break;
        }
    }

    if (guessesRemaining == -1) {
        returnValue = true;
    }

    return returnValue;
}

function getReplyString(username) {

    // Add the last guess
    var returnValue = "Last Guess: ";

    for (var i = 0; i < lastGuess.length; i++) {
        returnValue += `${lastGuess[i]} `;
    }

    returnValue += `\rGuess Submitted By -> ${username}`;

    returnValue += "\r\rResponse: ";

    // Sort and add the response pegs
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

    if (guessesRemaining < 0) {
        returnValue += `\rGuesses Remaining: 0`;
    } else {
        returnValue += `\rGuesses Remaining: ${guessesRemaining}`;
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