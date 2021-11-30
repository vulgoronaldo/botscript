const Discord = require("discord.js");
const os = require("os");
const config = require('../config.json')
const path = require('path');
const db = require('quick.db');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('resources_bot', 'root', '', { dialect: 'mysql', host: 'localhost' });

const Script_Model = sequelize.define('script', {
  nome: Sequelize.STRING,
  link: Sequelize.STRING,
  downloads: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

module.exports = {

  name: "rm",
  category: "Admin",
  aliases: [],

  run: async (client, message, args) => {
    if (args[0]) {
      var nome_arquivo = args[0]

      config.mods.forEach(mod => {
        if (mod === message.author.id) {
          Script_Model.findOne({ where: { nome: args[0] } }).then(script => {
            if (script) {
              var nome_arquivo = args[0]
              Script_Model.findOne({ where: { nome: args[0] } }).then(script => {
                if (script) {
                  const canal_logs = client.channels.cache.get(config.logs_adm)
                  let ferinha_msg = new Discord.MessageEmbed()
                                .setTitle(`🎃 SCRIPT REMOVIDO`)
                                .setColor("#ff9d00")
                                .addField("✏ Usuário TAG e ID:", `${message.author.tag} - ${message.author.id}`)
                                .addField("✏ Servidor NOME:", `${message.guild.name}`)
                                .addField("✏ Servidor ID:", `${message.guild.id}`)
                                .addField("✏ Script:", `${args[0]}`)
                                .setTimestamp()
                  canal_logs.send({
                    embeds: [ferinha_msg]
                  })
                  Script_Model.destroy({
                    where:{
                      nome:args[0]
                    }
                  })
                  message.reply(`O script **${nome_arquivo}** removido com sucesso`)
                } else {
                  message.reply(`Ops, **${nome_arquivo}** não existe`)

                }
              })
            } else {
              message.reply(`**${args[0]}** não existe. \nDigite **.scripts** para ver a lista`)
            }
          })
        }
      })
    } else {
      message.reply("Você deve informar o nome do script. \n Digite .scripts para ver a lista")
    }

  }
}
