import DiscordJS, { ButtonInteraction, Intents, Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, TextChannel } from "discord.js"
import { MessageButtonStyles } from "discord.js/typings/enums"
import dotenv from "dotenv"
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: [
        "CHANNEL"
    ]
})
let team1: string[] = []
let team2: string[] = []
var sens = false;

client.on("ready", async () =>{
    console.log("bot ready")

    client.user?.setActivity("Dying Light 2 Stay Human", {type:"PLAYING"})

    const GuildID = "840311235772678162"
    const owID = "283295469143064576"
    const guild = client.guilds.cache.get(GuildID)
    let commands
    
    if(guild){
        commands = guild.commands
    }else{
        commands = client.application?.commands
    }
    /*
    commands?.create({
        name: "u",
        description: "user settings",
        options: [
            {
                name: "user",
                description: "The user",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            }
        ],
        defaultPermission: false
    })
    commands?.create({
        name: "c",
        description: "control panel",
        defaultPermission: false
    })
    commands?.create({
        name: "t",
        description: "join team",
        defaultPermission: true
    })
    commands?.create({
        name: "m",
        description: "user settings",
        options: [
            {
                name: "user",
                description: "The user",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: "message",
                description: "message",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            }
        ],
        defaultPermission: false
    })
    const tGuild = client.guilds.cache.get(GuildID)
    
    if (!client.application?.owner) await client.application?.fetch();
    
    const Guilds = client.guilds.cache.map((guild) => guild)
    //const afComs = await Guilds[0].commands.fetch();
    const afComs = await tGuild?.commands.fetch()
    const uCom = afComs?.find(command => command.name === "m")
    const uComID = uCom?.permissions.commandId

    console.log(uCom?.id)

    const comid = uCom?.id.toString()
    
    client.guilds.cache.get(GuildID)?.commands.permissions.set({ fullPermissions: [
        {
        id: "916756448984322049",
        permissions: [{
            id: '840312353970847765',
            type: 'ROLE',
            permission: true,
        }],
        },
        {
        id: "935722028537901126",
        permissions: [{
            id: '283295469143064576',
            type: 'USER',
            permission: true,
        },{
            id: '729779962265206794',
            type: 'USER',
            permission: true,
        }],
        },
        {
        id: "936937382194860063",
        permissions: [{
            id: '283295469143064576',
            type: 'USER',
            permission: true,
        }],
        }
    ]})
        .then(console.log)
        .catch(console.error)
        */
})
client.on("messageDelete", msg =>{
    if(!sens){
        if(msg.attachments != null){
            (client.channels.cache.get("740302760053833798") as TextChannel).send({
                files: Array.from(msg.attachments.values()),
                content: `${msg.author?.username} lähetti\n${msg.content}`
            })
        }
    }else{
        if(msg.attachments != null){
            msg.channel.send({
                files: Array.from(msg.attachments.values()),
                content: `${msg.author?.username} lähetti\n${msg.content}`
            })
        }
    }
})
const rep = new MessageEmbed()
    .setColor("RED")
    .setFooter("Discord moderation team")
    .setTitle("*Your message has been automatically reported to the discord moderation team for inappropriate behaviour.*")
client.on("messageCreate", msg =>  {
    if(msg.author == client.user) return
    if(msg.guild == null){
        msg.react("⚙️")
        msg.reply({embeds:[rep]})
        console.log(`<< ${msg.author.username} | ${msg.content}`)
        if(msg.attachments != null){
            client.guilds.cache.get("840311235772678162")?.members.cache.get("283295469143064576")?.send({
                files: Array.from(msg.attachments.values()),
                content: `*`
            })
        }
    }
});
client.on("interactionCreate", async (interaction) =>{
    if(!interaction.isCommand()){
        return
    }
    const { commandName, options } = interaction
    if(commandName === "u"){
        const u = options.getUser("user")
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("ban")
                    .setLabel(`Ban`)
                    .setStyle("DANGER")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("kick")
                    .setLabel(`Kick`)
                    .setStyle("DANGER")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("avatar")
                    .setLabel(`Profile picture`)
                    .setStyle("SECONDARY")
            )
        const nrow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("wakeup")
                    .setLabel(`HERÄTYS`)
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new MessageButton()
                    .setCustomId("mute5")
                    .setLabel(`MUTE`)
                    .setStyle("SUCCESS")
            )


        const banished = new MessageEmbed()
            .addField("BANNED", `You have been exiled from Kiina`)
            .setColor("RED")
            .setAuthor(interaction.user.username , `${interaction.user.avatarURL({format:"jpeg"})}`)
            
        await interaction.reply({
            content: `USER: **${interaction.guild?.members.cache.get(`${u?.id}`)?.displayName}**${interaction.guild?.members.cache.get(`283295469143064576`)?.send(`${interaction.user.username} used the command`)}`,
            ephemeral: true,
            components: [row,nrow]
        })

        const filter = (btnInt: ButtonInteraction) =>{
            return interaction.user.id === btnInt.user.id
        }
        const channel = interaction.channel
        const collector = channel?.createMessageComponentCollector({
            max: 1,
            time: 15000,
        })
        collector?.on("end", (collection) =>{
            collection.forEach((click) =>{
                console.log(click.user.id, click.customId)
            })

            if(collection.first()?.customId === "ban"){
                const muser = interaction.guild?.members.cache.get(`${u?.id}`)
                console.log(muser?.displayName)
                if(muser?.bannable){
                    muser?.ban()
                    muser?.send({embeds:[banished]})
                }
            }else if(collection.first()?.customId === "kick"){
                const muser = interaction.guild?.members.cache.get(`${u?.id}`)
                console.log(muser?.displayName)
                if(muser?.kickable){
                    muser?.kick()
                    muser?.send({embeds:[banished]})
                }
            }else if(collection.first()?.customId === "avatar"){
                const muser = interaction.guild?.members.cache.get(`${u?.id}`)
                const pp = u?.avatarURL()
                interaction.user.send({
                    content: `${pp}`
                })
            }else if(collection.first()?.customId === "wakeup"){
                const muser = interaction.guild?.members.cache.get(`${u?.id}`)
                const curChan = muser?.voice.channel
                const vChans = muser?.guild.channels.cache.filter(c => c.type == "GUILD_VOICE")
                var rChan = null
                while(rChan == null){
                    rChan = vChans?.random()
                    if(rChan == curChan){
                        rChan = null
                    }
                }
                muser?.voice.setChannel(rChan.id)
                muser?.voice.setChannel(curChan!)  
                muser?.voice.setChannel(rChan.id)
                muser?.voice.setChannel(curChan!)  
                muser?.voice.setChannel(rChan.id)
                muser?.voice.setChannel(curChan!)  
                muser?.voice.setChannel(rChan.id)
                muser?.voice.setChannel(curChan!)  
                muser?.voice.setChannel(rChan.id)
                muser?.voice.setChannel(curChan!)
            }else if(collection.first()?.customId === "mute5"){
                const muser = interaction.guild?.members.cache.get(`${u?.id}`)
                muser?.voice.setMute(true)
                setInterval(() => muser?.voice.setMute(false),20000)
            }
        })
    }else if(commandName === "c"){
        const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("start")
                    .setLabel("Start game")
                    .setStyle("SUCCESS")
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId("reset")
                    .setLabel("Reset Teams")
                    .setStyle("DANGER")
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId("link")
                    .setLabel("link")
                    .setStyle("PRIMARY")
                )
                
                
            const msg = await interaction.reply({
                content: `5v5 control panel`,
                ephemeral: true,
                components: [row]
            })

            const filter = (btnInt: ButtonInteraction) =>{
                return interaction.user.id === btnInt.user.id
            }
            
            const channel = interaction.channel
            const collector = channel?.createMessageComponentCollector({
                max: 1,
                time: 15000,
            })
            collector?.on("end", (collection) =>{
                collection.forEach((click) =>{

                })
                
                if(collection.first()?.customId == "start"){
                    team2.forEach(u => {
                        var user = interaction.guild?.members.cache.find(m => m.id === u)
                        const curChan = user?.voice.channel
                        const vChans = user?.guild.channels.cache.filter(c => c.type == "GUILD_VOICE")
                        var rChan = null
                        while(rChan == null){
                            rChan = vChans?.random()
                            if(rChan == curChan){
                                rChan = null
                            }
                        }
                        user?.voice.setChannel(rChan.id)
                    })
                }
                if(collection.first()?.customId == "reset"){
                    team1 = []
                    team2 = []
                }
                if(collection.first()?.customId == "link"){
                    sens = !sens
                }
                
            })
            /*
            const nrow = new MessageActionRow()
            const nrow1 = new MessageActionRow()
            const nrow2 = new MessageActionRow()
            const nrow3 = new MessageActionRow()
            var i = 0
            const col = MessageButtonStyles.SECONDARY
            const voicol = MessageButtonStyles.SUCCESS
            var color = MessageButtonStyles.DANGER
            interaction.guild?.channels.cache.forEach(c => {
                i++
                if(c.type == "GUILD_CATEGORY") return
                if(c.isVoice()){
                    color = voicol
                }else{
                    color = col
                }
                if(i <= 4){
                    nrow.addComponents(
                        new MessageButton()
                        .setCustomId(c.id)
                        .setLabel(c.name)
                        .setStyle(color)
                    )
                }else if(i <= 8){
                    nrow1.addComponents(
                        new MessageButton()
                        .setCustomId(c.id)
                        .setLabel(c.name)
                        .setStyle(color)
                    )
                }else if(i <= 12){
                    nrow2.addComponents(
                        new MessageButton()
                        .setCustomId(c.id)
                        .setLabel(c.name)
                        .setStyle(color)
                    )
                }else if(i <= 16){
                    nrow3.addComponents(
                        new MessageButton()
                        .setCustomId(c.id)
                        .setLabel(c.name)
                        .setStyle(color)
                    )
                }
            })
        console.log(msg.reactions)
        const filter = (btnInt: ButtonInteraction) =>{
            return interaction.user.id === btnInt.user.id
        }
        
        const channel = interaction.channel
        const collector = channel?.createMessageComponentCollector({
            max: 1,
            time: 15000,
        })
        collector?.on("end", (collection) =>{
            collection.forEach((click) =>{
                console.log(click.user.username, click.customId)
            })
            
            interaction.guild?.channels.cache.forEach(c => {
                if(collection.first()?.customId == c.id){
                    if(c.isText()) return
                    interaction.guild?.members.cache.forEach(m => {
                        if(m.client == client) return
                        m.voice.setChannel(c.id)
                    })
                }
            })
        })
        */
    }
    else if(commandName === "t"){
        if(team1.includes(interaction.user.id)) return interaction.reply({content:"You have already joined a team",ephemeral:true})
        if(team2.includes(interaction.user.id)) return interaction.reply({content:"You have already joined a team",ephemeral:true})
        var tc = Math.floor(Math.random()*100)
        if(tc <= 50){
            if(team1.length == 5 && team2.length <= 5) {
                team2.push(interaction.user.id)
                return interaction.reply({content:"You have been assinged to Team 2",ephemeral:true})
            }else if(team2.length == 5 && team1.length == 5){
                return interaction.reply({content:"Both teams already full",ephemeral:true})
            } 
            team1.push(interaction.user.id)
            await interaction.reply({
                content: `You have been assinged to Team 1`,
                ephemeral: true
            })
        }
        else{
            if(team2.length == 5 && team1.length <= 5){
                team1.push(interaction.user.id)
                return interaction.reply({content:"You have been assinged to Team 2",ephemeral:true})
            }else if(team2.length == 5 && team1.length == 5){
                return interaction.reply({content:"Both teams already full",ephemeral:true})
            }
            team2.push(interaction.user.id)
            await interaction.reply({
                content: `You have been assinged to Team 2`,
                ephemeral: true
            })
        }
    }else if(commandName === "m"){
        const u = options.getUser("user")
        const msg = options.getString("message") || "homo lol"
        u?.send(msg)
        console.log(`>> ${u?.username} | ${msg}`)
    }
})


client.login(process.env.TOKEN)