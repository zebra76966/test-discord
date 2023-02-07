require("dotenv").config();

const { REST } = require("discord.js");
const { Routes } = require("discord.js");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const regusers = ["Rohit_Sharma"];

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands"); // E:\yt\discord bot\js\intro\commands
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.on("ready", () => {
  // Get all ids of the servers
  const guild_ids = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
  for (const guildId of guild_ids) {
    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands })
      .then(() => console.log("Successfully updated commands for guild " + guildId))
      .catch(console.error);
  }
});

client.on("guildMemberAdd", (member) => {
  // console.log("Added member");
  // console.log(member);
  if (regusers.includes(member.user.username)) {
    client.on("messageCreate", (msg) => {
      var role = member.guild.roles.cache.find((r) => r.name === "Subs"); // Variable to get channel ID
      member.roles.add(role); // Adds the default role to members

      // member.guild.channels.get("JOIN/LEAVE Channel ID").send({
      //   embed: {
      //     color: 3447003,
      //     title: "**SERVER NAME** Welcome Bot!",
      //     url: "WEBSITE URL",
      //     description: "Welcome *" + member + "* to the **Server name** discord server!",
      //     fields: [
      //       {
      //         name: "Information",
      //         value: "Some info on the server",
      //       },
      //     ],
      //     timestamp: new Date(),
      //     footer: {
      //       icon_url: client.user.avatarURL,
      //       text: "© NAME OF SERVER 2018 - 2019",
      //     },
      //   },
      // });
    });
  } else {
    console.log("mull");
  }
});

client.on("messageCreate", (msg) => {
  // const myChannel = message.guild.channels.cache.get("1072106282485563473");
  // console.log(myChannel);
  // myChannel.updateOverwrite(message.member, {
  //   SEND_MESSAGES: true,
  //   VIEW_CHANNEL: true,
  // });

  // let role = message.guild.roles.cache.find((r) => r.name === "Subs");
  // console.log(role);
  // let member = message.member;
  // member.roles.add(role).catch(console.error);
  let prefix = "!";
  let message = msg.content;
  if (message.startsWith(prefix)) {
    // message.member.addRole(role);
    const command = message.slice(prefix.length).split(" ")[0];
    // console.log(command);
  }
  // var role = msg.guild.roles.find((role) => role.name === "Subs");
  // console.log(role);
  // console.log(msg.content);
  // if (msg.content == "Hello") {
  //   console.log(msg.content);
  //   msg.channel.send("Lol");
  // }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error executing this command" });
  }
});

client.login(process.env.TOKEN);
