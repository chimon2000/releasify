# releasify

Easily integrate GitHub releases in your build automation or do it all from the CLI.

**Important:** Currently only supports Node >= v4.0.0

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
```
Commands:
  latest         get latest release from GitHub
  upload         upload assets to a release in GitHub
  list           list all of the releases in GitHub
  create         create a new release in GitHub
  delete-latest  delete latest release from GitHub
  delete-all     purge GitHub of all releases

Options:
  -h, --help  Show help                                                [boolean]
```

### `latest` command options

```
Options:
  -m, --manifest  the manifest file that you would like to read from.  [string] [default: "package.json"]
  -h, --help      Show help                                            [boolean]
```

### `upload` command options

```
Options:
  -v, --version   the tag version to be used during creation            [string]
  -m, --manifest  the manifest file that you would like to read from.   [string] [default: "package.json"]
  -h, --help      Show help                                             [boolean]
```

### `list` command options

```
  -m, --manifest  the manifest file that you would like to read from.  [string] [default: "package.json"]
  -h, --help      Show help   
```

### `create` command options

```
  -a, --assets    include assets                      [boolean] [default: false]
  -v, --version   the tag version to be used during creation            [string]
  -m, --manifest  the manifest file that you would like to read from.  [string] [default: "package.json"]
  -h, --help      Show help  
```

### `delete-latest` command options

```
  -m, --manifest  the manifest file that you would like to read from.  [string] [default: "package.json"]
  -h, --help      Show help  
```

### `delete-all` command options

```
  -m, --manifest  the manifest file that you would like to read from.  [string] [default: "package.json"]
  -h, --help      Show help  
```

## Purpose
The purpose of this package is to be easily plugged into any automated build process to create releases. It can rely either on arguments or the package.json.

## Influences
[release-it](https://github.com/webpro/release-it)

## Dependencies
- [yargs](https://github.com/bcoe/yargs)
- [inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [chalk](https://github.com/chalk/chalk)
- [octokat](https://github.com/philschatz/octokat.js)

## Future Considerations
1. Support for earlier Node versions.
1. Expose module.
1. Bump versions based off latest release.
1. Option to replace existing assets.
1. Option to overwrite an existing release.

## License
[ISC](https://opensource.org/licenses/ISC)