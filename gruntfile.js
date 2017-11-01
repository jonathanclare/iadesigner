module.exports = function (grunt) 
{
    // Project configuration.
    grunt.initConfig(
    {
        // Fetch the package file.
        // We can use properties of this file in our code eg <%= pkg.name %> <%= pkg.version %>.
        pkg: grunt.file.readJSON('package.json'),

        // Banner displaying the project name, version and date that can be added to the top of production file.
        banner: '<%= pkg.title %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>',

        // Shorthand file reference.
        file: 
        {
            // index.html.
            index_html_src:     'src/index.html',
            index_html_build:   'build/index.src.html',
            index_html_min:     'build/index.html',

            // JavaScript.
            js_src:             'src/js/**/*.js',
            js_build:           'build/js/<%= pkg.name %>.js',
            js_min:             'build/js/<%= pkg.name %>.min.js',
            js_map:             'build/js/<%= pkg.name %>.map',

            // CSS.
            less_src:           'src/css/**/*.less',
            css_build:          'build/css/<%= pkg.name %>.css',
        },
        // Detects errors and potential problems in the js source code files and grunt file.
        jshint: 
        {
            options: 
            {
                scripturl:true // Ignore Script Url warnings.
            },
            all: ['gruntfile.js', 'src/main.js', 'src/js/<%= pkg.name %>.*.js']
        },
        // Concatenates and bundles the js source code file.
        // Adds a banner displaying the project name, version and date.
        concat: 
        {
            options: 
            {
                banner: '/* <%= banner %> */\n',
            },
            build: 
            {
                src: 
                [
                    'src/js/**/*.js'
                ],
                dest: '<%= file.js_build %>'
            }
        },
        // Removes console statements, debugger and specific blocks of code from the concatenated js file.
        // Removes blocks of code surrounded by //<validation>...//</validation>.
        groundskeeper: 
        {
            compile: 
            {
                files: 
                {
                    '<%= file.js_build %>': '<%= file.js_build %>', // 'destination': 'source'.
                }
            }
        },
        // Minimises the concatenated js file.
        // Adds a banner displaying the project name, version and date.
        // Creates a source map file.
        // Removes DEBUG code.
        uglify: 
        {
            options: 
            {
                banner: '/* <%= banner %> */',
                /*sourceMap: true,
                sourceMapName: "<%= file.js_map %>"*/
                compress: 
                {
                    // Remove debug code from minimised code.
                    global_defs: 
                    {
                        "DEBUG": false
                    },
                    dead_code: true
                }
            },
            build: 
            {
                files: 
                {
                    '<%= file.js_min %>': ['<%= file.js_build %>'],  // 'destination': 'sources'.
                    'build/main.js': ['src/main.js']  // 'destination': 'sources'.
                }
            }
        },
        // Processes the less file.
        // Adds a banner displaying the project name, version and date.
        less: 
        {
            options: 
            {
                banner: '/* <%= banner %> */',
            },
            development: 
            {
                files: 
                {
                    '<%= file.css_build %>': '<%= file.less_src %>' // 'destination': 'source'.
                }
            }
        },
        // Minimises the css file created from the less processing stage.
        cssmin: 
        {
            build: 
            {
                files: [
                {
                    expand: true,
                    cwd: 'build/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
            },
            website: 
            {
                files: [
                {
                    expand: true,
                    cwd: 'src/website/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build-website',
                    ext: '.css'
                }]
            }
        },
        // Deletes directories.
        clean: 
        {
            // Deletes build.
            build: {src: ['build']},
            // Deletes dist.
            dist: {src: ['dist']},
            // Deletes deploy.
            deploy: {src: ['deploy']},
            // Deletes website and CHANGELOG.md because compile-handlebars appends rather than overwriting the file.
            website: {src: ['build-website', 'CHANGELOG.md']}
        },
        // Copies files to the build directory.
        copy: 
        {
            build: 
            {
                files: 
                [
                    {
                        expand: true, 
                        cwd: 'src', 
                        src: ['assets/**','lib/**','img/**','config/**', '*.png', 'help.htm', 'notes.htm', 'snippet.htm'], 
                        dest: 'build'
                    }
                ]
            },
            website: 
            {
                files: 
                [
                    // Copy required website files.
                    {
                        expand: true, 
                        flatten: true, // Flattens results to a single level so directory structure isnt copied.
                        cwd: 'src/website/', 
                        src: ['web.config', '*.png'],
                        dest: 'build-website/'
                    }
                ]
            },
            deploy: 
            {
                files: 
                [
                    // Copies latest.yml to the deploy directory for autoupdates to work.
                    {
                        expand: true,
                        cwd: 'dist/nsis-web',  
                        src: '*.yml',
                        dest: 'deploy'
                    },
                    // Copies .7z and .exe files to the deploy directory.
                    {
                        expand: true,
                        cwd: 'dist',  
                        src: ['*.7z', '*.exe'],
                        dest: 'deploy'
                    },
                    // Copies website to deploy directory.
                    {
                        expand: true,
                        cwd: 'build-website',  
                        src: '**/*',
                        dest: 'deploy'
                    }
                ]
            }
        },
        // Adds a banner displaying the project name, version and date (see index.html).
        processhtml: 
        {
            options:
            {
                data: 
                {
                    banner: '<!-- <%= banner %> -->',
                    name: '<%= pkg.name %>',
                    title: '<%= pkg.title %>',
                    description: '<%= pkg.description %>',
                    keywords: '<%= pkg.keywords %>',
                    version: '<%= pkg.version %>',
                    productName:'<%= pkg.build.productName %>'
                }
            },
            build: // Processes and copies the index.html file to the build directory.
            {
                files: 
                {                                 
                    '<%= file.index_html_build %>': '<%= file.index_html_src %>', // 'destination': 'source'.
                }
            },
            website:  // Processes and copies the website files to the dist directory.
            {
                files: 
                [
                    {'build-website/index.src.html': 'src/website/index.html'}, // 'destination': 'source'.
                    {'build-website/release-notes/index.src.html': 'build-website/release-notes/index.src.html'},
                    {'build-website/help/index.src.html': 'src/website/help/index.html'}
                ]
            }
        }, 
        // Minimises html files.
        // Adds a banner displaying the project name, version and date.
        htmlmin: 
        {                                 
            options: 
            {           
                banner: '<!-- <%= banner %> -->',                    
                removeComments: true,
                collapseWhitespace: true
            },                    
            build: 
            {         
                files: 
                {                                 
                    '<%= file.index_html_min %>': '<%= file.index_html_build %>' // 'destination': 'source'.
                }
            },
            website:  // Processes and copies the website files to the dist directory.
            {
                files: 
                [     
                    {'build-website/index.html': 'build-website/index.src.html'}, // 'destination': 'source'.                   
                    {'build-website/release-notes/index.html': 'build-website/release-notes/index.src.html'},                  
                    {'build-website/help/index.html': 'build-website/help/index.src.html'},
                ]
            }
        },
        // Extracts and lists TODOs and FIXMEs from code.
        todos: 
        {
            all: 
            {
                src: ['gruntfile.js', '<%= file.js_src %>'],
                options: 
                {
                    verbose: false,
                    reporter: 
                    {
                        fileTasks: function (file, tasks) 
                        {
                            if (!tasks.length) 
                            {
                                return '';
                            }
                            var result = '';
                            result += file + '\n';
                            tasks.forEach(function (task) 
                            {
                                result += task.lineNumber + ': ' + task.line + '\n';
                            });
                            result += '\n';
                            return result;
                        }
                    }
                }
            }
        },
        // Zips up the build directory.
        compress: 
        {
            main: 
            {
                options: 
                {
                    archive: 'build/<%= pkg.name %>.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: ''
            }
        },
        // '>grunt watch' Runs the 'build' task if changes are made to the listed file.
        // Enable by typing '>grunt watch' into a command prompt.
        watch:
        {
            // livereload reloads any html pages that contain <script src="http://localhost:35729/livereload.js"></script>
            // see http://stackoverflow.com/a/16430183
            options: { livereload: true },
            files: ['src/**/*.*'],
            tasks: ['build']
        },
        /*
        // Create packages Electron using electron-packager.
        'electron-packager': 
        {
            build: 
            {
                options:
                {
                    platform        : 'win32',  // linux, win32, darwin, mas, all.
                    arch            : 'x64',    // ia32, x64, armv7l, all.
                    dir             : './',
                    out             : '<%= pkg.name %>-<%= pkg.version %>',
                    icon            : 'build/assets/ia.ico',
                    ignore          : 'src',
                    name            : '<%= pkg.name %>',
                    overwrite : true
                }
            }
        },
        // Create installers for electron packages.
        'create-windows-installer': 
        {
            x64: 
            {
                appDirectory: '<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-win32-x64',
                outputDirectory: '<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-win32-x64-installer',
                authors: 'Geowise Ltd',
                exe: '<%= pkg.name %>.exe'
            },
            ia32: 
            {
                appDirectory: '/tmp/build/my-app-32',
                outputDirectory: '/tmp/build/installer32',
                authors: 'My App Inc.',
                exe: 'myapp.exe'
            }
        },
        */
        // Handlebars.
        handlebars: 
        {
            compile: 
            {
                options: 
                {
                    namespace: '<%= pkg.name %>',
                    processName: function(filePath) 
                    { 
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1];
                    }
                },
                files: 
                {
                    'src/js/handlebars.templates.js': ['src/handlebars/*.handlebars']
                }
            }
        },
        // Precompiles handlebars templates into html files.
        'compile-handlebars': 
        {
            website: 
            {
                files: 
                [
                    {
                        src: 'src/website/release-notes/release-notes.handlebars',
                        dest: 'build-website/release-notes/index.src.html'
                    },
                    {
                        src: 'changelog.handlebars',
                        dest: 'CHANGELOG.md'
                    }
                ],
                templateData: 'changelog.json'
            }
        },
        // Used this to experiment with deploy dist to online.
        'ftp-deploy': 
        {
            build: 
            {
                auth: 
                {
                    host: 'waws-prod-db3-025.ftp.azurewebsites.windows.net',
                    authKey: 'key1'
                },
                src: 'deploy',
                dest: 'site/wwwroot/designer/'
            }
        },
        /*
        Bump the version number in package.json.grunt 

        bump
        >> Version bumped to 0.0.2

        grunt bump:patch
        >> Version bumped to 0.0.3

        grunt bump:minor
        >> Version bumped to 0.1.0

        grunt bump
        >> Version bumped to 0.1.1

        grunt bump:major
        >> Version bumped to 1.0.0

        grunt bump --setversion=2.0.0
        >> Version bumped to 2.0.0

        To switch off github commits make the following changes:
        commit: false
        createTag: false
        push: false
        */
        'bump': 
        {
            options: 
            {
                commit: true,
                createTag: true,
                push: true,
                /*commit: false,
                createTag: false,
                push: false,*/
                files: ['package.json'],
                updateConfigs: [],
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                pushTo: 'origin', // origin is the name of this remote repository
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        }
    });

    // Load the plugins that provide the tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    /*grunt.loadNpmTasks('grunt-electron-packager');
    grunt.loadNpmTasks('grunt-electron-installer');*/
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.loadNpmTasks('grunt-groundskeeper');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-todos');

    // Tasks that can be run from the command line.
    // Open command prompt in this directory (shift + right click > Open command window here) to run tasks.

    // '>grunt watch' Runs the 'build' task if changes are made to the listed file.

    // '>grunt todos' Extracts and lists TODOs and FIXMEs from code.

    // '>grunt ftp-deploy' Run this to ftp the deploy folder.

    // '>grunt build-deploy' 
    // Run this to build the deploy folder.
    grunt.registerTask('build-deploy', ['clean:deploy', 'copy:deploy']);

    // '>grunt build-website' 
    // Run this to build the release notes.
    grunt.registerTask('build-website', ['clean:website', 'compile-handlebars:website', 'processhtml:website', 'htmlmin:website', 'copy:website', 'cssmin:website']);

    // '>grunt build-index-html' 
    // Run this to build the html files during development.
    grunt.registerTask('build-index-html', ['processhtml:build', 'htmlmin:build']);

    // '>grunt build-css' 
    // Run this to build the css files during development.
    grunt.registerTask('build-css', ['less', 'cssmin:build']);

    // '>grunt build-js' 
    // Run this to build the js files during development.
    grunt.registerTask('build-js', ['handlebars', 'jshint', 'concat', 'groundskeeper', 'uglify']);

    // '>grunt copy-files' 
    // Run this to copy the extra files during development.
    grunt.registerTask('copy-files', ['copy:build']);

    // '>grunt build' 
    // Run this to build the app.
    grunt.registerTask('build', ['clean:build','build-index-html', 'build-css', 'build-js', 'copy-files', 'build-website']);      

    // '>grunt package' 
    // Run this to package as an electron app.
    //grunt.registerTask('package', ['electron-packager']);

    // '>grunt installer' 
    // Create an installer for the electron app.
    //grunt.registerTask('installer', ['create-windows-installer']);

    // '>grunt' 
    // Run this to do the full build from start to finish.              
    grunt.registerTask('default', ['build']);    
};