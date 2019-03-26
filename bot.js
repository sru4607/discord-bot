var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var ScryfallClient = require('scryfall-client')
var scryfall = new ScryfallClient()
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
    if (message.substring(0, 1) == '$') {
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
		else if(message.substring(1,15).toLowerCase() == "magic bot says")
		{
			
			bot.sendMessage({
						to:channelID,
						message: message.substring(16)
					});
		}
		else{

			bot.sendMessage({
						to:channelID,
						message: message + " is not a valid command"
					});
		}
	
		
	}

//testing includes()
	if (message.includes("magic bot"){
		bot.sendMessage({to:channelID, message: "owo"});
	}
};
