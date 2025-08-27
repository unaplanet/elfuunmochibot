
// mochi.jsのmodule.exportsを呼び出します。
const mochiFile = require('./commands/mochi.js');

// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits,  ChannelType, Partials } = require('discord.js');
// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token, notificationChannelId, targetVoiceChannelId } = require('./config.json');
// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, // サーバーでのメッセージに関する情報を受け取る許可
    GatewayIntentBits.MessageContent, // メッセージの"内容"を読み取る許可
    GatewayIntentBits.GuildVoiceStates, // ボイスチャンネルの状態を監視する許可
    GatewayIntentBits.DirectMessages, // ダイレクトメッセージの受信を許可
    GatewayIntentBits.DirectMessageReactions // ダイレクトメッセージのリアクションを受信する許可
  ],
  partials: [Partials.Channel], // ← これを追加したらなぜかDMのメッセージが取得できるようになった
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
client.on('messageCreate', async msg => {
  // ボット自身のメッセージは無視する
    if (msg.author.bot) {
        return;
    }

    
    try{
        if ( msg.guild ){
            // メッセージの内容が 'エル' だったら 'フーン' と返信する
            if (msg.content === `エル`) {
                await msg.reply(`フーン:smirk_cat:`);
            }
            if (msg.content === `エルエルエル`) {
                await msg.reply(`フ～～～ン！`);
            }else if (msg.content.includes(`かわいい`)) {
                await msg.reply(`:smirk_cat:(しってる)`);
            }
        }else{
            console.log(`フーン！(DMでメッセージを受信しました。->${msg.content}\n送信者: ${msg.author.tag})\n受信日時:${msg.createdAt}`);
            
            if (msg.content.includes(`エル`)) {
                await msg.reply(`フーン！`);
            }
            if (msg.content.includes(`かわいい`)) {
                await msg.reply(`:pink_heart:`);
            }
            else if (msg.content === `もちもち`) {
                await msg.reply(`フーン？`);
            }else{
                await msg.reply(`……？`);
            }
        }
    }catch(error){
        console.error(`メッセージの処理中にエラーが発生しました: ${error}`);
        await msg.reply(`フ～～～ン:sob:(エラーが発生しました。何回も表示される場合は開発者までご連絡ください。)`);
    }
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
        const msg = `フーン！(📞 **<#${newChannel.id}>** で通話が開始されました！ (参加者: ${member.displayName}))`;
        notificationChannel.send(msg);
    }

    // 通話終了 (1人 → 0人になった時)
    if (oldChannel?.id === targetVoiceChannelId && oldChannel.members.size === 0 && newChannel?.id !== targetVoiceChannelId) {
        const msg = `フーン！(🌙 **<#${oldChannel.id}>** の通話が終了しました。)`;
        notificationChannel.send(msg);
    }
});

// client.on( 'messeageCreate', async message => {
//     if (message.author.bot) return;

// )

// ログインします
client.login(token);