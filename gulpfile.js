var gulp = require("gulp"),
    gutil = require("gulp-util")
    gulpIf = require("gulp-if"),
    cleanCSS = require("gulp-clean-css"),
    imageMin = require("gulp-imagemin"),
    argv = require("yargs").argv,
    del = require("del"),
    webpack = require("webpack"),
    webpackDevServer = require("webpack-dev-server")

function onBuild(done) {
  return function(err, stats) {
    if(err) {
      console.log('Error', err);
    }
    else if(stats) {
      console.log(stats.toString());
    }

    if(done) {
      done();
    }
  }
}

function isProduction() {
  if(argv.p || argv.production) {
    return true;
  }
  else {
    return false;
  }
}
var paths = {
  build: {
    base: 'build',
    scripts: 'build/app',
    images: 'build/img',
    css: 'build/styles'
  },
  src: {
    base: 'src',
    scripts: 'src/app',
    images: 'src/img',
    css: 'src/styles'
  }
}

var webpackConfig = {
  devtool: (isProduction() ? '' : 'eval-source-map'),
  entry: __dirname + '/' + paths.src.scripts + '/main.jsx',
  output: {
    path: __dirname + "/" + paths.build.scripts,
    filename: 'bundle.js'
  },

  module: {
     loaders: [{
         test: /\.jsx?$/,
         exclude: /node-modules/,
         loader: 'babel-loader',
         query: {
           presets: [ 'es2015', 'react' ]
         }
       }]
   },

   devServer: {
    contentBase: __dirname + "/" + paths.build.scripts,
    port: '80',
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true
  },

  plugins: (isProduction() ? [
    //Define node enviroment to strip test helpers
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    //Uglify the JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false,
          screw_ie8: true
      },
      comments: false,
      sourceMap: false
    })
  ] : [])
};

gulp.task('clean-scripts', function() {
  del([paths.build.scripts+'/**/*']);
});

gulp.task('clean-images', function() {
  del([paths.build.images+'/**/*']);
});

gulp.task('clean-css', function() {
  del([paths.build.images+'/**/*']);
});

gulp.task('clean-html', function() {
  del([paths.build.base+'/**/*.html']);
});

gulp.task('clean-all', ['clean-scripts', 'clean-images', 'clean-css', 'clean-html']);

gulp.task('build-js', ['clean-scripts'], function(done) {
  if(argv.w || argv.watch) {
    webpack(webpackConfig).watch(100, onBuild());
  }
  else {
    webpack(webpackConfig).run(onBuild(done));
  }
});

gulp.task('serve', ['watch'], function(){
  new webpackDevServer(webpack(webpackConfig), {
    publicPath: paths.build.base,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    });
});

function buildCSS() {
  return gulp.src(paths.src.css + '/**/*.css')
    .pipe(gulpIf(isProduction(), cleanCSS()))
    .pipe(gulp.dest(paths.build.css));
}

function buildImages() {
  return gulp.src(paths.src.images + '/**/*')
    .pipe(imageMin())
    .pipe(gulp.dest(paths.build.images));
}

function buildHtml() {
  return gulp.src(paths.src.base+'/**/*.html')
    .pipe(gulp.dest(paths.build.base));
}
gulp.task('build-css', ['clean-css'], buildCSS);

gulp.task('build-images', ['clean-images'], buildImages);

gulp.task('build-html', ['clean-html'], buildHtml);

gulp.task('watch', function(){
  gulp.watch(paths.src.css+'/**/*.css',['build-css']);
  gulp.watch(paths.src.images+'/**/*',['build-images']);
  gulp.watch(paths.src.base+'/**/*.html',['build-html']);
});

gulp.task('default', ['clean-all', 'build-js', 'build-css', 'build-images', 'build-html']);
