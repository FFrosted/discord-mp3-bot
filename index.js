const { token, guild_id, client_id } = require('./config.json');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, ChannelType } = require('discord.js');
const fs = require("node:fs")
const client = new Client({ intents:
  [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
]
});

const rest = new REST({version: '10'}).setToken(token);

const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, StreamType } = require('@discordjs/voice');
const { join } = require('path');
client.once('ready', async() => {
    console.log("connected");

    });


client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand){
        if (interaction.commandName === 'join') {
            const voiceChannel = interaction.options.getChannel('channel');
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            }); 
            console.log("joined voice channel");

            const player = createAudioPlayer();
            console.log('created player')

            const random = Math.floor(Math.random() * 4);

            // Place your file into the directory and set the file name in the quotes
            switch (random) {
                case 0:
                    resource = createAudioResource(join(__dirname, "ruslan1.mp3" ), { inlineVolume: true,}); // file name in the quotes in this line
                    break; 
                case 1: 
                    resource = createAudioResource(join(__dirname, "ethan1.mp3"), { inlineVolume: true,});  // file name in the quotes in this line
                    break;
                case 2:
                    resource = createAudioResource(join(__dirname, "ruslan2.mp3"), { inlineVolume: true,})  // file name in the quotes in this line
                    break;
                case 3:
                    resource = createAudioResource(join(__dirname, "rulsan3.mp3"), {inlineVolume: true,})  // file name in the quotes in this line
                    break;
            }

            console.log("created resource");

            resource.volume.setVolume(1)

            connection.subscribe(player);

            player.play(resource);
            
            interaction.reply('doing that shi')

            player.addListener("stateChange", (oldOne, newOne) => {
                if (newOne.status == "idle") {
                    connection.destroy()
                }
            });
        }
    }
})

async function main() {
    try {
        await rest.put(Routes.applicationGuildCommands(client_id, guild_id), {
            body: [
                new SlashCommandBuilder()
                    .setName('join')
                    .setDescription('joins chnnall')
                    .addChannelOption(option => option
                            .setName('channel')
                            .setDescription("The channel to join")
                            .setRequired(true)
                            .addChannelTypes(ChannelType.GuildVoice)
                    ),        
            ]
        });
        await client.login(token);
    } catch (err) {
        console.log(err)
    }
}
main()
