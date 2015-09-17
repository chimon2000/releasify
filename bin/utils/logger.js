var chalk = require('chalk');

module.exports.error = function (err) {
	console.log(chalk.red(err.message));
	console.log(chalk.red(err));
}

module.exports.warn = (msg) => console.log(chalk.yellow(msg));
module.exports.info = (msg) => console.log(chalk.blue(msg));