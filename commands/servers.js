const Discord = require("discord.js")

module.exports = {
    name:"servers",
    async run (client, message, args, db) {
      let guildMap = client.guilds.cache.map( g => `**${g.name}** | **${g.id}**`).join("\n")
      message.channel.send({
        embeds: [{
          title: "🎃 Meus Servidores...",
          description: guildMap,
          color: "#ff9d00",
          footer: "Servidores"
        }]
      })
    } 
  }