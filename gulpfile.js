var gulp = require('gulp'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minifyJs = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    wiredep = require('wiredep').stream;

//raw paths
var rawPaths = {
  ejsTemplates: ['raw/views/html-template/header.ejs','raw/views/html-template/footer.ejs'],
  ejsPages: ['raw/views/*.ejs'],
  handleBars: [],
  scss: 'raw/scss/**/*.scss',
  js: 'raw/js/**.js',
  img: 'raw/img/*',
};

//distribution paths -> public
var publicPath ={
  ejsTemplates: 'public/views/html-templates',
  ejsPages: 'public/views/',
  css: './public/css',
  js:  './public/js',
  img: './public/img',
};


/**********************************************************************/

//wiredep bower //inject css
gulp.task('inject', function(){
  //wiredep options
  var options = {
    bowerJson: require('./bower.json'), // where our bower.json file resides
    directory: './public/lib', //where the bower components are located
    ignorePath: '../../\../public' // trims the path file in our link hrefs
  };

  //injectSrc options
  //specify build path
  var injectSrc = gulp.src(['./public/css/*.css','./public/js/*.js'],{read:false});
  var injectOptions = {
    ignorePath: '/public'
  };
   return gulp.src(rawPaths.ejsTemplates)
      .pipe(plumber())
      .pipe(wiredep(options))
      .pipe(inject(injectSrc,injectOptions))
      .pipe(gulp.dest(publicPath.ejsTemplates));
});

/**********************************************************************/


/**********************************************************************/

//gulp-sass
gulp.task('sass',function(){
  return gulp.src(rawPaths.scss)
         .pipe(plumber())
         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
         .pipe(prefix())
         .pipe(rename('main.min.css'))
         .pipe(gulp.dest(publicPath.css));
});

/**********************************************************************/

/**********************************************************************/

//Scripts
gulp.task('js', function(){
  return gulp.src(rawPaths.js)
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(minifyJs())
        .pipe(gulp.dest(publicPath.js));
});

/**********************************************************************/

//Image Minify
gulp.task('image', function(){
  return gulp.src(rawPaths.img)
         .pipe(plumber())
         .pipe(imagemin())
         .pipe(gulp.dest(publicPath.img));
});

/**********************************************************************/

//Gulp watch
gulp.task('watch', function(){
  gulp.watch(rawPaths.js,['js']);
  gulp.watch(rawPaths.scss,['sass']);
  gulp.watch('raw/img/*',['image']);
  gulp.watch('raw/views/**.*');
});

/**********************************************************************/
//1st gulp-compile
gulp.task('compile', ['sass','js','image']);

// 2nd template task
gulp.task('template', ['inject']);


//gulp default
gulp.task('default', ['compile','template','transfer','watch']);
/**********************************************************************/


/**********************************************************************/
//Optional Task
//transfer ejs components to public
gulp.task('transfer', function(){
  return gulp.src(rawPaths.ejsPages)
         .pipe(plumber())
         .pipe(gulp.dest(publicPath.ejsPages));
});

/**********************************************************************/
