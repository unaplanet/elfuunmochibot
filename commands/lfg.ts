import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';


export default {
	data: new SlashCommandBuilder()
		.setName('lfg')
		.setDescription('指定したサーバーに募集メッセージを送ることができます。')
        
    .addStringOption( new SlashCommandStringOption().setName("content").setDescription("送信したいメッセージを入力してください。") ),
    
	execute: async function(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
            content:'フーン！',
            flags:MessageFlags.Ephemeral,
        });
        

        const channel = interaction.client.channels.cache.get(interaction.channelId);
        if ( channel?.isSendable() ){
        await channel.send({
            content: interaction.options.getString("content")!,
        });
        }
	},
};
