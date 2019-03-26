var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
//Magic API
var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient()
//Read in author ASCII art
var fs = require('fs')
var secret;
fs.readFile('Kilroy.txt', (err, data) => { 
    if (err) throw err; 
    secret = data.toString();
	console.log(secret)
}) 
 
var callback = function(){
	
}
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
	
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `$`
	//Server ID
	var SID = bot.channels[channelID].guild_id;
	//Prefix
    if (message.substring(0, 1) == '$') {
		//Search
		if(message.substring(1,2) == 'S' || message.substring(1,2) == 's')
		{
			var args = message.substring(8);
			console.log(args)
			scryfall.get('cards/search', {
			q: args}).then(function(list){
				var fullMessage = ""
				 list.forEach(function (card) {
					fullMessage = fullMessage + card.name + "\n"
					if(fullMessage.length >= 1000 || card == list[list.length - 1])
					{
						bot.sendMessage({
						to:channelID,
						message: fullMessage
						});
						fullMessage = ""
						setTimeout(callback, 0.25)
					}
				})
			}).catch(function(err) {
				bot.sendMessage({
						to:channelID,
						message: args + " is not a valid card name"
					});
			})
		}
		//Image
		else if(message.substring(1,2) == 'I' || message.substring(1,2) == 'i')
		{
			var args = message.substring(7);
			console.log(args)
			scryfall.get('cards/named', {
			exact: args}).then(function(card){
				return card.getImage()}).then(function (imgs) {
					bot.sendMessage({
						to:channelID,
						message: imgs
					});
			}).catch(function(err) {
				bot.sendMessage({
						to:channelID,
						message: args + " is not a valid card name"
					});
			})
		}
		//repeat after me
		else if(message.substring(1,15).toLowerCase() == "magic bot says")
		{
			
			bot.sendMessage({
						to:channelID,
						message: message.substring(16)
					});
		}
		//Not a command
		else{

			bot.sendMessage({
						to:channelID,
						message: message + " is not a valid command"
					});
		}
	
		
	}
	//testing includes()
	if (message.toLowerCase().includes("magic bot")){
		bot.sendMessage({
			to:channelID, 
			message: "owo"
			});
	}
	//Author Message
	if (message.toLowerCase().includes("magic bot author")){
		bot.sendMessage({
			to:channelID, 
			message: "```" + secret + "```"
			});
	}
	
	//change bot nickname
	if(message.toLowerCase().includes('nick')){
		console.log(userID);
		console.log(SID);
		bot.editNickname({
			serverID: SID,
			userID: bot.id, 
			nick: message.replace('nick ', '')
		},function(err){
			console.log(err)
		});
	}

});