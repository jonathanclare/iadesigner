# INSTALL DEPENDENCIES

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
If you wish to use Git download and install from [Git](https://git-scm.com/downloads)

# INSTALL APP 

Install NPM project dependencies, build and run the app.

Run the following commands in a command prompt opened from this directory. 

```sh
> npm install
```

If errors occur during this process you may need to update your versions of Node and NPM.

# DEVELOPMENT

Run the following commands in a command prompt opened from this directory. 

### Automatically build the app when code changes are made  
```sh
> grunt watch
```

### Build the code 
```sh
> grunt build
```

### Start the App 
```sh
> npm start
```

# PACKAGE

Run the following command in a command prompt opened from this directory. 

### Package and build Electron App for web download

Version change in package.json is automated.

Version remains unchanged 0.0.0
```sh
> npm run package:web
```

Version bumped to 0.0.1-0
```sh
> npm run package:prepatch
```

Version bumped to 0.0.1-1

When prerelease is used ./package/nsis-web/latest.yml is not generated.
Instead the prerelease number (ie -1) is used to generate  ./package/nsis-web/1.yml.
This makes sure end users arent accidentally upgraded to a prelease version.
But you will have to run the .exe file to install and test the app as autoUpdater wont work because latest.yml has not changed.
We cant just rename 1.yml to latest.yml and hope autoUpdater will work because it will be looking for 1.yml.

```sh
> npm run package:prerelease
```

Version bumped to 0.0.1
```sh
> npm run package:patch
```

Version bumped to 0.1.1-0
```sh
> npm run package:preminor
```

Version bumped to 0.1.1
```sh
> npm run package:minor
```

Version bumped to 1.1.1-0
```sh
> npm run package:premajor
```

Version bumped to 1.1.1
```sh
> npm run package:major
```

### Handling Git errors during packaging

When packaging the app you will automatically commit and create a new release on github: 

To switch this off make the following changes to the 'bump' attributes in gruntfile.js:

* commit: false
* createTag: false
* push: false

#### Error 1

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

#### Error 2

```sh
> github --credentials get: github: command not found
```
  
Try installing [Git](https://git-scm.com/downloads)

#### Error 3

```sh
> This repository is configured for Git LFS but 'git-lfs' was not found on your path
```

see [Dealing with annoying git error](https://stackoverflow.com/questions/36848741/dealing-with-annoying-git-error)

* Open '.git\hooks\pre-push and comment out all the lines in the file.

# CHANGELOG

Record changes in changelog.json - do not edit CHANGELOG.md or ./website/release-notes.html. These are generated using 'grunt buildWebsite'