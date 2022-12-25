const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
const { processGame } = require('../services/mastermind');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start a game of Mastermind'),
	async execute(interaction) {
		const row1 = new ActionRowBuilder()
			.addComponents( [
				new ButtonBuilder()
					.setLabel('Start')
					.setStyle(ButtonStyle.Primary)
					.setCustomId("start-game-btn"), 
				new ButtonBuilder()
					.setLabel('End')
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("end-game-btn")
				]
			);


		// TODO: Set up a starting configuration
		// TODO: Add a row of selectors
		// TODO: "Submit" a guess
		// TODO: Set up a reply

		// Possibly pass in "state" and guess? 
		var rv = processGame(2);
		
		// TODO: Will have to handle a "guess state"... possible handle a "submit guess state"
		const row2 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-1')
					.setPlaceholder('Peg Color 1 GUESS')
					.addOptions(getOptions())
				]			
			);

		const row3 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-2')
					.setPlaceholder("Peg Color 2 GUESS")
					.addOptions(getOptions())
				]			
			);

		const row4 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-3')
					.setPlaceholder("Peg Color 3 GUESS")
					.addOptions(getOptions())
				]			
			);

		const row5 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-4')
					.setPlaceholder("Peg Color 4 GUESS")
					.addOptions(getOptions())
				]			
			);

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Response')
			.setDescription('Some description here');

		// Apparently can only have a maximum of 5 rows... which might be perfect for our "form"
		await interaction.reply({ content: 'You Ready?!', embeds: [embed], components: [row1, row2, row3, row4, row5] });
	},
};

function getOptions() {
	return [{
		label: '🔵 - Blue',
		description: 'Blue Peg',
		value: 'blue_peg', // TODO: Can we enum these values?  Maybe constant them in another file
	},
	{
		label: '🟢 - Green',
		description: 'Green Peg',
		value: 'green_peg',
	},
	{
		label: '🔴 - Red',
		description: 'Red Peg',
		value: 'red_peg',
	},
	{
		label: '🟡 - Yellow',
		description: 'Yellow Peg',
		value: 'yellow_peg',
	},
	{
		label: '🟠 - Orange',
		description: 'Orange Peg',
		value: 'orange_peg',
	},
	{
		label: '🟣 - Purple',
		description: 'Purple Peg',
		value: 'purple_peg',
	},
	{
		label: '⚪ - White',
		description: 'White Peg',
		value: 'white_peg',
	},
	{
		label: '⚫ - Black',
		description: 'Black Peg',
		value: 'black_peg',
	}];
}

function getPlaceholder(value) {
	if (value == 'blue_peg') {
		return '🔵 - Blue';
	} else if (value == 'green_peg') {
		return '🟢 - Green';
	} else if (value == 'red_peg') {
		return '🔴 - Red';
	} else if (value == 'green_peg') {
		return '🟢 - Green';
	} else if (value == 'yellow_peg') {
		return '🟡 - Yellow';
	} else if (value == 'orange_peg') {
		return '🟠 - Orange';
	} else if (value == 'purple_peg') {
		return '🟣 - Purple';
	} else if (value == 'white_peg') {
		return '⚪ - White';
	} else if (value == 'black_peg') {
		return '⚫ - Black';
	}
}
