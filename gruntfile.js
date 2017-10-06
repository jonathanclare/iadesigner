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
            index_html_src:     '<%= pkg.dir.src %>/index.html',
            index_html_build:   '<%= pkg.dir.build %>/index.src.html',
            index_html_min:     '<%= pkg.dir.build %>/index.html',

            // JavaScript.
            js_src:             '<%= pkg.dir.src %>/js/**/*.js',
            js_build:           '<%= pkg.dir.build %>/js/<%= pkg.name %>.js',
            js_min:             '<%= pkg.dir.build %>/js/<%= pkg.name %>.min.js',
            js_map:             '<%= pkg.dir.build %>/js/<%= pkg.name %>.map',

            // CSS.
            less_src:           '<%= pkg.dir.src %>/css/**/*.less',
            css_build:          '<%= pkg.dir.build %>/css/<%= pkg.name %>.css',
        },
        // Detects errors and potential problems in the js source code files and grunt file.
        jshint: 
        {
            options: 
            {
                scripturl:true // Ignore Script Url warnings.
            },
            all: ['gruntfile.js', 'src/main.js', '<%= pkg.dir.src %>/js/designer.*.js']
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
                    '<%= pkg.dir.build %>/main.js': ['<%= pkg.dir.src %>/main.js']  // 'destination': 'sources'.
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
                    cwd: '<%= pkg.dir.build %>/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= pkg.dir.build %>/css',
                    ext: '.min.css'
                }]
            },
            website: 
            {
                files: [
                {
                    expand: true,
                    cwd: '<%= pkg.dir.src %>/website/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= pkg.dir.dist %>',
                    ext: '.min.css'
                }]
            }
        },
        // Deletes directories.
        clean: 
        {
            // Deletes build.
            build: {src: ['<%= pkg.dir.build %>']},
            // Deletes dist.
            dist: {src: ['<%= pkg.dir.dist %>']},
            // Deletes release-notes.html because compile-handlebars appends rather than overwriting the file.
            website: {src: ['<%= pkg.dir.src %>/website/release-notes.html', 'CHANGELOG.md']}
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
                        cwd: '<%= pkg.dir.src %>', 
                        src: ['assets/**','lib/**','img/**','config/**', '*.png', 'help.htm', 'notes.htm', 'snippet.htm'], 
                        dest: '<%= pkg.dir.build %>'
                    }
                ]
            },
            latest: 
            {
                files: 
                [
                    // Copies latest.yml to the dist directory for autoupdates to work.
                    {
                        expand: true,
                        cwd: '<%= pkg.dir.dist %>/nsis-web',  
                        src: '*.yml',
                        dest: '<%= pkg.dir.dist %>'
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
                        cwd: '<%= pkg.dir.src %>/website/', 
                        src: ['web.config', '*.png'],
                        dest: '<%= pkg.dir.dist %>/'
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
                    {'<%= pkg.dir.dist %>/index.src.html': '<%= pkg.dir.src %>/website/index.html'}, // 'destination': 'source'.
                    {'<%= pkg.dir.dist %>/release-notes/index.src.html': '<%= pkg.dir.src %>/website/release-notes.html'},
                    {'<%= pkg.dir.dist %>/help/index.src.html': '<%= pkg.dir.src %>/website/help.html'}
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
                    {'<%= pkg.dir.dist %>/index.html': '<%= pkg.dir.dist %>/index.src.html'}, // 'destination': 'source'.                   
                    {'<%= pkg.dir.dist %>/release-notes/index.html': '<%= pkg.dir.dist %>/release-notes/index.src.html'},                  
                    {'<%= pkg.dir.dist %>/help/index.html': '<%= pkg.dir.dist %>/help/index.src.html'},
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
                    archive: '<%= pkg.dir.build %>/<%= pkg.name %>.zip'
                },
                expand: true,
                cwd: '<%= pkg.dir.build %>/',
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
            files: ['<%= pkg.dir.src %>/**/*.*'],
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
                    icon            : '<%= pkg.dir.build %>/assets/ia.ico',
                    ignore          : '<%= pkg.dir.src %>',
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
                    namespace: 'designer',
                    processName: function(filePath) 
                    { 
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1];
                    }
                },
                files: 
                {
                    '<%= pkg.dir.src %>/js/handlebars.templates.js': ['<%= pkg.dir.src %>/handlebars/*.handlebars']
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
                        src: '<%= pkg.dir.src %>/website/release-notes.handlebars',
                        dest: '<%= pkg.dir.src %>/website/release-notes.html'
                    },
                    {
                        src: '<%= pkg.dir.src %>/website/changelog.handlebars',
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
                    host: 'instantatlas.com',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'package',
                dest: 'apps/'
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
        */
        'bump': 
        {
            options: 
            {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
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

    // '>grunt buildWebsite' 
    // Run this to build the release notes.
    grunt.registerTask('buildWebsite', ['clean:website', 'compile-handlebars:website', 'processhtml:website', 'htmlmin:website', 'copy:website', 'cssmin:website']);

    // '>grunt buildIndexHtml' 
    // Run this to build the html files during development.
    grunt.registerTask('buildIndexHtml', ['processhtml:build', 'htmlmin:build']);

    // '>grunt buildCss' 
    // Run this to build the css files during development.
    grunt.registerTask('buildCss', ['less', 'cssmin:build']);

    // '>grunt buildJs' 
    // Run this to build the js files during development.
    grunt.registerTask('buildJs', ['handlebars', 'jshint', 'concat', /*'groundskeeper',*/ 'uglify']);

    // '>grunt copyFiles' 
    // Run this to copy the extra files during development.
    grunt.registerTask('copyFiles', ['copy:build']);

    // '>grunt build' 
    // Run this to build the app.
    grunt.registerTask('build', ['clean:build','buildIndexHtml', 'buildCss', 'buildJs', 'copyFiles']);      

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