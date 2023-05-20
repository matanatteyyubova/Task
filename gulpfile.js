var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer'),
    fileinclude = require('gulp-file-include');


/*  ----==== All Gulps Moduls ====----

    1. Scss -> Css
    2. Js Combining
    3. BrowserSync
    4. Delete Dist Folder
    5. Html Component Include
    6. Build project
    7. Watching Scss

*/

// 1. Scss => Css
gulp.task('scss', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        // .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }))
});


// 2. Libs scripts concat
gulp.task('scripts', function () {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/bootstrap/js/bootstrap.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

// 3. BrowserSync RealTime refresh browser
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: true
    });
});

// 4. Dist directory clean
gulp.task('clean', function () {
    return del.sync('dist');
});

// 5. Html Component Include
gulp.task('fileinclude', function () {
    gulp.src(['app/html/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app/'));
});

// 6. Build project Dist directory
gulp.task('build', ['clean', 'scss', 'scripts'], function () {

    var buildCss = gulp.src([
        'app/css/app.min.css'
    ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

    var buildImages = gulp.src(['app/img/**/*.{gif,jpg,png,svg}'])
        .pipe(gulp.dest('dist/img'));
});

// 7. Watching Scss => Css
gulp.task('watch', ['browser-sync', 'fileinclude', 'scripts'], function () {
    gulp.watch('app/scss/**/*.scss', ['scss']);
    gulp.watch('app/html/**/*.html', ['fileinclude', browserSync.reload]);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
