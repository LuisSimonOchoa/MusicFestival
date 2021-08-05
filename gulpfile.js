const { series, src, dest, watch, parallel} = require('gulp'); // gulp tiene muchas funciones, src: ubica los archivos SASS, dest: ruta donde se guardara la version compilada de SASS (CSS)
const sass = require('gulp-sass')(require('sass')); // gulp-sass es una funcion de gulp
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

// Utilidades CSS
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

// Utilidades JS
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const paths = {
    imagenes: 'src/img/**/*',
    js: 'src/js/**/*.js'
}

// Funcion que compila SASS
function compilar_sass( ) {
    return src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer(), cssnano() ] ))
        .pipe( sourcemaps.write('.') )
        .pipe( dest('./build/css') )
}

function minificar_css( ) {
    return src('src/scss/app.scss')
        .pipe( sass({
            outputStyle: 'compressed'
        }))
        .pipe( dest('./build/css') )
}

function javascript() {
    return src(paths.js)
        .pipe( sourcemaps.init() )
        .pipe( concat('bundle.js') )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( rename({ suffix: '.min' }) )
        .pipe( dest('./build/js') )
}

function imagenes() {
    return src(paths.imagenes)
        .pipe( imagemin() )
        .pipe( dest('./build/img'))
        .pipe( notify({ message: 'Imagen Minificada'}) )
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe( dest('./build/img') )
        .pipe( notify({ message: 'Version webp lista'}) )
}

function watchArchivos() {
    watch('src/scss/**/*.scss', compilar_sass); // watch: compila automaticamente app.scss a css ante un cambio
    watch( paths.js, javascript);
} // *.scss: escucha todos los archivos con la extensión .scss en la carpeta actual
// **/*: escucha todos los archivos con la extensión .scss en la carpeta actual y sus sub carpetas
exports.compilar_sass = compilar_sass;
exports.minificar_css = minificar_css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.watchArchivos = watchArchivos;

exports.default = series( compilar_sass, imagenes, versionWebp, watchArchivos );