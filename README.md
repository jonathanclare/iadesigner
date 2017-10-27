# INSTALL DEPENDENCIES

Unless otherwise instructed run all commands from a command prompt opened from the project directory (ie this directory).

### Install Node
Check if node has already been installed by opening a command prompt and running the following command: 
```sh
> node -v
```
If not already installed download and install Node from https://nodejs.org/en/

### Install the Grunt CLI
Install the Grunt CLI by opening a command prompt as Administrator and running the following command: 
```sh
> npm install -g grunt-cli
```

To make sure Grunt has been properly installed, you can run the following command:
```sh
> grunt --version
```

### Install Git
If you wish to use Git for version control, download and install from [Git](https://git-scm.com/downloads)

# INSTALL APP 

Install NPM project dependencies, build and run the app.

```sh
> npm install
```

If errors occur during this process you may need to update your versions of Node and NPM.

# DEVELOPMENT

Automatically build the app when code changes are made  
```sh
> grunt watch
```

Build the code during development
```sh
> grunt build
```

Start the App 
```sh
> npm start
```

# VERSION CONTROL

Increments the version number, commits your changes and creates a new release on github: 

Version bumped to 0.0.1-0
```sh
> grunt bump:prepatch
```

Version bumped to 0.0.1-1

```sh
> grunt bump:prerelease
```

Version bumped to 0.0.1
```sh
> grunt bump:patch
```

Version bumped to 0.1.1-0
```sh
> grunt bump:preminor
```

Version bumped to 0.1.1
```sh
> grunt bump:minor
```

Version bumped to 1.1.1-0
```sh
> grunt bump:premajor
```

Version bumped to 1.1.1
```sh
> grunt bump:major
```

When a pre bump is used ./dist/nsis-web/latest.yml is not generated.
Instead the pre number (ie -1) is used to generate ./dist/nsis-web/1.yml.
This makes sure end users arent accidentally upgraded to a prelease version.
But you will have to run the .exe file to install and test the app as autoUpdater wont work because latest.yml has not changed.
We cant just rename 1.yml to latest.yml and hope autoUpdater will work because it will be looking for 1.yml.

To switch off github commits make the following changes to the *bump* attributes in gruntfile.js:

* commit: false
* createTag: false
* push: false

## Potential GitHub Errors

### Error 1

```sh
> Fatal error: Can not create the commit: 'git' is not recognized as an internal or external command, operable program or batch file
```

see ['git' is not recognized as an internal or external command](https://stackoverflow.com/questions/4492979/git-is-not-recognized-as-an-internal-or-external-command)

You need to add git to your list of PATH environment variables.

* Right-click "My Computer"
* Select "Properties"
* Open "Advanced"
* Click "Environment Variables"
* Highlight the "Path" variable
* Click "Edit"
* Add your specific path to front of "Variable value" field, separated by a semicolon from the existing entry. Do not add a space between ; and last entry
* In windows 7 the path could be: ;C:\Program Files (x86)\Git\bin;C:\Program Files (x86)\Git\cmd;
* And Don't Forget to close and reopen your command prompt!! 

### Error 2

```sh
> github --credentials get: github: command not found
```
  
Try installing [Git](https://git-scm.com/downloads)

### Error 3

```sh
> This repository is configured for Git LFS but 'git-lfs' was not found on your path
```

see [Dealing with annoying git error](https://stackoverflow.com/questions/36848741/dealing-with-annoying-git-error)

* Open .git\hooks\pre-push and comment out all the lines in the file.


# PACKAGE

Use the following command to generate *dist* and *deploy* folders.

*dist* contains the application files.

*deploy* contains the required application files plus the website files. This is the folder that will be deployed to the web.

```sh
> npm run dist:web
```

# DEPLOYMENT

```sh
> grunt ftp-deploy
```

This will transfer the *deploy* directory to https://online.instantatlas.com/designer/ using ftp://waws-prod-db3-025.ftp.azurewebsites.windows.net

Usernames and passwords for the site should be stored in a json file named .ftppass in the project folder using the following format:

```javascript
{
	"key1": 
	{
		"username": "username1",
		"password": "password1"
	}
} 
```

Replace *username1* and *password1* with the correct values found in *O:\InstantAtlas Online (IAO)\Entry Level\AzureConnections.docx*

# CHANGELOG

Record changes in changelog.json - do not edit *CHANGELOG.md* or *./website/release-notes.html*. These are generated using *grunt build-website*