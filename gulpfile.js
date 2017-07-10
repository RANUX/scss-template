var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var pxtorem = require('postcss-pxtorem');
var del  = require('del');
var path = require('path');
var options = {nspaces:2};
var converter = require('sass-convert');
var vfs = require('vinyl-fs');
var googleWebFonts = require('gulp-google-webfonts');
var minifyCss = require('gulp-minify-css');
var pug = require('gulp-pug');


var srcDir = 'src';
var pugDir = srcDir+"/pug";
var copyCssBundleTo = ''; // copy cssBundle to some other project dir

gulp.task('sass', function() {                  // Создаем таск Sass

  var processors = [
       autoprefixer('> 5%', 'ie >= 9', 'safari 5', 'ios 6', 'android 4'),
       pxtorem({
         rootValue: 10,
          propList: ['*']
       })
   ];

  return gulp.src(srcDir+'/sass/**/*.+(scss|sass)')     // Берем источник
      .pipe(sourcemaps.init())                          // Инициализируем sourcemap для отладки
      .pipe(sass({
          outputStyle: 'nested',                        // Возможные значения: nested, expanded, compact, compressed
          includePaths: ['node_modules/susy/sass'],
          noCache: true,
      })
      .on('error', sass.logError))                      // Преобразуем Sass в CSS посредством gulp-sass
      .pipe(postcss(processors))
      //.pipe(sourcemaps.write())
      //.pipe(minifyCss())
      .pipe(gulp.dest( srcDir+'/css') )         // Выгружаем результата в папку src/css
      .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() {  // Создаем таск browser-sync
    browserSync({                       // Выполняем browser Sync
        server: {                       // Определяем параметры сервера
            baseDir: srcDir             // Директория для сервера - src
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch(srcDir+'/sass/**/*.+(scss|sass)', ['sass']); // Наблюдение за sass файлами
    gulp.watch(srcDir+'/*.html', browserSync.reload);       // Наблюдение за HTML файлами в корне проекта
    gulp.watch(srcDir+'/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
    gulp.watch(srcDir+'/css/bundle.css', ['copy']);
    gulp.watch(pugDir+"/*.pug", ["pug2html"]);
});

// Before use install: gem install sass -v 3.4.5
gulp.task('sass2scss', function () {
  return gulp.src(srcDir+'/sass/**/*.+(scss|sass)')
    .pipe(converter({
      from: 'sass',
      to: 'scss',
      rename: true,
      force: true,
    }))
    .pipe(vfs.dest(srcDir+'/scss'));
});

// Load Google Web fonts
gulp.task('gfonts', function () {
  return gulp.src('./fonts.list')
    .pipe(googleWebFonts(options))
    .pipe(gulp.dest('src/fonts'))
  });

gulp.task('pug2html', function buildHTML() {
  return gulp.src(pugDir+"/*.pug")
    .pipe(pug({pretty: true}))  //с переносом pretty: true
    .pipe(gulp.dest(srcDir))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('copy', function () {
    if (copyCssBundleTo) {
      return gulp.src( srcDir+'/css/bundle.css')
      .pipe(gulp.dest( copyCssBundleTo ));
    }
    return gulp;
});

gulp.task('clean', function () {
  return del([path.join(srcDir, "css")]);
});

gulp.task('default', ["pug2html","sass","copy","watch"]);

gulp.task('build', ["sass2scss"]);
