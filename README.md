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

# INSTALL APP 

Install NPM project dependencies, build and run the app.

Run the following commands in a command prompt opened from this directory. 

```sh
> npm install
```

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
> npm run dist:web
```

Version bumped to 0.0.1-0
```sh
> npm run dist:prepatch
```

Version bumped to 0.0.1-1

When prerelease is used ./dist/nsis-web/latest.yml is not generated.
Instead the prerelease number (ie -1) is used to generate  ./dist/nsis-web/1.yml.
This makes sure end users arent accidentally upgraded to a prelease version.
But you will have to run the .exe file to install and test the app as autoUpdater wont work because latest.yml has not changed.
We cant just rename 1.yml to latest.yml and hope autoUpdater will work because it will be looking for 1.yml.

```sh
> npm run dist:prerelease
```

Version bumped to 0.0.1
```sh
> npm run dist:patch
```

Version bumped to 0.1.1-0
```sh
> npm run dist:preminor
```

Version bumped to 0.1.1
```sh
> npm run dist:minor
```

Version bumped to 1.1.1-0
```sh
> npm run dist:premajor
```

Version bumped to 1.1.1
```sh
> npm run dist:major
```

# CHANGELOG

Record changes in changelog.json - do not edit CHANGELOG.md or ./website/release-notes.html. These are generated on 'grunt buildWebsite'