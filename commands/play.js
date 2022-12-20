const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start a game of Mastermind'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents( [
				new MessageButton()
					.setCustomId('start')
					.setLabel('Start')
					.setStyle('PRIMARY')
					.setCustomId("start-game-btn"), 
				new MessageButton()
					.setCustomId('end')
					.setLabel('End')
					.setStyle('SECONDARY')
					.setCustomId("end-game-btn")
				]
			);

		await interaction.reply({ content: 'You Ready?!', components: [row] });
	},
};
