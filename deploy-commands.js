// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js');

// mochi.jsのmodule.exportsを呼び出します。
const mochiFile = require('./commands/mochi.js');

// 環境変数としてapplicationId, guildId, tokenの3つが必要です
const { applicationId, guildId, token } = require('./config.json');

// 登録コマンドを呼び出してリスト形式で登録
const commands = [mochiFile.data.toJSON(), lfgFile.data.toJSON()];

// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(token);

// Discordサーバーにコマンドを登録
(async () => {
    try {
    // ↓↓↓ この行を追加！ ↓↓↓
    console.log(`${commands.length}個のコマンドの登録を開始します...`);

    await rest.put(
      Routes.applicationGuildCommands(applicationId, guildId),
      { body: commands },
    );

    console.log('サーバー固有のコマンドが登録されました！');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();