module.exports = function(grunt){
    'use strict';

    grunt.initConfig({
        requirejs: {
            build: {
                options: {
                    optimize: 'none',
                    mainConfigFile: 'config.js',
                    name: 'bower_components/almond/almond',
                    preserveLicenseComments: true,
                    include: ['index'],
                    out: 'dist/canvas-compositor.js'
                }
            },
            minify: {
                options: {
                    optimize: 'uglify2',
                    mainConfigFile: 'config.js',
                    name: 'bower_components/almond/almond',
                    preserveLicenseComments: true,
                    include: ['index'],
                    out: 'dist/canvas-compositor.min.js'
                }
            }
        },
        watch: {
            options: {
                events: ['changed', 'added', 'deleted']
            },
            requirejs: {
                files: ['*.js'],
                tasks: ['clean', 'requirejs']
            }
        },
        clean: {
            js: ['dist/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['clean', 'requirejs']);

    grunt.registerTask('default', ['build']);
    grunt.registerTask('dev', ['build', 'watch']);
};