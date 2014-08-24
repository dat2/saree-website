# How to update

1. update your remote: `git remote set-url origin https://pirave@github.com/dat2/saree-website.git`
2. Install [n](https://github.com/visionmedia/n) by running `npm install -g n`
3. run `n 0.11.13` (this is my version)
4. delete bower dependencies: `bower uninstall && bower install` from the root directory
5. run `gulp serve` from the root directory 

Note, if there are any issues, contact me.
