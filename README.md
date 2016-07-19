# react-starter
React project boilerplate, with webpack. Automatically minifies JS and images in production builds.

# Installation
Just run npm to install dependancies

```bash
$ npm install
```

# Config
All config is done in gulpfile.js.

Common paths are in the `paths` variable, and webpack config is in the `webpackConfig` variable.

# Usage
Pass  the `-p` or `-production` flag to a task to enable production features such as minification, or stripping of map files.

The default gulp task cleans the entire directory, then builds and copies HTML, CSS and JS into the build directory.

**Cleaning**

* `gulp clean-all` - Cleans the entire build directory.
* `gulp clean-scripts` - Cleans the build scripts directory.
* `gulp clean-images` - Cleans the build images directory.
* `gulp clean-css` - Cleans the build css directory.
* `gulp clean-html` - Cleans html files from the build directory.

**Building**

* `gulp build-js` - Uses webpack to build the JS, and copy into the build directory. Transpiles JSX if necessary. ES2015 is supported.
* `gulp build-css` - Copies CSS into the build directory. Minifies if production.
* `gulp build-images` - Minifies images, and copies the minified images into the build directory.
* `gulp build-html` - Copies HTML into the build directory.

**Dev**

* `gulp webpack-server` - Runs webpack-dev-server, and hot swaps out changes to any JS or JSX code.
