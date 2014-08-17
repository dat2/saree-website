# Build Process

The build process has quite a few steps, so I will slowly add the steps here.

Any reference to `config` references the object in `build.config.js`.
I might copy this file here to prevent having to constantly switch to it.

## Building (app) JavaScript

The gulpfile will find all the files in `config.appFiles.js` and then do the following steps:

(Before all of these steps, it will `lint` our JavaScript to ensure we are writing good JavaScript.
If this step fails, it will do nothing else, so you must right proper JavaScript. )

1. concatenate them into one file called `app-built.js`
2. annotate them for angular to not break
3. uglify (minify and obfuscate to save as much space as possible)
4. prepend a header defined in `module prefix` (can delete this step)
5. append a footer defined in `module.suffix` (also can delete)
6. writes source maps so we can debug the original javascript files rather than debugging the minified files
7. saves `app-built.js` to the `config.prodDir` directory
