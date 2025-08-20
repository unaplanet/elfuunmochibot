
// mochi.jsのmodule.exportsを呼び出します。
const mochiFile = require('./commands/mochi.js');

// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits,  ChannelType } = require('discord.js');
// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token, notificationChannelId, targetVoiceChannelId } = require('./config.json');
// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, // サーバーでのメッセージに関する情報を受け取る許可
    GatewayIntentBits.MessageContent, // メッセージの"内容"を読み取る許可
    GatewayIntentBits.GuildVoiceStates // ボイスチャンネルの状態を監視する許可
  ]
});

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, c => {
	console.log(`フ～ン！(準備ok! ${c.user.tag}がログインします。)`);
});


//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, async interaction => {

    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了します
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断しています
    if (!interaction.isChatInputCommand()) return;

    // mochiコマンドに対する処理
    if (interaction.commandName === mochiFile.data.name) {
        try {
            await mochiFile.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
            } else {
                await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
            }
        }
    } else {
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
    }
});

// メッセージが作成されるたびに実行される
client.on('messageCreate', msg => {
  // ボット自身のメッセージは無視する
  if (msg.author.bot) {
    return;
  }

  // メッセージの内容が 'ping' だったら 'Pong!' と返信する
  if (msg.content === 'エル') {
    msg.reply('フーン！');
  }
});

// ボイスチャンネルの状態が変化したときに実行される
client.once('ready', () => {
    console.log(`${client.user.tag} がログインしました！`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (!notificationChannelId || !targetVoiceChannelId) {
        console.error('config.jsonに必要なIDが設定されていません。');
        return;
    }

    const notificationChannel = client.channels.cache.get(notificationChannelId);
    if (!notificationChannel || notificationChannel.type !== ChannelType.GuildText) {
        return;
    }

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    // 通話開始 (0人 → 1人になった時)
    if (newChannel?.id === targetVoiceChannelId && newChannel.members.size === 1 && oldChannel?.id !== targetVoiceChannelId) {
        const member = newState.member;
        const message = `フーン！(📞 **<#${newChannel.id}>** で通話が開始されました！ (参加者: ${member.displayName}))`;
        notificationChannel.send(message);
    }

    // 通話終了 (1人 → 0人になった時)
    if (oldChannel?.id === targetVoiceChannelId && oldChannel.members.size === 0 && newChannel?.id !== targetVoiceChannelId) {
        const message = `フーン！(🌙 **<#${oldChannel.id}>** の通話が終了しました。)`;
        notificationChannel.send(message);
    }
});

// ログインします
client.login(token);