var gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    connect = require('gulp-connect'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),

    // Using an "if" branching to produce dev/prod output
    devBuild = true, // (process.env.NODE_ENV !== 'production')

    folder = {
        src: 'src/',
        build: 'build/'
    }

function swallowError (error) {
    console.log(error.toString())
    this.emit('end')
}

// Image processing
gulp.task('images', function() {
    var out = folder.build + 'images'
    return gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin( {optimizationLevel: 5} ))
        .pipe(gulp.dest(out))
})

// Video processing
gulp.task('video', function() {
    var out = folder.build + 'video'
    return gulp.src(folder.src + 'video/**/*')
        .pipe(newer(out))
        .pipe(gulp.dest(out))
})

// HTML processing
gulp.task('html', ['images', 'copyfonts'], function() {
    var
        out = folder.build,
        page = gulp.src(folder.src + 'html/**/*.html')
        .on('error', swallowError)
            .pipe(newer(out))
            .pipe(connect.reload())

    if (!devBuild) page = page.pipe(htmlclean())

    return page.pipe(gulp.dest(out))
})

// JS processing
gulp.task('js_split', function() {
    var out = folder.build + 'js/';
    return gulp.src(folder.src + 'js/chunks/**/*.js')
        .pipe(newer(out))
        .pipe(gulp.dest(out));
});

gulp.task('js', ['js_split'], function() {
    var jsbuild = gulp.src(folder.src + 'js/concat/*.js').on('error', swallowError)
        .pipe(deporder())
        .pipe(concat('index.js'))

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(uglify())
    }

    return jsbuild.pipe(gulp.dest(folder.build + 'js/'))
})

// CSS processing
gulp.task('css', ['images', 'copyfonts', 'video'], function() {
    var postCssOpts = [
        assets({ loadPaths: ['images/'] }),
        autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
        mqpacker
    ]

    if (!devBuild) postCssOpts.push(cssnano)

    return gulp.src(folder.src + 'scss/index.scss')
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: 'images/',
            precision: 3,
            errLogToConsole: true
        })).on('error', swallowError)
        .pipe(postcss(postCssOpts)).on('error', swallowError)
        .pipe(gulp.dest(folder.build + 'css/'))
        .pipe(connect.reload())
})

// Fonts processin
gulp.task('copyfonts', function() {
    gulp.src(folder.src + 'fonts/**/*')
        .pipe(gulp.dest(folder.build + 'fonts'))
})

// Run development webserver
gulp.task('connect', function() {
    connect.server({
        root: folder.build,
        host: '0.0.0.0',
        livereload: true
    });
})

// Run all tasks
gulp.task('run', ['html', 'css', 'js', 'connect'])

// Watch for the changes
gulp.task('watch', function() {
    gulp.watch(folder.src + 'images/**/*', ['images']);
    gulp.watch(folder.src + 'video/**/*', ['video']);
    gulp.watch(folder.src + 'html/**/*', ['html']);
    gulp.watch(folder.src + 'js/**/*', ['js']);
    gulp.watch(folder.src + 'scss/**/*', ['css']);
    gulp.watch(folder.src + 'fonts/**/*', ['copyfonts']);
})

// Default dask
gulp.task('default', ['run','watch'])
