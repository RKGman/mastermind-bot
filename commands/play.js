const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, StringSelectMenuBuilder, MessagePayload, Message, MessageReaction, MessageSelectMenu } = require('discord.js');
//const { SlashCommandBuilder } = require('@discordjs/builders');
const { startGame, processGame } = require('../services/mastermind');

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

		interaction
		var rv = processGame(2);
		
		const row2 = new ActionRowBuilder()
		.addComponents( [
			new ButtonBuilder()
				.setLabel('🔴')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId("peg-1-btn"), 
			new ButtonBuilder()
				.setLabel('🔵')
				.setStyle(ButtonStyle.Secondary)
				.setCustomId("peg-2-btn")
			]
		);

		const row3 = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('peg-selector')
					.setPlaceholder('Nothing selected')
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
					),
			);

		await interaction.reply({ content: 'You Ready?!', components: [row1, row2, row3] });
	},
};
