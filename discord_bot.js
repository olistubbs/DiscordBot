// Lets see how far I can get with this before I loose the will to live
// discord_bot.js will serve on the BattleRagers discord server

const ver = "0.2"
const prefix = "!"

const Discord = require("discord.js");
const bot = new Discord.Client();

var bot_operators = [ '92001527819956224' ];

try {
	var authDetails = require("./auth.json");
} catch (e){
	console.log("Unable to find auth.json\n"+e.stack);
	process.exit(1);
}

if(authDetails.bot_token){
	try {
		console.log("Logging in with token...");
		bot.login(authDetails.bot_token);
	} catch (e){
		console.log("Error: failed logging in with token:\n"+e.stack);
		process.exit(1);
	}
}

bot.on("ready", () => {
	console.log("Logged in successfully\ndiscord_bot v" + ver);
});

bot.on("guildMemberAdd", member => {
	let guild = member.guild;
	guild.defaultChannel.sendMessage(` ${member.user} Has joined the server`);
});

bot.on("presenceUpdate", (oldMember, newMember) => {
	let guild = newMember.guild;
	let playRole = guild.roles.find("name", "Playing Overwatch");
	if(!playRole) return;

	if(newMember.user.presence.game && newMember.user.presence.game.name ===  "Overwatch") {
		newMember.addRole(playRole);
	} else if(!newMember.user.presence.game && newMember.roles.has(playRole.id)) {
		newMember.removeRole(playRole);
	}
});

bot.on("message", msg => {
	if(msg.author.bot) {
		return;
	}
	if(!msg.content.startsWith === prefix) {
		return;
	}

	let command = msg.content.split(" ")[0];;
	command = command.slice(prefix.length);

	let args = msg.content.split(" ").slice(1);

	if( command === "add") {
		let numArray = args.map(n=> parseInt(n));
		let total = numArray.reduce( (p, c) => p+c);
		msg.channel.sendMessage(total);
	}

	if(command === "say") {
		msg.channel.sendMessage(args.join(" "));
	}
	if( command === "ping") {
		msg.channel.sendMessage('PONG');
	}
	if(command === "rules") {
		let modRole = msg.guild.roles.find("name", "kick");
		if(msg.member.roles.has(modRole.id)) {
			msg.channel.sendMessage("You're a mod, you should know the rules");
		} else {
		msg.channel.sendMessage("I'll send you the guild rules");
		msg.author.sendMessage("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	}
	}
	if(command === "kick") {
		let kickRole = msg.guild.roles.find("name", "kick");
		if(!msg.member.roles.has(kickRole.id)) {
			console.log(`${msg.member.user.username} just tried to kick someone from the server`);
			return msg.reply("I can't let you do that, Dave");
		}
		if(!msg.channel.name("botops")) {
			return;
		}
		if(msg.mentions.users.size === 0) {
			return msg.reply("Need to know who to kick");
		}
		let kickMember = msg.guild.member(msg.mentions.users.first());
		if(!kickMember) {
			return message.reply("Can't find that user on this server");
		}
		if(!msg.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
			return msg.author.sendMessage("I don't have the kick permission");
		}
		kickMember.kick();
	}
});
