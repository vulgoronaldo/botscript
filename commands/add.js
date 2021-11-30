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

    name: "add",
    category: "Admin",
    aliases: ['adicionar'],

    run: async (client, message, args) => {

        config.mods.forEach(mod => {
            if (mod === message.author.id) {
                    if (!args[1]) {
                        message.reply("Você deve indicar o link para download do arquivo")
                    }
                    var nome_arquivo = args[0]
                    Script_Model.findOne({ where: { nome: args[0] } }).then(script => {
                        if (script) {
                            message.reply(`Ops, ${nome_arquivo} já existe`)
                        } else {
                            const canal_logs = client.channels.cache.get(config.logs_adm)
                            let ferinha_msg = new Discord.MessageEmbed()
                                .setTitle(`🎃 SCRIPT ADICIONADO`)
                                .setColor("#ff9d00")
                                .addField("✏ Usuário TAG e ID:", `${message.author.tag} - ${message.author.id}`)
                                .addField("✏ Servidor NOME:", `${message.guild.name}`)
                                .addField("✏ Servidor ID:", `${message.guild.id}`)
                                .addField("✏ Script:", `${args[0]}`)
                                .setTimestamp()
                            canal_logs.send({
                                embeds: [ferinha_msg]
                            })
                            Script_Model.create({
                                nome: args[0],
                                link: args[1],
                                downloads: 0
                            })
                            message.reply(`**${nome_arquivo}** adicionado com sucesso`)
                        }
                    })
                }
        })

    }
}
