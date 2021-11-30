
// Import discord.js and create the client
const Discord = require("discord.js")
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]})

// Register an event so that when the bot is ready, it will log a messsage to the terminal
client.on('ready', () => {
    console.log(`Logado como ${client.user.tag}!`);
})

const config = require("./config.json")

client.on('messageCreate', message => {
    if (message.channel.type == 'dm') return;
    
    prefixo_fera = config.prefix;

    if (message.author.bot) return;

    if (!message.content.toLowerCase().startsWith(prefixo_fera.toLowerCase())) return;
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(prefixo_fera.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {

        let emoji_fera = "❌";
        let ferinha_author = message.author;
        let prefixo_fera_handler = prefixo_fera;
        let comando_inexistente = `${prefixo_fera_handler}${command}`;

        message.channel.send(`${emoji_fera} | ${ferinha_author} O comando \`${comando_inexistente}\` não existe!`).then(msg => { msg.delete({ timeout: 5000 }) });
        message.delete()
        console.error('Erro:' + err);
    }
});

client.login(config.token);
