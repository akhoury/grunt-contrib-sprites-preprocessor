'use strict';

var path = require('path');
var fs = require('fs');
var sprites = require('sprites-preprocessor');
var async = require('async');

module.exports = function(grunt) {
    grunt.registerMultiTask('sprites-preprocessor', 'Generate sprites and accordingly edited CSS', function() {

        var taskOptions = this.options({
            spriteFileName: 'sprite.png',
            spriteDestDir: '',
            srcImagesDir: '',
            cssUrlsPrefixedWith: ''
        });

        var done = this.async();

        this.files.forEach(function(file) {

            var statsFns = ['isFile', 'isDirectory', 'isBlockDevice', 'isCharacterDevice', /* 'isSymbolicLink', */ 'isFIFO', 'isSocket'];
            var filter = typeof taskOptions.filter == 'function' ?
                taskOptions.filter : statsFns.indexOf(taskOptions.filter) ?
                function(filepath) {
                    return fs.statSync(filepath)[taskOptions.filter]();
                } :
                function() {
                    return true;
                };

            var files = file.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath) && filter(filepath)) {
                    grunt.log.warn('Source file ' + filepath + ' not found.');
                    return false;
                } else {
                    return true;
                }
            });

            var count = 0;

            var spritesOptions = {
                path: taskOptions.srcImagesDir,
                prefix: taskOptions.cssUrlsPrefixedWith,
                
                // custom urlRegex to ignore base64 data:images and *.gif images 
                // some info here: https://github.com/madebysource/sprites-preprocessor/pull/2
                urlRegex: new RegExp("url\\((?:'|\")?((?!(data:[^'\"\\)]+))(?!([^'\"\\)]+gif))([^'\"\\)]+))(?:'|\")?\\)(?:(.*?|\n*?|\r*?))(;|})", "gi"),
                urlRegexPathMatchIndex: 1,
                urlRegexRestMatchIndex: 5,
                urlRegexDelimiterMatchIndex: 6
            };

            var nameParts = taskOptions.spriteFileName.split('.');
            var extension = nameParts.pop();
            var filename = nameParts.join('.');

            var css = '';
            async.eachLimit(files, 1, function(f, next) {
                var oldCss = grunt.file.read(f);

                spritesOptions.name = (!count ? taskOptions.spriteFileName : filename + '.' + count + '.' + extension);

                sprites(spritesOptions, oldCss, function(err, newCss, image) {
                    if (err) {
                        return next(err);
                    }
                    css += (taskOptions.separator || '') + newCss;
                    var imageFile = path.join(taskOptions.spriteDestDir || taskOptions.srcImagesDir, '/' + spritesOptions.name);
                    fs.writeFile(imageFile, image, 'binary', function() {
                        grunt.log.ok('Image file written: ' + imageFile);
                        count++;
                        next();
                    });
                });
            }, function(err) {
                if (err) {
                    return done(err);
                }

                fs.writeFile(file.dest, css, {encoding: 'utf8'}, function(err) {
                    if (err) {
                        return done(err);
                    }
                    grunt.log.ok('CSS file written: ' + file.dest);
                    done();
                });
            });
        });
    });
};
