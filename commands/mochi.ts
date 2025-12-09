// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
import { SlashCommandBuilder } from 'discord.js';

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
export default {
	data: new SlashCommandBuilder()
		.setName('mochi')
		.setDescription('エルフーンちゃんをもちもちすることができます。'),
	execute: async function(interaction) {
		await interaction.reply('フーン！');
	},
};

// module.exportsの補足
// キー・バリューの連想配列のような形で構成されています。
//
// module.exports = {
//    キー: バリュー,
//    キー: バリュー,
// };
//