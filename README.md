## Configurable SASS project template


### Libs

* https://github.com/sass/node-sass
* https://github.com/postcss/autoprefixer


### Setup

npm install

### Configure
Open ```src/scss/base/*.scss``` and configure for your project needs.

Watch and configure ```gulpfile.js``` for your needs

### Susy
Add imports at the beginning of bundle.sass:
```css
@import "susy"
@import "susy-conf.scss"
```

### Mixins

##### Fonts
Get google fonts
```bash
gulp gfonts
```
Use fonts
```css
+font-face('Lato', '/fonts/Lato-Thin', 100, normal, woff ttf svg)
```



### Reference articles

Gulp, Sass, Autoprefixer, Sourcemaps!

https://github.com/ai/browserslist

https://github.com/sass/node-sass#options

https://fettblog.eu/blog/2014/04/10/gulp-sass-autoprefixer-sourcemaps/
