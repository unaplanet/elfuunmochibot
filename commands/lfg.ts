import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';


export default {
	data: new SlashCommandBuilder()
		.setName('lfg')
		.setDescription('指定したサーバーに募集メッセージを送ることができます。')
        
    .addStringOption( new SlashCommandStringOption().setName("serverid").setDescription("送信したいサーバーIDを入力してください") ),
    
	execute: async function(interaction) {
		await interaction.reply('フーン！');
	},
};
