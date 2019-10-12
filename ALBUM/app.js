const spawn = require('child_process').spawn;
const fs = require('fs')
var count = 0;

function launch() {
  console.log("executing bot");
  var bot = spawn('node', ['index.js']);

  bot.stdout.on('data', function (data) {
    var output = data.toString();
	if((output.includes("statusCode: 200"))){
		process.stdout.write('stdout: [' + count + '] ' + output.replace("[+] ", ""));
		count++;
	}else{
		process.stdout.write('stdout: ' + output.replace("[+] ", ""));
	}
  });

  bot.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  bot.on('exit', function (code) {
	fs.writeFile('stats', count, (err) => {
		if (err) {
			console.error(err)
			return
		}
		launch();
	})
  });
}

function start() {
	launch();
}

fs.readFile('stats', 'utf8', function(err, contents) {
    count = parseInt(contents);
	console.log(count);
	start();
});
