const fs = require('fs');
const RPC = require("discord-rpc");
const rpc = new RPC.Client({
    transport: "ipc"
});
const chalk = require("chalk");
const prompt = require("prompt");
var time = new Date().toDateString() + ' ' + new Date().toLocaleTimeString();

function choice() {
    console.log(chalk.hex("#FABDF3")(`
			▄▄▄  ▪   ▄▄·  ▄ .▄   ▄▄▄·▄▄▄  ▄▄▄ ..▄▄ ·  ▄▄· ▄▄▄ . ▐ ▄  ▄▄· ▄▄▄ .
			▀▄ █·██ ▐█ ▌▪██▪▐█  ▐█ ▄█▀▄ █·▀▄.▀·▐█ ▀. ▐█ ▌▪▀▄.▀·•█▌▐█▐█ ▌▪▀▄.▀·
			▐▀▀▄ ▐█·██ ▄▄██▀▐█   ██▀·▐▀▀▄ ▐▀▀▪▄▄▀▀▀█▄██ ▄▄▐▀▀▪▄▐█▐▐▌██ ▄▄▐▀▀▪▄
			▐█•█▌▐█▌▐███▌██▌▐▀  ▐█▪·•▐█•█▌▐█▄▄▌▐█▄▪▐█▐███▌▐█▄▄▌██▐█▌▐███▌▐█▄▄▌
			.▀  ▀▀▀▀·▀▀▀ ▀▀▀ ·  .▀   .▀  ▀ ▀▀▀  ▀▀▀▀ ·▀▀▀  ▀▀▀ ▀▀ █▪·▀▀▀  ▀▀▀ 
						[Made by Luci]
	`));

    prompt.start();
    console.log(chalk.inverse.hex("#ffb7c5")("Press Corrosponding Number for your choice!"));
    console.log(chalk.hex("#ffb7c5")("[1] Load Config!"));
    console.log(chalk.hex("#ffb7c5")("[2] Config Builder"));
    console.log("");
    prompt.get(['Options'], function(err, result) {
        var options = result.Options;
        switch (options) {
            case "1":
				console.log("");
				console.log(chalk.inverse("Enter the Name of A Config File Within the Variables Folder!"));
                importer();
                break;

            case "2":
				console.log("");
                builder();
                break;
            default:
                console.clear()
                choice();
                break;
        }
    })

}
function builder() {
    prompt.start();
    prompt.get([`Config_Name`, `clientID`, `details`, `state`, `largeImageKey`, `largeImageText`, `button1`, `url1`, `button2`, `url2`], function(err, result) {
        var Config_Name = result.Config_Name;
        var clientID = result.clientID;
        var details = result.details;
        var state = result.state;
        var largeImageKey = result.largeImageKey;
        var largeImageText = result.largeImageText;
        var button1 = result.button1;
        var url1 = result.url1;
        var button2 = result.button2;
        var url2 = result.url2;
		
        var Newconfig = {
            clientID: clientID,
            details: details,
            state: state,
            largeImageKey: largeImageKey,
            largeImageText: largeImageText,
            button1: button1,
            url1: url1,
            button2: button2,
            url2: url2
        };
        console.log(Newconfig);
		
        let data = JSON.stringify(Newconfig, null, 2);
        fs.writeFile(`configs/${Config_Name}.json`, data, (err) => {
            if (err) throw err;
            console.log(chalk.hex("00FF00")('[Success] Data written to file'));
			console.log(chalk.hex("00FF00")(`[Presence] Now Running Rich Precense!`));
			
        });
    })

}
async function importer() {
    await prompt.start();
    prompt.get(['config'], function(err, result) {
        var config = result.config;
        var botconfig = require(`./configs/${config}.json`);
        rpc.login({
            clientId: botconfig.clientID
        });
        rpc.on("ready", () => {
            rpc.setActivity({
                startTimestamp: new Date(),
				details: botconfig.details,
				state: botconfig.state,
                largeImageKey: botconfig.largeImageKey,
                largeImageText: botconfig.largeImageText,
                buttons: [{
                    label: botconfig.label1,
                    url: botconfig.url1
                }, {
                    label: botconfig.label2,
                    url: botconfig.url2
                }]
            });
            console.log(chalk.inverse.hex("#ffb7c5")(chalk.inverse.white(`[${time}]`) + ` Connected  to Client ID: ${botconfig.clientID}`));
            console.log(chalk.inverse.hex("#ffb7c5")(chalk.inverse.white(`[${time}]`) + ` State: ${botconfig.state}`));
            console.log(chalk.inverse.hex("#ffb7c5")(chalk.inverse.white(`[${time}]`) + ` Details: ${botconfig.details}`));
        });
        rpc.on("disconnect", () => {
			console.log(chalk.inverse.hex("#ffb7c5")(chalk.inverse.white(`[${time}]`) + ` Attempting to Reconnect Rich Presence!`));
            rpc.login({
                clientId: botconfig.clientID
            });
        })

    })
}
process.title = "[313] Rich Prescence Tool";
choice();