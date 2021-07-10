const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del')


function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowseerslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function script() {
    return src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/slick-carousel/slick/slick.js',
            'app/js/main.js',
            'node_modules/mixitup/dist/mixitup.js',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js'

        ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/images/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}

function build() {
    return src([
            'app/**/*.html',
            'app/css/style.min.css',
            'app/js/main.min.js',
        ], { base: 'app' })
        .pipe(dest('dist'))
}

function clean() {
    return del('dist')
}


function watching() {
    watch(['app/scss/**/*.scss'])

    watch(['app/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.script = script;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;

exports.build = series(clean, images, build);
exports.clean = clean;

exports.default = parallel(styles, browsersync, watching);