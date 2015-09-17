#!/usr/bin/env node

'use strict';

var yargs = require('yargs');
var commands = require('./commands/github-commands');

var argv = yargs.usage('$0 command')
	.command('latest', 'get latest release from GitHub', commands.getLatest)
	.command('upload', 'upload assets to a release in GitHub', commands.upload)
	.command('list', 'list all of the releases in GitHub', commands.getAll)
	.command('create', 'create a new release in GitHub', commands.create)
	.command('delete-latest', 'delete latest release from GitHub', commands.deleteLatest)
	.command('delete-all', 'purge GitHub of all releases', commands.deleteAll)
	.demand(1, 'must provide a valid command')
	.help('h')
	.alias('h', 'help')
	.argv;