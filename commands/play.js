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
					.setPlaceholder('🔴')
					.addOptions(
						{
							label: '🔴',
							description: 'Red Peg',
							value: 'red_peg',
						},
						{
							label: '🔵',
							description: 'Blue Peg',
							value: 'blue_peg',
						},
					)
				]			
			);

		const row3 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-2')
					.setPlaceholder('🔴')
					.addOptions(
						{
							label: '🔴',
							description: 'Red Peg',
							value: 'first_option',
						},
						{
							label: '🔵',
							description: 'Blue Peg',
							value: 'second_option',
						},
					)
				]			
			);

		const row4 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-3')
					.setPlaceholder('🔴')
					.addOptions(
						{
							label: '🔴',
							description: 'Red Peg',
							value: 'first_option',
						},
						{
							label: '🔵',
							description: 'Blue Peg',
							value: 'second_option',
						},
					)
				]			
			);

		const row5 = new ActionRowBuilder()
			.addComponents([
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector-4')
					.setPlaceholder('🔴')
					.addOptions(
						{
							label: '🔴',
							description: 'Red Peg',
							value: 'first_option',
						},
						{
							label: '🔵',
							description: 'Blue Peg',
							value: 'second_option',
						},
					)
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
