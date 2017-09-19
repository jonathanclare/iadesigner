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

Version remains unchanged
```sh
> npm run dist:web
```

Version bumped to 0.0.1
```sh
> npm run dist:patch
```

Version bumped to 0.1.1
```sh
> npm run dist:minor
```

Version bumped to 1.1.1
```sh
> npm run dist:major
```