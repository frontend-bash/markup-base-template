var gulp = require('gulp'),
      filter = require('gulp-filter'),
      browserSync  = require("browser-sync").create(),
      sass = require('gulp-sass'),
      sourcemaps   = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      clean = require('gulp-clean'),
      csscomb = require('gulp-csscomb'),
      uglify = require('gulp-uglify'),
      minifyCss = require('gulp-minify-css'),
      // sprite = require('gulp-sprite'),
      cmq = require('gulp-combine-media-queries'),
      reload = browserSync.reload;

// extra config vars
var config = {
  scssDir: 'scss/',
  cssDir: 'css/',
  jsDir: 'js/',
  sourceImgDir: 'sourceimages/',
  imgDir: 'images/',
  logCMQ: false,
  // spriteDir: 'sourceimages/sprites/',
  // spriteScssDir: 'scss/components/',
  autoprefixConf : ['> 1%', 'last 5 versions', 'Firefox ESR', 'Opera 12.1']
}
 
// gulp.task('sprites', function () {
//     gulp.src(config.spriteDir + '*.*')
//       .pipe(sprite('sprites.png', {
//         imagePath: config.imgDir,
//         cssPath: config.spriteScssDir,
//         preprocessor: 'scss',
//         prefix: 'sprite-',
//         margin: 6
//       }))
//       .pipe(gulp.dest('./dist/img/'));
// });

gulp.task('clean', function () {
  return gulp.src(config.cssDir + '*.*', {read: false})
    .pipe(clean());
});

gulp.task('jsmin', function() {
  return gulp.src(config.jsDir + '*.js')
    .pipe(uglify())
    .pipe(gulp.dest(config.jsDir));
});

gulp.task('cssmin', function() {
  return gulp.src(config.cssDir + '*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest(config.cssDir));
});

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: {
      baseDir: "./",
      directory: true
    }
  });

  gulp.watch(config.scssDir + "**/*.scss", ['sass']);
  gulp.watch(config.sourceImgDir + "**/*", ['imgmin']);
  gulp.watch("*.html").on('change', reload);
  gulp.watch(config.jsDir + "*.js").on('change', reload);
});

gulp.task('imgmin', function() {
  return gulp.src(config.sourceImgDir + '**/*.*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(config.imgDir));
});


gulp.task('sass', function () {
  return gulp.src(config.scssDir + '**/*.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass())
    .on('error', function(err){
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(sourcemaps.write())// Write the CSS & Source maps
    .pipe(autoprefixer({
      browsers: config.autoprefixConf,
      cascade: false
    }))
    .pipe(gulp.dest(config.cssDir))
    .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('sass:dist', function () {
  return gulp.src(config.scssDir + '**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: config.autoprefixConf,
      cascade: false
    }))
    .pipe(cmq({
      log: config.logCMQ
    }))
    .pipe(csscomb())
    .pipe(gulp.dest(config.cssDir))
});


gulp.task('default', ['serve']);
gulp.task('dist', ['clean', 'sass:dist']);
// gulp.task('dist', ['clean', 'sass:dist', 'imgmin']);

