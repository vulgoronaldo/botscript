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

  name: "pedir",
  category: "Admin",
  aliases: [],

  run: async (client, message, args) => {
    if (args[0]) {
      var nome_arquivo = args[0]
      Script_Model.findOne({ where: { nome: args[0] } }).then(script => {
        if (script) {
          script.increment('downloads', { by: 1 }).then(() => {
            const canal_logs = client.channels.cache.get(config.logs)
            let ferinha_msg = new Discord.MessageEmbed()
            .setTitle(`🎃 SCRIPT SOLICITADO`)
            .setColor("#ff9d00")
            .addField("✏ Usuário TAG e ID:", `${message.author.tag} - ${message.author.id}`)
            .addField("✏ Servidor NOME:", `${message.guild.name}`)
            .addField("✏ Servidor ID:", `${message.guild.id}`)
            .addField("✏ Script:", `${args[0]}`)
            .addField("✏ Downloads:", `${script.downloads + 1}`)
            .setTimestamp()
            canal_logs.send({
              embeds:[ferinha_msg]
            })
            message.author.createDM();
            message.reply(`Enviei **${args[0]}** para o seu privado`)
            message.author.send({
              content: `<@${message.author.id}> Aqui está o script solicitado. 😆 \n Caso tenha alguma dúvida entre em contato com <@332972051239403532> ou <@330406276972412928> 😎 \n **Download:** ${script.link}`,
            }).catch(erro => {
              console.log(erro)
              message.reply("Seu privado está bloqueado. Então não posso enviar o script para você")
            })
          })
        } else {
          message.reply(`**${args[0]}** não existe. \nDigite **.scripts** para ver a lista`)
        }
      })
    } else {
      message.reply("Você deve informar o nome do script. \n Digite .scripts para ver a lista")
    }

  }
}
