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

### Install NPM project dependencies 

npm install will install, build and distribute the project.

Run the following commands in a command prompt opened from this directory. 

```sh
> npm install
```

# BUILD THE PROJECT

Run the following command in a command prompt opened from this directory. 

### Build 
```sh
> grunt
```

# DEVELOPMENT

Run the following commands in a command prompt opened from this directory. 

### Watches for code changes and automatically updates the web page  
```sh
> grunt watch
```

### Build the code 
```sh
> grunt build
```

### Start Electron App 
```sh
> npm start
```

# PACKAGE AND BUILD

Run the following command in a command prompt opened from this directory. 

### Package and build Electron App for web download

when using 'npm run dist:web' you need to copy ./dist/nsisweb/latest.yaml to ./dist/latest.yaml

```sh
> npm run dist:web
```
