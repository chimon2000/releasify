# github-release

Easily integrate GitHub releases in your build automation or do it all from the CLI.

## Dependencies
- [yargs](https://github.com/bcoe/yargs)
- [inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [chalk](https://github.com/chalk/chalk)
- [octokat](https://github.com/philschatz/octokat.js)

## Manifest Options 

**Required**
`github-release.repository` - *String* 

The repository name

`github-release.auth` - *String* 

The authentication token

`github-release.root` - *String*

The root url of GitHub


**Optional**
`assets` - *Array*

An array of asset objects containing the following:

> `path` - *String*

> The path of the asset

> `mime` - *String*

> The mime type of the asset


## commands

`list` - Gets the tags of every release

`lastest` - Gets the tags of the latest release

`create` - Creates a new release

`delete-latest` - Delete the latest release

`delete-all` - Delete all releaseses



