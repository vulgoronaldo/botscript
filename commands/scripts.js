const Discord = require("discord.js");
const os = require("os");
const config = require('../config.json')
const path = require('path');
const db = require('quick.db');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('resources_bot', 'root', '', {dialect: 'mysql', host: 'localhost'});

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

    name: "scripts",
    category: "Scripts",
    aliases: [],

    run: async (client, message, args) => {
        const canal_logs = client.channels.cache.get(config.logs)
        let ferinha_msg = new Discord.MessageEmbed()
            .setTitle(`🎃 SCRIPTS SOLICITADOS`)
            .setColor("#ff9d00")
            .addField("✏ Usuário TAG e ID:", `${message.author.tag} - ${message.author.id}`)
            .addField("✏ Servidor NOME:", `${message.guild.name}`)
            .addField("✏ Servidor ID:", `${message.guild.id}`)
            .addField("✏ Comando:", `.script`)
            .setTimestamp()
            canal_logs.send({
              embeds:[ferinha_msg]
            })
        Script_Model.findAll().then(scripts => {
            var lista = ""
            scripts.forEach(script => {
                lista = lista + `${script.nome} \n`
            })
            var attachment = new Discord.MessageAttachment(Buffer.from(lista, 'utf-8'), 'scripts.txt');
            message.author.createDM();
              message.reply(`Enviei os scripts para o seu privado`)
              message.author.send({
                content:`<@${message.author.id}> Aqui está a lista de scripts solicitada. 😆`,
                files:[attachment]
              }).catch(erro => {
                console.log(erro)
                message.reply("Seu privado está bloqueado. Então não posso enviar o script para você")
              })
        })
    }

}
