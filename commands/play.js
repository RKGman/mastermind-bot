const { MessageActionRow, MessageButton, MessagePayload, Message, MessageReaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start a game of Mastermind'),
	async execute(interaction) {
		const row1 = new MessageActionRow()
			.addComponents( [
				new MessageButton()
					.setLabel('Start')
					.setStyle('PRIMARY')
					.setCustomId("start-game-btn"), 
				new MessageButton()
					.setLabel('End')
					.setStyle('SECONDARY')
					.setCustomId("end-game-btn")
				]
			);

		const row2 = new MessageActionRow()
		.addComponents( [
			new MessageButton()
				.setLabel('🔴')
				.setStyle('SECONDARY')
				.setCustomId("peg-1-btn"), 
			new MessageButton()
				.setLabel('🔵')
				.setStyle('SECONDARY')
				.setCustomId("peg-2-btn")
			]
		);

		await interaction.reply({ content: 'You Ready?!', components: [row1, row2] });
	},
};
