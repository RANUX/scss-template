var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var pxtorem = require('postcss-pxtorem');

var appDir = 'app';

gulp.task('sass', function() {                  // Создаем таск Sass

  var processors = [
       autoprefixer('> 5%', 'ie >= 9'),
       pxtorem({
         rootValue: 10,
          propList: ['*']
       })
   ];

  return gulp.src(appDir+'/scss/**/*.+(scss|sass)')     // Берем источник
      .pipe(sourcemaps.init())                  // Инициализируем sourcemap для отладки
      .pipe(sass({
          outputStyle: 'nested',                // Возможные значения: nested, expanded, compact, compressed
          includePaths: ['node_modules/susy/sass']
      })
      .on('error', sass.logError))            // Преобразуем Sass в CSS посредством gulp-sass
      .pipe(postcss(processors))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest( appDir+'/css') )         // Выгружаем результата в папку app/css
      .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() {  // Создаем таск browser-sync
    browserSync({                       // Выполняем browser Sync
        server: {                       // Определяем параметры сервера
            baseDir: appDir             // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});


gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch(appDir+'/scss/**/*.+(scss|sass)', ['sass']); // Наблюдение за sass файлами
    gulp.watch(appDir+'/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch(appDir+'/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js

});


gulp.task('default', ["sass","watch"]);
