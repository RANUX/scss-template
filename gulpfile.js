var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var pxtorem = require('postcss-pxtorem');

var srcDir = 'src';

gulp.task('sass', function() {                  // Создаем таск Sass

  var processors = [
       autoprefixer('> 5%', 'ie >= 9'),
       pxtorem({
         rootValue: 10,
          propList: ['*']
       })
   ];

  return gulp.src(srcDir+'/scss/**/*.+(scss|sass)')     // Берем источник
      .pipe(sourcemaps.init())                  // Инициализируем sourcemap для отладки
      .pipe(sass({
          outputStyle: 'nested',                // Возможные значения: nested, expanded, compact, compressed
          includePaths: ['node_modules/susy/sass']
      })
      .on('error', sass.logError))            // Преобразуем Sass в CSS посредством gulp-sass
      .pipe(postcss(processors))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest( srcDir+'/css') )         // Выгружаем результата в папку app/css
      .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() {  // Создаем таск browser-sync
    browserSync({                       // Выполняем browser Sync
        server: {                       // Определяем параметры сервера
            baseDir: srcDir             // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch(srcDir+'/scss/**/*.+(scss|sass)', ['sass']); // Наблюдение за sass файлами
    gulp.watch(srcDir+'/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch(srcDir+'/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js

});


gulp.task('default', ["sass","watch"]);
