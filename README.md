### grunt-contrib-sprites-preprocessor

A grunt wrapper around https://github.com/madebysource/sprites-preprocessor

The only sprites generator I found, that handles CSS replacement well enough.

### usage

```javascript

    grunt.initConfig({
    	'sprite-preprocessor': {
    		options: {
				// generated img name, defaults to 'sprite.png'
				// maps to https://github.com/madebysource/sprites-preprocessor#name
				spriteFileName: 'sprite.png',

				// where all the images for the src CSS files live, defaults to 'src/assets'
				// maps to https://github.com/madebysource/sprites-preprocessor#path
				srcImagesDir: 'src/assets',

				// a mutual prefix to all the urls in the CSS content
				// maps to https://github.com/madebysource/sprites-preprocessor#prefix
				cssUrlsPrefixedWith: 'assets/',

				// destination directory of the sprite, if 'spriteDestDir' is not specified it defaults to the value of 'srcImagesDir'
				spriteDestDir: 'dist/assets'

				// few general grunt task options

				separator: '', // in case you have more than 1 src css file,
				filter: 'isFile' // or a function
				// see http://gruntjs.com/configuring-tasks#files
            },
    		files: {
    			'dest/style.with.sprites.css': ['src/style.css' /* you can add more, they willl just be concatenated */]
    		}
    	}
    });

    grunt.loadNpmTasks("grunt-contrib-sprites-preprocessor");

```

```bash

npm install grunt-contrib-sprites-preprocessor
grunt sprites-preprocessor

```

### requirements

whatever [spritesmith](https://github.com/Ensighten/spritesmith) requires, I had to

```
brew install cairo
sudo npm install -g phantomjs

# and
export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig
```
