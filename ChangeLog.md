
## August 24 2014

#### Client side
All the urls have been updated in the build process:

1. `src/images` can now be just `images` (The build process copies images, fonts, and
other stuff to the temporary directory, and the server serves files statically from
the temporary directory.)
2. `src/app/views` can now be just `views` (If you run a gulp build, and see templates-app
you will see that this file "prewarms" the template cache, so angular doesn't have to
make an http request, it just loads it directly from local cache. The main 'website' 
module includes 'templates-*' as a dependency to make sure this happens.)
3. Same for `src/app/components` (the corresponding template file is templates-components)

These urls can be used anywhere, for example, in the main index.html there is `components
/header/header.html` now.

Also, we are now using a combination of the `main-bower-files` and `gulp-inject` modules
so we don't have to add bower dependencies manually anymore :D. If you want to add a
bower component, just run `bower install <component>`, save `index.html` and then it
will automatically be included :D. As a consequence of `gulp-inject`, we also don't
have to manually include our style files into the app.scss file :D, and our styles still
get built into one main css file :D.

However, adding a new component or a new view doesn't trigger any watches (but it gets
included by gulp-inject when you save another file that does trigger a watch)
So, for example, if you had a directory structure like this:
```bash
views/
	sarees/
		# these files are being watched
		# if you save a file in here, it triggers the watch, and gulp-inject includes
		  the new_contact_view files
	new_contact_view/
		# these files do not trigger the watch
```
The reason for this is that src/app/**.js gets resolved at the time of calling 
`gulp.watch`, so this means it gets translated into all existing files, and new files
do NOT get watched. I haven't quite figured out how to create this behaviour, but it
isn't that important. You can just restart the server to get it watched.

#### Server Side
Yesterday, I decided to use koa, while node versions v0.11.x aren't stable yet,
so nothing worked on osx. I reverted node back to v0.10.31, and replaced koa
with express. You can view `server/index.js` to see there isn't much of a difference.

#### To Do
1. Replace bower files with CDN links for production.
2. Figure out how to only include above the fold CSS to improve initial loading.
(This is non trivial)
3. Setup the server to use gzipping
4. Setup revisioned assets and use aggressive caching.
5. Optimize images (also, create a favicon.ico and create a smaller version of the main logo)
6. Minify the main index.html
7. Put this To Do list somewhere else :P
