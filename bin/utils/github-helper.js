'use strict';

var path = require('path');
var Octokat = require('octokat');
var logger = require('../utils/logger');
var GitHubApi = require('github');
var async = require('async');

var githubClient;


function getManifest(filename) {
	var manifest;

	try {
		manifest = require(path.join(process.cwd(), filename));
	} catch (error) {
		throw Error('Sorry, your manifest file does not exist.')
	}

	var manifestKey = 'github-release';

	if (!manifest[manifestKey]) throw new Error('Sorry, your manifest file is missing the github-release property');

	manifest[manifestKey].tag_name = manifest[manifestKey].tag_name || manifest.version;
	manifest[manifestKey].name = manifest[manifestKey].name || manifest.version;

	return manifest[manifestKey];
}

function getAppInfo(manifest) {

	if (!manifest) throw new Error('Sorry, your manifest file is missing');

	var application = {
		"tag_name": "v" + manifest.tag_name,
		"target_commitish": "master",
		"name": "v" + manifest.name,
		"body": manifest.description,
		"draft": false,
		"prerelease": false
	}

	return application
}

function initConnection(manifest) {
	if (!manifest.auth) throw new Error('Sorry, your manifest file is missing your auth token');
	if (!manifest.root) throw new Error('Sorry, your manifest file is missing your root url');
	if (!manifest.user) throw new Error('Sorry, your manifest file is missing your user name');
	if (!manifest.repository) throw new Error('Sorry, your manifest file is missing your repository name');

	var octo = new Octokat({
		token: manifest.auth,
		rootUrl: manifest.root
	});

	var repo = octo.repos(manifest.user, manifest.repository);

	return repo;
}

function initGithubClient(manifest) {
    if (!githubClient) {
        githubClient = new GitHubApi({
            version: manifest.apiVersion || '3.0.0',
            protocol: 'https',
            host: manifest.root.replace('https://', ''),
            timeout: 5000,
            headers: {
                'user-agent': 'chimon2000/github-release'
            }
        });

        githubClient.authenticate({
            type: 'oauth',
            token: manifest.auth
        });
    }
    return githubClient;
}

function parseValidation(data) {

	var promise = new Promise(function (resolve, reject) {
		var err = null;

		var hasSpecial = false;
		var errors = data.json ? data.json.errors : [];
		try {
			var json = JSON.parse(data.message);
			errors = errors.concat(json.errors);
		}
		catch (err) { }

		hasSpecial = errors.some(function (single) {
			var resource = single.resource == "ReleaseAsset" ? "asset" : "release";

			switch (single.code) {
				case 'already_exists':
					err = new Error('This ' + resource + ' already exists.');
					break;
			}

			return err != null;
		})

		if (hasSpecial) {
			reject(err);
			return;
		}

		reject(data);
	})

	return promise;
}

function uploadAssets(data, manifest) {
	var promise = new Promise(function (resolve, reject) {
		var assets = manifest.assets;
		if (!assets) reject(new Error('Sorry, assets are missing from your conig file'));

		async.each(assets, function (single, cb) {
			
			var fullpath = path.join(process.cwd(), single.path);
			var client = initGithubClient(manifest);

			try {

				var name = path.basename(single.path);
				client.releases.uploadAsset(
					{
						id: data.id,
						owner: manifest.user,
						repo: manifest.repository,
						name: name,
						filePath: fullpath
					}, function (err, response) {
						if (err) {
							logger.warn(name + ' already exists.')
						}

						cb();
					});
			} catch (error) {
				reject(error);
			}
		}, function (err) {
			if (err) {
				reject(err);
				return;
			}
			resolve();	
		})

	});

	return promise;
}

module.exports.initConnection = initConnection;
module.exports.uploadAssets = uploadAssets;
module.exports.parseValidation = parseValidation;
module.exports.getAppInfo = getAppInfo;
module.exports.getManifest = getManifest;