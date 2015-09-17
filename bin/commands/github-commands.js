'use strict';

var path = require('path');
var Octokat = require('octokat');
var logger = require('../utils/logger');
var ghHelper = require('../utils/github-helper');
var inquirer = require('inquirer');

module.exports.create = function (yargs) {

	var argv = yargs
		.option('a', {
			alias: 'assets',
			type: 'boolean',
			default: false,
			description: 'include assets'
		})
		.option('v', {
			alias: 'version',
			type: 'string',
			description: 'the tag version to be used during creation'
		})
		.option('m', {
			alias: 'manifest',
			type: 'string',
			default: 'package.json',
			description: 'the manifest file that you would like to read from.'
		})
		.help('help')
		.alias('h', 'help')
		.argv

	try {
		var manifest = ghHelper.getManifest(argv.manifest);
		var repo = ghHelper.initConnection(manifest);
		var appInfo = ghHelper.getAppInfo(manifest);

		var step = 1;


		if (argv.version) {
			appInfo.tag_name = argv.version;
			appInfo.name = argv.version;
		}

		logger.info(step++ + '. Attempting to create a release');

		repo.releases.create(appInfo)
			.then(function (data) {
				logger.info('Release successfully created with tag ' + appInfo.tag_name);
				if (!argv.assets) return Promise.resolve();

				logger.info(step++ + '. Attempting to upload assets');
				return ghHelper.uploadAssets(data, manifest).then(function () {
					logger.info('Assets successfully uploaded for release ' + appInfo.tag_name);
				})
			})
			.then(() => logger.info('Finished!!!'))
			.catch(ghHelper.parseValidation)
			.catch(logger.error);
	} catch (error) {
		logger.error(error);
		return;
	}
}
module.exports.upload = function (yargs) {

	var argv = yargs
		.option('v', {
			alias: 'version',
			type: 'string',
			description: 'the tag version to be used during creation'
		})
		.option('m', {
			alias: 'manifest',
			type: 'string',
			default: 'package.json',
			description: 'the manifest file that you would like to read from.'
		})
		.help('help')
		.alias('h', 'help')
		.argv

	try {
		var manifest = ghHelper.getManifest(argv.manifest);
		var repo = ghHelper.initConnection(manifest);
		var appInfo = ghHelper.getAppInfo(manifest);


		if (argv.version) {
			appInfo.tag_name = argv.version;
			appInfo.name = argv.version;
		}

		logger.info('Attempting to upload assets');

		repo.releases.fetch()
			.then(function (releases) {
				var release;

				for (var i = 0; i < releases.length; i++) {
					if (releases[i].tagName == appInfo.tag_name) {
						release = releases[i];
					}
				}

				if (!release) Promise.reject(new Error('Sorry, no release matches that version'));
			
				return ghHelper.uploadAssets(release, manifest);
			})
			.then(() => logger.info('Assets successfully uploaded for release ' + appInfo.tag_name))
			.then(() => logger.info('Finished!!!'))
			.catch(ghHelper.parseValidation)
			.catch(logger.error);

	} catch (error) {
		logger.error(error);
		return;
	}
}

module.exports.deleteLatest = function (yargs) {

	var argv = yargs
		.option('m', {
			alias: 'manifest',
			type: 'string',
			default: 'package.json',
			description: 'the manifest file that you would like to read from.'
		})
		.help('help')
		.alias('h', 'help')
		.argv

	inquirer.prompt([
		{
			type: 'confirm',
			name: 'release',
			message: 'Are you sure you want to delete the latest release?',
			default: false

		}
	], function (answers) {
		if (answers.release) {
			try {
				var manifest = ghHelper.getManifest(argv.manifest);
				var repo = ghHelper.initConnection(manifest);

				repo.releases.fetch()
					.then(data => data[0].remove())
					.catch(ghHelper.parseValidation)
					.catch(logger.error);
			} catch (error) {

				logger.error(error);
				return;

			}
		}
	})
}


module.exports.deleteAll = function (yargs) {

	var argv = yargs
		.option('m', {
			alias: 'manifest',
			type: 'string',
			default: 'package.json',
			description: 'the manifest file that you would like to read from.'
		})
		.help('help')
		.alias('h', 'help')
		.argv

	inquirer.prompt([
		{
			type: 'confirm',
			name: 'release',
			message: 'Are you sure you want to delete all of the releases?',
			default: false

		}
	], function (answers) {
		if (answers.release) {
			try {
				var manifest = ghHelper.getManifest(argv.manifest);
				var repo = ghHelper.initConnection(manifest);

				repo.releases.fetch()
					.then(function (data) {
						data.forEach(single => single.remove());
					})
					.catch(ghHelper.parseValidation)
					.catch(logger.error);
			} catch (error) {

				logger.error(error);
				return;

			}
		}
	})
}

module.exports.getLatest = function (yargs) {
	logger.info('Attempting to get latest release');

	var argv = yargs
		.option('m', {
			alias: 'manifest',
			type: 'string',
			default: 'package.json',
			description: 'the manifest file that you would like to read from.'
		})
		.help('help')
		.alias('h', 'help')
		.argv


	try {
		var manifest = ghHelper.getManifest(argv.manifest);
		var repo = ghHelper.initConnection(manifest);

		repo.releases.fetch()
			.then(function (data) {
				if (data.length == 0) {
					logger.warn('This repository does not have any releases');
					return;
				}
				console.log(data[0].tagName);
			})
			.catch(ghHelper.parseValidation)
			.catch(logger.error);
	} catch (error) {

		logger.error(error);
		return;
	}
}

module.exports.getAll = function (yargs) {

	logger.info('Attempting to get all release');

	var argv = yargs
		.option('m', {
			alias: 'manifest',
			type: 'string',
			default: 'package.json',
			description: 'the manifest file that you would like to read from.'
		})
		.help('help')
		.alias('h', 'help')
		.argv

	try {
		var manifest = ghHelper.getManifest(argv.manifest);
		var repo = ghHelper.initConnection(manifest);

		repo.releases.fetch()
			.then(function (data) {
				if (data.length == 0) {
					logger.warn('This repository does not have any releases');
					return;
				}
				console.log(data.map(single => single.tagName));
			})
			.catch(ghHelper.parseValidation)
			.catch(logger.error);
	} catch (error) {

		logger.error(error);
		return;
	}
}